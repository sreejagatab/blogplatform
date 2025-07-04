import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { aiService } from '@/lib/ai-service'
import { realTimeAnalytics } from '@/lib/real-time-analytics'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const analyticsSchema = z.object({
  timeframe: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  includeContentRecommendations: z.boolean().default(true),
  includeAudienceInsights: z.boolean().default(true),
  includePerformancePrediction: z.boolean().default(true),
  includeRealTimeData: z.boolean().default(true),
  postIds: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional()
})

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
    const {
      timeframe,
      includeContentRecommendations,
      includeAudienceInsights,
      includePerformancePrediction,
      includeRealTimeData,
      postIds,
      platforms
    } = analyticsSchema.parse(body)

    // Get user's content history
    const contentHistory = await getUserContentHistory(session.user.id!, timeframe)

    // Generate predictive analytics
    const predictiveAnalytics = await aiService.generatePredictiveAnalytics(contentHistory)

    // Get AI insights
    const aiInsights = await aiService.getAIInsights({
      recentPosts: contentHistory.slice(0, 10),
      analytics: {
        totalPosts: contentHistory.length,
        avgViews: contentHistory.reduce((sum, post) => sum + (post.viewCount || 0), 0) / contentHistory.length,
        avgLikes: contentHistory.reduce((sum, post) => sum + (post.likeCount || 0), 0) / contentHistory.length
      },
      competitors: ['competitor1', 'competitor2'] // This would come from user settings
    })

    // Generate performance insights
    const performanceInsights = generatePerformanceInsights(contentHistory)

    // Get real-time data if requested
    let realTimeData: any = null
    if (includeRealTimeData && contentHistory.length > 0) {
      const userPostIds = postIds || contentHistory.map(post => post.id)
      realTimeData = {
        trending: realTimeAnalytics.getTrendingContent(5).filter(item =>
          userPostIds.includes(item.postId)
        ),
        liveAnalytics: userPostIds.reduce((acc, postId) => {
          const analytics = realTimeAnalytics.getLiveAnalytics(postId)
          if (analytics) {
            acc[postId] = analytics
          }
          return acc
        }, {} as Record<string, any>),
        alerts: realTimeAnalytics.getAlerts(session.user.id!, true), // Only unacknowledged
        activePosts: userPostIds.filter(postId =>
          realTimeAnalytics.getLiveAnalytics(postId)?.isLive
        ).length
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        predictiveAnalytics: includePerformancePrediction ? predictiveAnalytics : null,
        aiInsights: {
          contentSuggestions: includeContentRecommendations ? aiInsights.contentSuggestions : [],
          optimizationTips: aiInsights.optimizationTips,
          competitorAnalysis: aiInsights.competitorAnalysis
        },
        performanceInsights,
        audienceInsights: includeAudienceInsights ? predictiveAnalytics.audienceInsights : null,
        summary: {
          totalPosts: contentHistory.length,
          timeframe,
          avgPerformance: calculateAveragePerformance(contentHistory),
          topPerformingContent: getTopPerformingContent(contentHistory),
          improvementAreas: identifyImprovementAreas(contentHistory)
        },
        realTimeData,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('AI analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}

// GET endpoint for quick analytics overview
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get basic analytics data
    const recentPosts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        status: true
      }
    })

    const quickInsights = {
      totalPosts: recentPosts.length,
      totalViews: recentPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
      totalLikes: recentPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0),
      totalComments: recentPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0),
      avgEngagement: calculateEngagementRate(recentPosts),
      publishingFrequency: calculatePublishingFrequency(recentPosts),
      topPerformer: recentPosts.reduce((max, post) => 
        (post.viewCount || 0) > (max.viewCount || 0) ? post : max, recentPosts[0]
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        quickInsights,
        recentPosts: recentPosts.slice(0, 5),
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Quick analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics overview' },
      { status: 500 }
    )
  }
}

async function getUserContentHistory(userId: string, timeframe: string) {
  const timeframeMap = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365
  }

  const days = timeframeMap[timeframe as keyof typeof timeframeMap] || 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return await prisma.post.findMany({
    where: {
      authorId: userId,
      createdAt: {
        gte: startDate
      }
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      createdAt: true,
      publishedAt: true,
      status: true,
      category: {
        select: { name: true }
      },
      tags: {
        select: {
          tag: {
            select: { name: true }
          }
        }
      }
    }
  })
}

function generatePerformanceInsights(contentHistory: any[]) {
  const insights = []

  // Analyze posting patterns
  const postingDays = contentHistory.map(post => new Date(post.createdAt).getDay())
  const dayFrequency = postingDays.reduce((acc, day) => {
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const bestDay = Object.entries(dayFrequency).reduce((max, [day, count]) => 
    count > max.count ? { day: parseInt(day), count } : max, { day: 0, count: 0 }
  )

  insights.push({
    type: 'posting_pattern',
    insight: `Your best performing day is ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bestDay.day]}`,
    recommendation: 'Consider posting more content on this day'
  })

  // Analyze content performance
  const avgViews = contentHistory.reduce((sum, post) => sum + (post.viewCount || 0), 0) / contentHistory.length
  const topPerformers = contentHistory.filter(post => (post.viewCount || 0) > avgViews * 1.5)

  if (topPerformers.length > 0) {
    insights.push({
      type: 'content_performance',
      insight: `${topPerformers.length} posts performed 50% above average`,
      recommendation: 'Analyze these high-performing posts to identify successful patterns'
    })
  }

  return insights
}

function calculateAveragePerformance(contentHistory: any[]) {
  if (contentHistory.length === 0) return { views: 0, likes: 0, comments: 0, engagement: 0 }

  const totals = contentHistory.reduce((acc, post) => ({
    views: acc.views + (post.viewCount || 0),
    likes: acc.likes + (post.likeCount || 0),
    comments: acc.comments + (post.commentCount || 0)
  }), { views: 0, likes: 0, comments: 0 })

  const count = contentHistory.length
  return {
    views: Math.round(totals.views / count),
    likes: Math.round(totals.likes / count),
    comments: Math.round(totals.comments / count),
    engagement: Math.round(((totals.likes + totals.comments) / totals.views) * 100) || 0
  }
}

function getTopPerformingContent(contentHistory: any[]) {
  return contentHistory
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3)
    .map(post => ({
      id: post.id,
      title: post.title,
      views: post.viewCount || 0,
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      publishedAt: post.publishedAt
    }))
}

function identifyImprovementAreas(contentHistory: any[]) {
  const areas = []

  const avgEngagement = calculateEngagementRate(contentHistory)
  if (avgEngagement < 2) {
    areas.push('Increase engagement through more interactive content')
  }

  const recentPosts = contentHistory.slice(0, 5)
  const hasLowViews = recentPosts.some(post => (post.viewCount || 0) < 100)
  if (hasLowViews) {
    areas.push('Improve content discoverability and SEO optimization')
  }

  return areas
}

function calculateEngagementRate(posts: any[]) {
  const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0)
  const totalEngagements = posts.reduce((sum, post) => sum + (post.likeCount || 0) + (post.commentCount || 0), 0)
  
  return totalViews > 0 ? Math.round((totalEngagements / totalViews) * 100) : 0
}

function calculatePublishingFrequency(posts: any[]) {
  if (posts.length < 2) return 'Insufficient data'
  
  const dates = posts.map(post => new Date(post.createdAt).getTime()).sort((a, b) => b - a)
  const intervals = []
  
  for (let i = 1; i < dates.length; i++) {
    intervals.push(dates[i - 1] - dates[i])
  }
  
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  const avgDays = Math.round(avgInterval / (1000 * 60 * 60 * 24))
  
  if (avgDays <= 1) return 'Daily'
  if (avgDays <= 3) return 'Every few days'
  if (avgDays <= 7) return 'Weekly'
  if (avgDays <= 14) return 'Bi-weekly'
  return 'Monthly or less'
}
