import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { rssFeedProcessor } from '@/lib/inbound/rss-feed-processor'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const subscribeFeedSchema = z.object({
  feedUrl: z.string().url('Invalid feed URL'),
  customTitle: z.string().optional(),
  syncFrequency: z.number().min(15).max(1440).optional() // 15 minutes to 24 hours
})

const updateFeedSchema = z.object({
  feedId: z.string(),
  isActive: z.boolean().optional(),
  customTitle: z.string().optional(),
  syncFrequency: z.number().min(15).max(1440).optional()
})

// GET /api/feeds - Get user's feed subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const feeds = await prisma.feedSubscription.findMany({
      where: {
        userId: session.user.id,
        ...(includeInactive ? {} : { isActive: true })
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        feedUrl: true,
        feedTitle: true,
        feedDescription: true,
        isActive: true,
        lastProcessedAt: true,
        lastError: true,
        syncFrequency: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            user: {
              where: {
                inboundContent: {
                  some: {
                    platform: 'rss',
                    platformUserId: { equals: prisma.feedSubscription.fields.feedUrl }
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ feeds })
  } catch (error) {
    console.error('Failed to fetch feeds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feeds' },
      { status: 500 }
    )
  }
}

// POST /api/feeds - Subscribe to a new feed
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = subscribeFeedSchema.parse(body)

    // Check if user already subscribed to this feed
    const existingSubscription = await prisma.feedSubscription.findFirst({
      where: {
        userId: session.user.id,
        feedUrl: validatedData.feedUrl
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Already subscribed to this feed' },
        { status: 409 }
      )
    }

    // Subscribe to feed
    const result = await rssFeedProcessor.subscribeFeed(
      session.user.id,
      validatedData.feedUrl,
      validatedData.customTitle
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe to feed' },
        { status: 400 }
      )
    }

    // Update sync frequency if provided
    if (validatedData.syncFrequency && result.feedId) {
      await prisma.feedSubscription.update({
        where: { id: result.feedId },
        data: { syncFrequency: validatedData.syncFrequency }
      })
    }

    return NextResponse.json({
      success: true,
      feedId: result.feedId,
      message: 'Successfully subscribed to feed'
    })
  } catch (error) {
    console.error('Failed to subscribe to feed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to feed' },
      { status: 500 }
    )
  }
}

// PUT /api/feeds - Update feed subscription
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateFeedSchema.parse(body)

    // Verify user owns this feed subscription
    const subscription = await prisma.feedSubscription.findFirst({
      where: {
        id: validatedData.feedId,
        userId: session.user.id
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Feed subscription not found' },
        { status: 404 }
      )
    }

    // Update subscription
    const updatedSubscription = await prisma.feedSubscription.update({
      where: { id: validatedData.feedId },
      data: {
        isActive: validatedData.isActive,
        feedTitle: validatedData.customTitle,
        syncFrequency: validatedData.syncFrequency,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Feed subscription updated successfully'
    })
  } catch (error) {
    console.error('Failed to update feed subscription:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update feed subscription' },
      { status: 500 }
    )
  }
}

// DELETE /api/feeds - Unsubscribe from feed
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const feedId = searchParams.get('feedId')

    if (!feedId) {
      return NextResponse.json(
        { error: 'Feed ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this feed subscription
    const subscription = await prisma.feedSubscription.findFirst({
      where: {
        id: feedId,
        userId: session.user.id
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Feed subscription not found' },
        { status: 404 }
      )
    }

    // Delete subscription (this will also clean up related inbound content due to cascade)
    await prisma.feedSubscription.delete({
      where: { id: feedId }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from feed'
    })
  } catch (error) {
    console.error('Failed to unsubscribe from feed:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from feed' },
      { status: 500 }
    )
  }
}
