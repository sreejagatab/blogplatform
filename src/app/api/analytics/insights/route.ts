import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { getAIContentManager } from '@/lib/ai/ai-content-manager'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const includeAI = searchParams.get('includeAI') === 'true'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get comprehensive analytics data
    const [
      contentPerformance,
      audienceInsights,
      engagementPatterns,
      growthMetrics,
      platformEffectiveness
    ] = await Promise.all([
      analyzeContentPerformance(startDate, now),
      analyzeAudienceInsights(startDate, now),
      analyzeEngagementPatterns(startDate, now),
      analyzeGrowthMetrics(startDate, now),
      analyzePlatformEffectiveness(startDate, now)
    ])

    // Generate AI-powered insights if requested
    let aiInsights = null
    if (includeAI) {
      try {
        const aiManager = getAIContentManager()
        aiInsights = await generateAIInsights(
          aiManager,
          { contentPerformance, audienceInsights, engagementPatterns, growthMetrics, platformEffectiveness }
        )
      } catch (error) {
        console.error('AI insights generation failed:', error)
      }
    }

    // Generate actionable recommendations
    const recommendations = generateRecommendations({
      contentPerformance,
      audienceInsights,
      engagementPatterns,
      growthMetrics,
      platformEffectiveness
    })

    return NextResponse.json({
      success: true,
      data: {
        timeframe,
        dateRange: { start: startDate, end: now },
        insights: {
          contentPerformance,
          audienceInsights,
          engagementPatterns,
          growthMetrics,
          platformEffectiveness
        },
        aiInsights,
        recommendations,
        summary: generateInsightsSummary({
          contentPerformance,
          audienceInsights,
          engagementPatterns,
          growthMetrics,
          platformEffectiveness
        }),
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Analytics insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics insights' },
      { status: 500 }
    )
  }
}

async function analyzeContentPerformance(startDate: Date, endDate: Date) {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          pageViews: true
        }
      }
    }
  })

  // Analyze content patterns
  const categoryPerformance = posts.reduce((acc: any, post) => {
    const category = post.category?.name || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = { posts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 }
    }
    acc[category].posts++
    acc[category].totalViews += post.viewCount || 0
    acc[category].totalLikes += post._count.likes
    acc[category].totalComments += post._count.comments
    return acc
  }, {})

  // Calculate average performance metrics
  const avgViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0) / Math.max(posts.length, 1)
  const avgLikes = posts.reduce((sum, post) => sum + post._count.likes, 0) / Math.max(posts.length, 1)
  const avgComments = posts.reduce((sum, post) => sum + post._count.comments, 0) / Math.max(posts.length, 1)

  // Find top performing content
  const topPosts = posts
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
    .map(post => ({
      id: post.id,
      title: post.title,
      views: post.viewCount || 0,
      likes: post._count.likes,
      comments: post._count.comments,
      category: post.category?.name,
      publishedAt: post.publishedAt
    }))

  return {
    totalPosts: posts.length,
    avgViews,
    avgLikes,
    avgComments,
    categoryPerformance,
    topPosts,
    contentTrends: analyzeContentTrends(posts)
  }
}

async function analyzeAudienceInsights(startDate: Date, endDate: Date) {
  // Get page view data for audience analysis
  const pageViews = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  })

  // Analyze audience behavior
  const uniqueVisitors = new Set(pageViews.map(pv => pv.visitorId)).size
  const totalPageViews = pageViews.length
  const avgSessionLength = totalPageViews / Math.max(uniqueVisitors, 1)

  // Analyze traffic sources
  const trafficSources = pageViews.reduce((acc: any, pv) => {
    const source = pv.referrer || 'Direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})

  // Analyze user engagement patterns
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
    const count = pageViews.filter(pv => new Date(pv.createdAt).getHours() === hour).length
    return { hour, activity: count }
  })

  return {
    uniqueVisitors,
    totalPageViews,
    avgSessionLength,
    trafficSources,
    hourlyActivity,
    returningVisitorRate: Math.random() * 30 + 20, // Mock data
    bounceRate: Math.random() * 40 + 30 // Mock data
  }
}

async function analyzeEngagementPatterns(startDate: Date, endDate: Date) {
  const [likes, comments] = await Promise.all([
    prisma.postLike.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        post: {
          select: {
            publishedAt: true,
            category: {
              select: { name: true }
            }
          }
        }
      }
    }),
    prisma.comment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        post: {
          select: {
            publishedAt: true,
            category: {
              select: { name: true }
            }
          }
        }
      }
    })
  ])

  // Analyze engagement timing
  const engagementByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourLikes = likes.filter(like => new Date(like.createdAt).getHours() === hour).length
    const hourComments = comments.filter(comment => new Date(comment.createdAt).getHours() === hour).length
    return { hour, likes: hourLikes, comments: hourComments, total: hourLikes + hourComments }
  })

  // Analyze engagement by content type
  const engagementByCategory = likes.concat(comments as any).reduce((acc: any, engagement) => {
    const category = engagement.post?.category?.name || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = { likes: 0, comments: 0 }
    }
    if ('postId' in engagement && !('content' in engagement)) {
      acc[category].likes++
    } else {
      acc[category].comments++
    }
    return acc
  }, {})

  return {
    totalLikes: likes.length,
    totalComments: comments.length,
    engagementByHour,
    engagementByCategory,
    peakEngagementHour: engagementByHour.reduce((max, current) => 
      current.total > max.total ? current : max
    ).hour
  }
}

async function analyzeGrowthMetrics(startDate: Date, endDate: Date) {
  // Calculate growth metrics
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const midDate = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2)

  const [firstHalfViews, secondHalfViews] = await Promise.all([
    prisma.pageView.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: midDate
        }
      }
    }),
    prisma.pageView.count({
      where: {
        createdAt: {
          gte: midDate,
          lte: endDate
        }
      }
    })
  ])

  const viewsGrowthRate = firstHalfViews > 0 
    ? ((secondHalfViews - firstHalfViews) / firstHalfViews) * 100 
    : 0

  return {
    viewsGrowthRate,
    dailyAvgViews: (firstHalfViews + secondHalfViews) / days,
    trend: viewsGrowthRate > 0 ? 'growing' : viewsGrowthRate < 0 ? 'declining' : 'stable'
  }
}

async function analyzePlatformEffectiveness(startDate: Date, endDate: Date) {
  const platformPosts = await prisma.platformPost.findMany({
    where: {
      publishedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      post: {
        select: {
          viewCount: true,
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      }
    }
  })

  const platformMetrics = platformPosts.reduce((acc: any, pp) => {
    if (!acc[pp.platform]) {
      acc[pp.platform] = { posts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 }
    }
    acc[pp.platform].posts++
    acc[pp.platform].totalViews += pp.post.viewCount || 0
    acc[pp.platform].totalLikes += pp.post._count.likes
    acc[pp.platform].totalComments += pp.post._count.comments
    return acc
  }, {})

  // Calculate effectiveness scores
  Object.keys(platformMetrics).forEach(platform => {
    const metrics = platformMetrics[platform]
    metrics.avgViews = metrics.totalViews / Math.max(metrics.posts, 1)
    metrics.engagementRate = metrics.totalViews > 0 
      ? ((metrics.totalLikes + metrics.totalComments) / metrics.totalViews) * 100 
      : 0
  })

  return platformMetrics
}

function analyzeContentTrends(posts: any[]) {
  // Analyze content length vs performance
  const lengthBuckets = posts.reduce((acc: any, post) => {
    const length = post.content?.length || 0
    const bucket = length < 500 ? 'short' : length < 1500 ? 'medium' : 'long'
    if (!acc[bucket]) {
      acc[bucket] = { count: 0, totalViews: 0, avgViews: 0 }
    }
    acc[bucket].count++
    acc[bucket].totalViews += post.viewCount || 0
    return acc
  }, {})

  Object.keys(lengthBuckets).forEach(bucket => {
    lengthBuckets[bucket].avgViews = lengthBuckets[bucket].totalViews / lengthBuckets[bucket].count
  })

  return { lengthBuckets }
}

async function generateAIInsights(aiManager: any, data: any) {
  try {
    const prompt = `Analyze the following blog analytics data and provide actionable insights:

Content Performance: ${JSON.stringify(data.contentPerformance, null, 2)}
Audience Insights: ${JSON.stringify(data.audienceInsights, null, 2)}
Engagement Patterns: ${JSON.stringify(data.engagementPatterns, null, 2)}

Provide insights in the following format:
{
  "keyFindings": ["finding1", "finding2", "finding3"],
  "opportunities": ["opportunity1", "opportunity2"],
  "concerns": ["concern1", "concern2"],
  "predictions": ["prediction1", "prediction2"]
}`

    const insights = await aiManager.getWritingAssistance({
      content: prompt,
      assistanceType: 'analytics_insights',
      context: 'Blog analytics analysis'
    })

    return typeof insights === 'string' ? JSON.parse(insights) : insights
  } catch (error) {
    console.error('AI insights generation error:', error)
    return null
  }
}

function generateRecommendations(data: any) {
  const recommendations = []

  // Content recommendations
  if (data.contentPerformance.avgViews < 1000) {
    recommendations.push({
      type: 'content',
      priority: 'high',
      title: 'Improve Content Quality',
      description: 'Average views are below 1000. Consider improving content quality and SEO optimization.'
    })
  }

  // Engagement recommendations
  const engagementRate = (data.engagementPatterns.totalLikes + data.engagementPatterns.totalComments) / 
    Math.max(data.audienceInsights.totalPageViews, 1) * 100

  if (engagementRate < 2) {
    recommendations.push({
      type: 'engagement',
      priority: 'medium',
      title: 'Boost Engagement',
      description: 'Engagement rate is low. Try adding more interactive elements and calls-to-action.'
    })
  }

  // Growth recommendations
  if (data.growthMetrics.viewsGrowthRate < 0) {
    recommendations.push({
      type: 'growth',
      priority: 'high',
      title: 'Address Declining Views',
      description: 'Views are declining. Review content strategy and consider new topics or formats.'
    })
  }

  return recommendations
}

function generateInsightsSummary(data: any) {
  return {
    overallHealth: data.growthMetrics.viewsGrowthRate > 0 ? 'good' : 'needs_attention',
    topPerformingCategory: Object.entries(data.contentPerformance.categoryPerformance)
      .sort(([,a]: any, [,b]: any) => b.totalViews - a.totalViews)[0]?.[0] || 'None',
    bestEngagementTime: data.engagementPatterns.peakEngagementHour,
    primaryTrafficSource: Object.entries(data.audienceInsights.trafficSources)
      .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'Unknown'
  }
}
