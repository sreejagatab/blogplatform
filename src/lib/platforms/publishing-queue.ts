import { prisma } from '@/lib/prisma'
import { platformManager } from './platform-manager'
import { BlogPost, AdaptedContent, PostResult } from './types'

export interface QueueJob {
  id: string
  postId: string
  platform: string
  content: AdaptedContent
  scheduledAt?: Date
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  attempts: number
  maxAttempts: number
  error?: string
  result?: PostResult
  createdAt: Date
  updatedAt: Date
}

export interface PublishingOptions {
  platforms: string[]
  scheduledAt?: Date
  priority?: 'low' | 'normal' | 'high'
  retryOnFailure?: boolean
  maxAttempts?: number
}

export class PublishingQueue {
  private isProcessing = false
  private processingInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startProcessing()
  }

  async addToQueue(
    blogPost: BlogPost, 
    options: PublishingOptions
  ): Promise<{ success: boolean; jobIds: string[]; errors?: string[] }> {
    const jobIds: string[] = []
    const errors: string[] = []

    try {
      for (const platform of options.platforms) {
        const adapter = platformManager.getAdapter(platform)
        if (!adapter) {
          errors.push(`Platform adapter not found: ${platform}`)
          continue
        }

        try {
          // Adapt content for the platform
          const adaptedContent = await adapter.adaptContent(blogPost)
          
          // Validate content
          const validation = await adapter.validateContent(adaptedContent)
          if (!validation.valid) {
            errors.push(`Content validation failed for ${platform}: ${validation.errors?.join(', ')}`)
            continue
          }

          // Create queue job
          const job = await prisma.publishingJob.create({
            data: {
              postId: blogPost.id,
              platform,
              content: JSON.stringify(adaptedContent),
              scheduledAt: options.scheduledAt,
              status: 'pending',
              attempts: 0,
              maxAttempts: options.maxAttempts || 3,
              priority: options.priority || 'normal'
            }
          })

          jobIds.push(job.id)
        } catch (error) {
          errors.push(`Failed to create job for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      return {
        success: jobIds.length > 0,
        jobIds,
        errors: errors.length > 0 ? errors : undefined
      }
    } catch (error) {
      return {
        success: false,
        jobIds: [],
        errors: [`Failed to add to queue: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return

    this.isProcessing = true

    try {
      // Get pending jobs that are ready to be processed
      const jobs = await prisma.publishingJob.findMany({
        where: {
          status: 'pending',
          OR: [
            { scheduledAt: null },
            { scheduledAt: { lte: new Date() } }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: 10 // Process up to 10 jobs at once
      })

      for (const job of jobs) {
        await this.processJob(job)
      }
    } catch (error) {
      console.error('Error processing queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async processJob(job: any): Promise<void> {
    try {
      // Mark job as processing
      await prisma.publishingJob.update({
        where: { id: job.id },
        data: { 
          status: 'processing',
          attempts: job.attempts + 1,
          updatedAt: new Date()
        }
      })

      // Get platform adapter
      const adapter = platformManager.getAdapter(job.platform)
      if (!adapter) {
        throw new Error(`Platform adapter not found: ${job.platform}`)
      }

      // Parse content
      const content: AdaptedContent = JSON.parse(job.content)

      // Check if adapter is authenticated
      const isHealthy = await adapter.checkHealth()
      if (!isHealthy.isOnline) {
        throw new Error(`Platform ${job.platform} is not available: ${isHealthy.errorMessage}`)
      }

      // Publish content
      const result = await adapter.publishPost(content)

      if (result.success) {
        // Update job as completed
        await prisma.publishingJob.update({
          where: { id: job.id },
          data: {
            status: 'completed',
            result: JSON.stringify(result),
            updatedAt: new Date()
          }
        })

        // Create platform post record
        if (result.platformPostId) {
          await prisma.platformPost.create({
            data: {
              postId: job.postId,
              platform: job.platform,
              platformPostId: result.platformPostId,
              url: result.url,
              status: 'published',
              publishedAt: new Date()
            }
          })
        }

        console.log(`Successfully published post ${job.postId} to ${job.platform}`)
      } else {
        throw new Error(result.error || 'Publishing failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Error processing job ${job.id}:`, errorMessage)

      // Check if we should retry
      const shouldRetry = job.attempts < job.maxAttempts
      
      await prisma.publishingJob.update({
        where: { id: job.id },
        data: {
          status: shouldRetry ? 'pending' : 'failed',
          error: errorMessage,
          updatedAt: new Date(),
          // Schedule retry with exponential backoff
          ...(shouldRetry && {
            scheduledAt: new Date(Date.now() + Math.pow(2, job.attempts) * 60000) // 2^attempts minutes
          })
        }
      })
    }
  }

  async cancelJob(jobId: string): Promise<boolean> {
    try {
      const job = await prisma.publishingJob.findUnique({
        where: { id: jobId }
      })

      if (!job) {
        return false
      }

      if (job.status === 'processing') {
        // Can't cancel a job that's currently being processed
        return false
      }

      await prisma.publishingJob.update({
        where: { id: jobId },
        data: {
          status: 'cancelled',
          updatedAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('Error cancelling job:', error)
      return false
    }
  }

  async getJobStatus(jobId: string): Promise<QueueJob | null> {
    try {
      const job = await prisma.publishingJob.findUnique({
        where: { id: jobId }
      })

      if (!job) return null

      return {
        id: job.id,
        postId: job.postId,
        platform: job.platform,
        content: JSON.parse(job.content),
        scheduledAt: job.scheduledAt,
        status: job.status as any,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        error: job.error,
        result: job.result ? JSON.parse(job.result) : undefined,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      }
    } catch (error) {
      console.error('Error getting job status:', error)
      return null
    }
  }

  async getQueueStats(): Promise<{
    pending: number
    processing: number
    completed: number
    failed: number
    cancelled: number
  }> {
    try {
      const [pending, processing, completed, failed, cancelled] = await Promise.all([
        prisma.publishingJob.count({ where: { status: 'pending' } }),
        prisma.publishingJob.count({ where: { status: 'processing' } }),
        prisma.publishingJob.count({ where: { status: 'completed' } }),
        prisma.publishingJob.count({ where: { status: 'failed' } }),
        prisma.publishingJob.count({ where: { status: 'cancelled' } })
      ])

      return { pending, processing, completed, failed, cancelled }
    } catch (error) {
      console.error('Error getting queue stats:', error)
      return { pending: 0, processing: 0, completed: 0, failed: 0, cancelled: 0 }
    }
  }

  private startProcessing(): void {
    // Process queue every 30 seconds
    this.processingInterval = setInterval(() => {
      this.processQueue()
    }, 30000)

    // Process immediately
    this.processQueue()
  }

  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
  }
}

// Singleton instance
export const publishingQueue = new PublishingQueue()
