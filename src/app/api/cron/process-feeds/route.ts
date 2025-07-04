import { NextRequest, NextResponse } from 'next/server'
import { rssFeedProcessor } from '@/lib/inbound/rss-feed-processor'
import { prisma } from '@/lib/prisma'

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external scheduler)
// POST /api/cron/process-feeds
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'default-secret'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting scheduled RSS feed processing...')
    const startTime = Date.now()

    // Get feeds that need processing based on their sync frequency
    const feedsToProcess = await getFeedsToProcess()
    
    if (feedsToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No feeds need processing at this time',
        processedFeeds: 0,
        totalItems: 0,
        duration: Date.now() - startTime
      })
    }

    console.log(`Processing ${feedsToProcess.length} feeds...`)

    let totalProcessedFeeds = 0
    let totalProcessedItems = 0
    let totalErrors = 0

    // Process feeds in batches to avoid overwhelming the system
    const batchSize = 10
    for (let i = 0; i < feedsToProcess.length; i += batchSize) {
      const batch = feedsToProcess.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (subscription) => {
        try {
          console.log(`Processing feed: ${subscription.feedTitle} (${subscription.feedUrl})`)
          
          // Parse the feed
          const parsedFeed = await rssFeedProcessor.parseFeed(subscription.feedUrl)
          
          // Process feed items
          const result = await rssFeedProcessor.processFeedItems(
            parsedFeed,
            subscription.userId,
            subscription.lastProcessedAt || undefined
          )

          // Update subscription status
          await prisma.feedSubscription.update({
            where: { id: subscription.id },
            data: {
              lastProcessedAt: new Date(),
              lastError: null,
              feedTitle: subscription.feedTitle || parsedFeed.title, // Update title if not set
              feedDescription: subscription.feedDescription || parsedFeed.description
            }
          })

          console.log(`Processed feed ${subscription.feedTitle}: ${result.processedCount} new items, ${result.skippedCount} skipped`)

          return {
            feedId: subscription.id,
            success: true,
            processedItems: result.processedCount,
            skippedItems: result.skippedCount
          }
        } catch (error) {
          console.error(`Failed to process feed ${subscription.feedUrl}:`, error)
          
          // Update error status
          await prisma.feedSubscription.update({
            where: { id: subscription.id },
            data: {
              lastError: error instanceof Error ? error.message : 'Unknown error'
            }
          })

          return {
            feedId: subscription.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })

      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises)
      
      // Aggregate results
      batchResults.forEach(result => {
        if (result.success) {
          totalProcessedFeeds++
          totalProcessedItems += result.processedItems || 0
        } else {
          totalErrors++
        }
      })

      // Small delay between batches to be respectful to feed servers
      if (i + batchSize < feedsToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const duration = Date.now() - startTime

    console.log(`RSS feed processing completed:`)
    console.log(`- Processed feeds: ${totalProcessedFeeds}`)
    console.log(`- Total new items: ${totalProcessedItems}`)
    console.log(`- Errors: ${totalErrors}`)
    console.log(`- Duration: ${duration}ms`)

    // Log processing statistics
    await prisma.auditLog.create({
      data: {
        action: 'RSS_FEED_PROCESSING',
        resource: 'feeds',
        details: {
          processedFeeds: totalProcessedFeeds,
          totalItems: totalProcessedItems,
          errors: totalErrors,
          duration,
          feedsToProcess: feedsToProcess.length
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'RSS feed processing completed',
      processedFeeds: totalProcessedFeeds,
      totalItems: totalProcessedItems,
      errors: totalErrors,
      duration,
      feedsProcessed: feedsToProcess.length
    })
  } catch (error) {
    console.error('RSS feed processing failed:', error)
    
    // Log the error
    await prisma.auditLog.create({
      data: {
        action: 'RSS_FEED_PROCESSING_ERROR',
        resource: 'feeds',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      }
    })

    return NextResponse.json(
      { 
        error: 'RSS feed processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/cron/process-feeds - Get processing status and statistics
export async function GET(request: NextRequest) {
  try {
    // Get feed processing statistics
    const totalFeeds = await prisma.feedSubscription.count()
    const activeFeeds = await prisma.feedSubscription.count({
      where: { isActive: true }
    })
    const feedsWithErrors = await prisma.feedSubscription.count({
      where: { 
        isActive: true,
        lastError: { not: null }
      }
    })

    // Get recent processing logs
    const recentLogs = await prisma.auditLog.findMany({
      where: {
        action: { in: ['RSS_FEED_PROCESSING', 'RSS_FEED_PROCESSING_ERROR'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        action: true,
        details: true,
        createdAt: true
      }
    })

    // Get feeds that need processing
    const feedsNeedingProcessing = await getFeedsToProcess()

    return NextResponse.json({
      statistics: {
        totalFeeds,
        activeFeeds,
        feedsWithErrors,
        feedsNeedingProcessing: feedsNeedingProcessing.length
      },
      recentProcessingLogs: recentLogs,
      nextProcessingBatch: feedsNeedingProcessing.slice(0, 5).map(feed => ({
        id: feed.id,
        title: feed.feedTitle,
        url: feed.feedUrl,
        lastProcessed: feed.lastProcessedAt,
        syncFrequency: feed.syncFrequency
      }))
    })
  } catch (error) {
    console.error('Failed to get feed processing status:', error)
    return NextResponse.json(
      { error: 'Failed to get processing status' },
      { status: 500 }
    )
  }
}

// Helper function to get feeds that need processing
async function getFeedsToProcess() {
  const now = new Date()
  
  return await prisma.feedSubscription.findMany({
    where: {
      isActive: true,
      OR: [
        // Never processed
        { lastProcessedAt: null },
        // Due for processing based on sync frequency
        {
          lastProcessedAt: {
            lt: new Date(now.getTime() - (60 * 1000)) // At least 1 minute ago for safety
          }
        }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    },
    orderBy: [
      { lastProcessedAt: 'asc' }, // Process oldest first
      { createdAt: 'asc' }
    ]
  })
}
