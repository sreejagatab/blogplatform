import { Queue, Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { prisma } from '@/lib/prisma'
import { contentNormalizer } from './content-normalizer'
import { aiContentManager } from '@/lib/ai/ai-content-manager'

// Lazy Redis connection for queue - only create when needed
let redis: Redis | null = null

function getRedisConnection(): Redis {
  if (!redis) {
    // Skip Redis connection during build time
    if (!process.env.REDIS_URL || process.env.VERCEL_ENV === 'preview') {
      throw new Error('Redis not available during build time')
    }
    redis = new Redis(process.env.REDIS_URL, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    })
  }
  return redis
}

// Content ingestion queue - lazy initialization
let contentIngestionQueue: Queue | null = null

export function getContentIngestionQueue(): Queue {
  if (!contentIngestionQueue) {
    contentIngestionQueue = new Queue('content-ingestion', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    })
  }
  return contentIngestionQueue
}

// Job types
export interface IngestContentJob {
  platform: string
  platformPostId: string
  platformUserId: string
  content: string
  title?: string
  metadata: Record<string, any>
  originalData: any
  userId?: string // Internal user ID if mapped
}

export interface ProcessFeedJob {
  feedUrl: string
  userId: string
  lastProcessedDate?: string
}

export interface CrossPostJob {
  ingestedContentId: string
  targetPlatforms: string[]
  userId: string
}

// Content ingestion worker - lazy initialization
let contentIngestionWorker: Worker | null = null

function getContentIngestionWorker(): Worker {
  if (!contentIngestionWorker) {
    contentIngestionWorker = new Worker(
      'content-ingestion',
      async (job: Job) => {
        const { name, data } = job

        switch (name) {
          case 'ingest-content':
            return await processIngestedContent(data as IngestContentJob)

          case 'process-feed':
            return await processFeedContent(data as ProcessFeedJob)

          case 'cross-post':
            return await processCrossPost(data as CrossPostJob)

          default:
            throw new Error(`Unknown job type: ${name}`)
        }
      },
      {
        connection: getRedisConnection(),
        concurrency: 10,
      }
    )
  }
  return contentIngestionWorker
}

// Process ingested content from webhooks/APIs
async function processIngestedContent(data: IngestContentJob): Promise<{ contentId: string }> {
  try {
    // 1. Find or create user mapping
    const userId = await findOrCreateUserMapping(data.platform, data.platformUserId)
    
    // 2. Check for duplicates
    const existingContent = await prisma.inboundContent.findFirst({
      where: {
        platformPostId: data.platformPostId,
        platform: data.platform,
      },
    })

    if (existingContent) {
      console.log(`Content already exists: ${data.platformPostId}`)
      return { contentId: existingContent.id }
    }

    // 3. Normalize content
    const normalizedContent = await contentNormalizer.normalizeContent({
      platform: data.platform,
      content: data.content,
      title: data.title,
      metadata: data.metadata,
      originalData: data.originalData,
    })

    // 4. AI enhancement (optional)
    let enhancedContent = normalizedContent
    if (process.env.ENABLE_AI_CONTENT_ENHANCEMENT === 'true') {
      try {
        enhancedContent = await enhanceContentWithAI(normalizedContent)
      } catch (error) {
        console.warn('AI enhancement failed, using original content:', error)
      }
    }

    // 5. Save to database
    const inboundContent = await prisma.inboundContent.create({
      data: {
        userId,
        platform: data.platform,
        platformPostId: data.platformPostId,
        platformUserId: data.platformUserId,
        originalContent: data.originalData,
        normalizedContent: enhancedContent,
        ingestionMethod: 'webhook',
        status: 'processed',
        title: enhancedContent.title,
        content: enhancedContent.content,
        extractedTags: enhancedContent.tags || [],
        extractedTopics: enhancedContent.topics || [],
        sentiment: enhancedContent.sentiment,
        language: enhancedContent.language || 'en',
      },
    })

    // 6. Check for auto cross-posting rules
    await checkCrossPostingRules(inboundContent.id, userId)

    // 7. Trigger notifications
    await triggerContentNotifications(inboundContent.id, userId)

    return { contentId: inboundContent.id }
  } catch (error) {
    console.error('Content ingestion failed:', error)
    throw error
  }
}

// Process RSS/Atom feeds
async function processFeedContent(data: ProcessFeedJob): Promise<{ processedCount: number }> {
  try {
    const { feedUrl, userId, lastProcessedDate } = data

    // Parse RSS/Atom feed
    const feedItems = await parseFeed(feedUrl, lastProcessedDate)
    
    let processedCount = 0
    
    for (const item of feedItems) {
      try {
        // Convert feed item to ingestion format
        const ingestData: IngestContentJob = {
          platform: 'rss',
          platformPostId: item.guid || item.link,
          platformUserId: feedUrl, // Use feed URL as user identifier
          content: item.description || item.content,
          title: item.title,
          metadata: {
            publishedDate: item.pubDate,
            link: item.link,
            author: item.author,
            categories: item.categories || [],
          },
          originalData: item,
          userId,
        }

        await processIngestedContent(ingestData)
        processedCount++
      } catch (error) {
        console.error(`Failed to process feed item: ${item.title}`, error)
      }
    }

    // Update last processed date
    await prisma.feedSubscription.updateMany({
      where: { feedUrl, userId },
      data: { lastProcessedAt: new Date() },
    })

    return { processedCount }
  } catch (error) {
    console.error('Feed processing failed:', error)
    throw error
  }
}

// Process cross-posting jobs
async function processCrossPost(data: CrossPostJob): Promise<{ results: CrossPostResult[] }> {
  try {
    const { ingestedContentId, targetPlatforms, userId } = data

    // Get the ingested content
    const ingestedContent = await prisma.inboundContent.findUnique({
      where: { id: ingestedContentId },
    })

    if (!ingestedContent) {
      throw new Error(`Ingested content not found: ${ingestedContentId}`)
    }

    const results: CrossPostResult[] = []

    for (const platform of targetPlatforms) {
      try {
        // Transform content for target platform
        const adaptedContent = await adaptContentForPlatform(
          ingestedContent.normalizedContent as any,
          platform
        )

        // Publish to platform (reuse existing publishing system)
        const publishResult = await publishToPlatform(platform, adaptedContent, userId)
        
        results.push({
          platform,
          success: publishResult.success,
          postId: publishResult.platformPostId,
          url: publishResult.url,
          error: publishResult.errorMessage,
        })
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { results }
  } catch (error) {
    console.error('Cross-posting failed:', error)
    throw error
  }
}

// Helper functions
async function findOrCreateUserMapping(platform: string, platformUserId: string): Promise<string> {
  // Try to find existing user mapping
  const mapping = await prisma.platformContentMapping.findFirst({
    where: {
      platform,
      platformUserId,
    },
  })

  if (mapping) {
    return mapping.userId
  }

  // For now, create a default user or require manual mapping
  // In production, this would involve user authentication/authorization
  const defaultUser = await prisma.user.findFirst({
    where: { email: 'admin@universalblogplatform.com' },
  })

  if (!defaultUser) {
    throw new Error('No default user found for content mapping')
  }

  // Create new mapping
  await prisma.platformContentMapping.create({
    data: {
      userId: defaultUser.id,
      platform,
      platformUserId,
      syncEnabled: true,
    },
  })

  return defaultUser.id
}

async function enhanceContentWithAI(content: any): Promise<any> {
  try {
    // Use AI to enhance content
    const analysis = await aiContentManager.analyzeContent(content.content)
    
    return {
      ...content,
      sentiment: analysis.sentiment,
      topics: analysis.keyTopics,
      readabilityScore: analysis.readabilityLevel,
      enhancedTitle: content.title, // Could be AI-enhanced
      suggestedTags: analysis.keyTopics,
    }
  } catch (error) {
    console.error('AI enhancement failed:', error)
    return content
  }
}

async function checkCrossPostingRules(contentId: string, userId: string): Promise<void> {
  // Check if user has auto cross-posting rules
  const rules = await prisma.crossPostingRule.findMany({
    where: { userId, enabled: true },
  })

  for (const rule of rules) {
    // Check if content matches rule criteria
    if (await contentMatchesRule(contentId, rule)) {
      // Add cross-posting job
      await getContentIngestionQueue().add('cross-post', {
        ingestedContentId: contentId,
        targetPlatforms: rule.targetPlatforms,
        userId,
      })
    }
  }
}

async function contentMatchesRule(contentId: string, rule: any): Promise<boolean> {
  // Implement rule matching logic
  // For now, return true for all rules
  return true
}

async function triggerContentNotifications(contentId: string, userId: string): Promise<void> {
  // Trigger real-time notifications for new content
  // This could integrate with WebSocket, email, or push notifications
  console.log(`New content ingested: ${contentId} for user: ${userId}`)
}

async function parseFeed(feedUrl: string, lastProcessedDate?: string): Promise<any[]> {
  try {
    const { rssFeedProcessor } = await import('./rss-feed-processor')
    const parsedFeed = await rssFeedProcessor.parseFeed(feedUrl)

    // Filter items by date if provided
    if (lastProcessedDate) {
      const cutoffDate = new Date(lastProcessedDate)
      return parsedFeed.items.filter(item => {
        if (!item.pubDate) return true
        return new Date(item.pubDate) > cutoffDate
      })
    }

    return parsedFeed.items
  } catch (error) {
    console.error(`Failed to parse feed ${feedUrl}:`, error)
    return []
  }
}

async function adaptContentForPlatform(content: any, platform: string): Promise<any> {
  // Reuse existing content adaptation engine
  return content
}

async function publishToPlatform(platform: string, content: any, userId: string): Promise<any> {
  // Reuse existing publishing system
  return { success: true, platformPostId: 'test', url: 'test' }
}

// Types
interface CrossPostResult {
  platform: string
  success: boolean
  postId?: string
  url?: string
  error?: string
}

// Initialize worker event handlers when worker is created
export function initializeWorkerEventHandlers(): void {
  const worker = getContentIngestionWorker()

  worker.on('completed', (job) => {
    console.log(`Content ingestion job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Content ingestion job ${job?.id} failed:`, err)
  })
}

// Export worker getter for external use
export { getContentIngestionWorker }
