import { PlatformAdapterFactory, type PostData, type PublishResult } from './platform-adapters'
import { prisma } from './prisma'

export interface PublishingJob {
  id: string
  postId: string
  platforms: string[]
  scheduledAt?: Date
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
  results: Record<string, PublishResult>
  createdAt: Date
  updatedAt: Date
}

export class PublishingService {
  /**
   * Publish a post to multiple platforms
   */
  async publishToMultiplePlatforms(
    postId: string,
    platforms: string[],
    scheduledAt?: Date
  ): Promise<PublishingJob> {
    const job: PublishingJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      platforms,
      scheduledAt,
      status: 'pending',
      results: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (scheduledAt && scheduledAt > new Date()) {
      // Schedule for later
      await this.scheduleJob(job)
      return job
    }

    // Process immediately
    return await this.processJob(job)
  }

  /**
   * Process a publishing job
   */
  private async processJob(job: PublishingJob): Promise<PublishingJob> {
    job.status = 'processing'
    job.updatedAt = new Date()

    try {
      // Get post data from database
      const post = await prisma.post.findUnique({
        where: { id: job.postId },
        include: {
          author: true,
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      if (!post) {
        job.status = 'failed'
        job.results['error'] = {
          success: false,
          error: 'Post not found'
        }
        return job
      }

      // Convert to PostData format
      const postData: PostData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        tags: post.tags.map(tag => tag.tag.name),
        publishAt: job.scheduledAt
      }

      // Publish to each platform
      const publishPromises = job.platforms.map(async (platformName) => {
        try {
          const adapter = PlatformAdapterFactory.createAdapter(platformName)
          
          if (!adapter) {
            return {
              platform: platformName,
              result: {
                success: false,
                error: `Platform adapter not found for ${platformName}`
              }
            }
          }

          // Get platform by name first
          const platform = await prisma.platform.findUnique({
            where: { name: platformName }
          })

          if (!platform) {
            return {
              platform: platformName,
              result: {
                success: false,
                error: `Platform not found: ${platformName}`
              }
            }
          }

          // Get platform credentials from database
          const platformConfig = await prisma.platformIntegration.findFirst({
            where: {
              platformId: platform.id,
              userId: post.authorId,
              isEnabled: true
            }
          })

          if (!platformConfig) {
            return {
              platform: platformName,
              result: {
                success: false,
                error: `Platform configuration not found for ${platformName}`
              }
            }
          }

          // Get platform connection for auth credentials
          const connection = await prisma.userPlatformConnection.findFirst({
            where: {
              userId: post.authorId,
              platformId: platform.id,
              isActive: true
            }
          })

          if (!connection) {
            return {
              platform: platformName,
              result: {
                success: false,
                error: `No active connection found for platform ${platformName}`
              }
            }
          }

          // Authenticate adapter
          const authSuccess = await adapter.authenticate({
            accessToken: connection.accessToken || '',
            refreshToken: connection.refreshToken || ''
          })
          
          if (!authSuccess) {
            return {
              platform: platformName,
              result: {
                success: false,
                error: `Authentication failed for ${platformName}`
              }
            }
          }

          // Publish post
          const result = await adapter.publishPost(postData)
          
          // Save publication record
          if (result.success) {
            await prisma.postPublication.create({
              data: {
                postId: job.postId,
                platformIntegrationId: platformConfig.id,
                platformPostId: result.platformPostId || '',
                publishedAt: new Date(),
                platformUrl: result.url,
                status: 'PUBLISHED'
              }
            })
          }

          return {
            platform: platformName,
            result
          }
        } catch (error) {
          return {
            platform: platformName,
            result: {
              success: false,
              error: `Unexpected error: ${error}`
            }
          }
        }
      })

      const publishResults = await Promise.all(publishPromises)

      // Compile results
      publishResults.forEach(({ platform, result }) => {
        job.results[platform] = result
      })

      // Determine final status
      const successCount = publishResults.filter(r => r.result.success).length
      const totalCount = publishResults.length

      if (successCount === 0) {
        job.status = 'failed'
      } else if (successCount === totalCount) {
        job.status = 'completed'
      } else {
        job.status = 'partial'
      }

      job.updatedAt = new Date()

      // Update post status
      await prisma.post.update({
        where: { id: job.postId },
        data: {
          status: job.status === 'completed' ? 'PUBLISHED' : 'PUBLISHED_PARTIAL',
          publishedAt: new Date()
        }
      })

      return job
    } catch (error) {
      job.status = 'failed'
      job.results['system_error'] = {
        success: false,
        error: `System error: ${error}`
      }
      job.updatedAt = new Date()
      return job
    }
  }

  /**
   * Schedule a job for later processing
   */
  private async scheduleJob(job: PublishingJob): Promise<void> {
    // Get the post to find the author
    const post = await prisma.post.findUnique({
      where: { id: job.postId },
      select: { authorId: true }
    })
    
    if (!post) {
      throw new Error(`Post not found: ${job.postId}`)
    }
    
    // For each platform, create a scheduled publication record
    for (const platformName of job.platforms) {
      const platform = await prisma.platform.findUnique({
        where: { name: platformName }
      })
      
      if (!platform) continue
      
      const platformConfig = await prisma.platformIntegration.findFirst({
        where: {
          platformId: platform.id,
          userId: post.authorId,
          isEnabled: true
        }
      })
      
      if (!platformConfig) continue
      
      await prisma.scheduledPublication.create({
        data: {
          postId: job.postId,
          platformIntegrationId: platformConfig.id,
          scheduledFor: job.scheduledAt!,
          status: 'PENDING'
        }
      })
    }
  }

  /**
   * Process scheduled jobs
   */
  async processScheduledJobs(): Promise<void> {
    const now = new Date()
    
    const scheduledJobs = await prisma.scheduledPublication.findMany({
      where: {
        scheduledFor: {
          lte: now
        },
        status: 'PENDING'
      },
      include: {
        post: true,
        platformIntegration: {
          include: {
            platform: true
          }
        }
      }
    })

    for (const scheduledJob of scheduledJobs) {
      try {
        // Create a job from the scheduled publication
        const job: PublishingJob = {
          id: scheduledJob.id,
          postId: scheduledJob.postId,
          platforms: [scheduledJob.platformIntegration.platform.name],
          status: 'processing',
          results: {},
          scheduledAt: scheduledJob.scheduledFor,
          createdAt: scheduledJob.createdAt,
          updatedAt: new Date()
        }
        
        const processedJob = await this.processJob(job)
        
        // Update scheduled publication
        await prisma.scheduledPublication.update({
          where: { id: scheduledJob.id },
          data: {
            status: processedJob.status === 'completed' ? 'COMPLETED' : 'FAILED',
            publishedAt: processedJob.status === 'completed' ? new Date() : null,
            errorMessage: processedJob.status === 'failed' ? 'Publishing failed' : null
          }
        })
      } catch (error) {
        console.error(`Error processing scheduled job ${scheduledJob.id}:`, error)
        
        await prisma.scheduledPublication.update({
          where: { id: scheduledJob.id },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      }
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<PublishingJob | null> {
    const scheduledJob = await prisma.scheduledPublication.findUnique({
      where: { id: jobId },
      include: {
        platformIntegration: {
          include: {
            platform: true
          }
        }
      }
    })

    if (!scheduledJob) {
      return null
    }

    // Reconstruct the job object from the scheduled publication
    return {
      id: scheduledJob.id,
      postId: scheduledJob.postId,
      platforms: [scheduledJob.platformIntegration.platform.name],
      status: scheduledJob.status === 'COMPLETED' ? 'completed' : 
              scheduledJob.status === 'FAILED' ? 'failed' : 
              scheduledJob.status === 'PROCESSING' ? 'processing' : 'pending',
      results: {},
      scheduledAt: scheduledJob.scheduledFor,
      createdAt: scheduledJob.createdAt,
      updatedAt: scheduledJob.updatedAt
    }
  }

  /**
   * Cancel a scheduled job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      await prisma.scheduledPublication.update({
        where: { id: jobId },
        data: {
          status: 'CANCELLED'
        }
      })
      return true
    } catch (error) {
      console.error('Error cancelling job:', error)
      return false
    }
  }

  /**
   * Republish a post to specific platforms
   */
  async republishPost(postId: string, platforms: string[]): Promise<PublishingJob> {
    return await this.publishToMultiplePlatforms(postId, platforms)
  }

  /**
   * Get platform analytics for a post
   */
  async getPostAnalytics(postId: string): Promise<Record<string, any>> {
    const publications = await prisma.postPublication.findMany({
      where: { postId },
      include: {
        platformIntegration: {
          include: {
            platform: true
          }
        }
      }
    })

    const analytics: Record<string, any> = {}

    for (const publication of publications) {
      try {
        const platformName = publication.platformIntegration.platform.name
        const adapter = PlatformAdapterFactory.createAdapter(publication.platformIntegration.platform.id)
        
        if (adapter && publication.platformPostId) {
          // Get platform connection for credentials
          const connection = await prisma.userPlatformConnection.findFirst({
            where: {
              userId: publication.platformIntegration.userId,
              platformId: publication.platformIntegration.platformId,
              isActive: true
            }
          })

          if (connection) {
            await adapter.authenticate({
              accessToken: connection.accessToken || '',
              refreshToken: connection.refreshToken || ''
            })
            const platformAnalytics = await adapter.getAnalytics(publication.platformPostId)
            analytics[platformName] = {
              ...platformAnalytics,
              url: publication.platformUrl,
              publishedAt: publication.publishedAt
            }
          }
        }
      } catch (error) {
        const platformName = publication.platformIntegration.platform.name
        console.error(`Error getting analytics for ${platformName}:`, error)
        analytics[platformName] = {
          error: 'Failed to fetch analytics'
        }
      }
    }

    return analytics
  }
}

// Export singleton instance
export const publishingService = new PublishingService()
