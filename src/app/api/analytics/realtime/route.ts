import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { realTimeAnalytics } from '@/lib/real-time-analytics'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  postIds: z.array(z.string()).min(1).max(10),
  action: z.enum(['subscribe', 'unsubscribe']).default('subscribe')
})

const metricSchema = z.object({
  postId: z.string(),
  platform: z.string(),
  metricType: z.enum(['view', 'like', 'comment', 'share', 'click']),
  value: z.number().default(1),
  metadata: z.record(z.any()).optional()
})

// POST endpoint for subscribing/unsubscribing to real-time analytics
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postIds, action } = subscribeSchema.parse(body)

    // Verify user owns the posts
    const userPosts = await prisma.post.findMany({
      where: {
        id: { in: postIds },
        authorId: session.user.id
      },
      select: { id: true }
    })

    const validPostIds = userPosts.map(post => post.id)

    if (validPostIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid posts found' },
        { status: 404 }
      )
    }

    if (action === 'subscribe') {
      realTimeAnalytics.subscribe(session.user.id!, validPostIds)
    } else {
      realTimeAnalytics.unsubscribe(session.user.id!, validPostIds)
    }

    return NextResponse.json({
      success: true,
      action,
      postIds: validPostIds,
      message: `Successfully ${action}d to real-time analytics for ${validPostIds.length} posts`
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Real-time analytics subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving real-time analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const type = searchParams.get('type') || 'analytics'
    const timeWindow = parseInt(searchParams.get('timeWindow') || '60')

    if (type === 'analytics' && postId) {
      // Get live analytics for a specific post
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
          authorId: session.user.id
        }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found or access denied' },
          { status: 404 }
        )
      }

      const liveAnalytics = realTimeAnalytics.getLiveAnalytics(postId)
      const recentMetrics = realTimeAnalytics.getRecentMetrics(postId, timeWindow)
      const realTimeEngagement = realTimeAnalytics.getRealTimeEngagement(postId, 5)

      return NextResponse.json({
        success: true,
        data: {
          postId,
          liveAnalytics,
          recentMetrics: recentMetrics.slice(-50), // Last 50 metrics
          realTimeEngagement,
          timeWindow
        }
      })
    }

    if (type === 'alerts') {
      // Get analytics alerts for the user
      const unacknowledgedOnly = searchParams.get('unacknowledged') === 'true'
      const alerts = realTimeAnalytics.getAlerts(session.user.id!, unacknowledgedOnly)

      return NextResponse.json({
        success: true,
        data: {
          alerts,
          totalAlerts: alerts.length,
          unacknowledgedCount: alerts.filter(alert => !alert.acknowledged).length
        }
      })
    }

    if (type === 'trending') {
      // Get trending content analysis
      const limit = parseInt(searchParams.get('limit') || '10')
      const trending = realTimeAnalytics.getTrendingContent(limit)

      // Filter to only include user's posts
      const userPosts = await prisma.post.findMany({
        where: { authorId: session.user.id },
        select: { id: true, title: true }
      })

      const userPostIds = new Set(userPosts.map(post => post.id))
      const userTrending = trending
        .filter(item => userPostIds.has(item.postId))
        .map(item => ({
          ...item,
          title: userPosts.find(post => post.id === item.postId)?.title || item.title
        }))

      return NextResponse.json({
        success: true,
        data: {
          trending: userTrending,
          totalTrending: userTrending.length
        }
      })
    }

    if (type === 'overview') {
      // Get real-time overview for all user's posts
      const userPosts = await prisma.post.findMany({
        where: { authorId: session.user.id },
        select: { id: true, title: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
      })

      const overview = userPosts.map(post => {
        const liveAnalytics = realTimeAnalytics.getLiveAnalytics(post.id)
        const realTimeEngagement = realTimeAnalytics.getRealTimeEngagement(post.id, 5)

        return {
          postId: post.id,
          title: post.title,
          liveAnalytics,
          realTimeEngagement,
          isActive: !!liveAnalytics?.isLive
        }
      }).filter(item => item.isActive)

      return NextResponse.json({
        success: true,
        data: {
          overview,
          activePosts: overview.length,
          totalPosts: userPosts.length
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Real-time analytics retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    )
  }
}

// PUT endpoint for recording metrics and acknowledging alerts
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const action = body.action

    if (action === 'record_metric') {
      const metric = metricSchema.parse(body.metric)

      // Verify user owns the post
      const post = await prisma.post.findUnique({
        where: {
          id: metric.postId,
          authorId: session.user.id
        }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found or access denied' },
          { status: 404 }
        )
      }

      realTimeAnalytics.recordMetric(metric)

      return NextResponse.json({
        success: true,
        message: 'Metric recorded successfully',
        metric: {
          ...metric,
          timestamp: new Date()
        }
      })
    }

    if (action === 'acknowledge_alert') {
      const alertId = body.alertId

      if (!alertId) {
        return NextResponse.json(
          { error: 'Alert ID is required' },
          { status: 400 }
        )
      }

      const acknowledged = realTimeAnalytics.acknowledgeAlert(session.user.id!, alertId)

      if (!acknowledged) {
        return NextResponse.json(
          { error: 'Alert not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Alert acknowledged successfully',
        alertId
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Real-time analytics action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}

// DELETE endpoint for unsubscribing from all real-time analytics
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    realTimeAnalytics.unsubscribe(session.user.id!)

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed from all real-time analytics'
    })
  } catch (error) {
    console.error('Real-time analytics unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}
