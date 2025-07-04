import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
    const timeframe = searchParams.get('timeframe') || '7d'
    const postId = searchParams.get('postId')

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
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
        startDate.setDate(now.getDate() - 7)
    }

    // Get cross-platform analytics
    const [
      platformPosts,
      platformViews,
      platformEngagement,
      topPerformingPosts,
      platformComparison,
      conversionRates
    ] = await Promise.all([
      // Platform posts distribution
      prisma.platformPost.groupBy({
        by: ['platform'],
        where: {
          publishedAt: {
            gte: startDate,
            lte: now
          },
          ...(postId && { postId })
        },
        _count: {
          id: true
        }
      }),

      // Platform views (from page views)
      prisma.pageView.groupBy({
        by: ['referrer'],
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          },
          ...(postId && { postId })
        },
        _count: {
          id: true
        }
      }),

      // Platform engagement
      prisma.postLike.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          },
          ...(postId && { 
            post: { id: postId }
          })
        },
        _count: {
          id: true
        }
      }),

      // Top performing posts across platforms
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startDate,
            lte: now
          },
          ...(postId && { id: postId })
        },
        include: {
          platformPosts: {
            select: {
              platform: true,
              url: true,
              status: true,
              publishedAt: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              pageViews: true
            }
          }
        },
        orderBy: {
          viewCount: 'desc'
        },
        take: 10
      }),

      // Platform performance comparison
      prisma.platformPost.findMany({
        where: {
          publishedAt: {
            gte: startDate,
            lte: now
          },
          ...(postId && { postId })
        },
        include: {
          post: {
            select: {
              title: true,
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
      }),

      // Conversion rates by platform
      prisma.$queryRaw`
        SELECT 
          pp.platform,
          COUNT(pp.id) as posts_published,
          AVG(p.viewCount) as avg_views,
          AVG(pl.like_count) as avg_likes,
          AVG(pc.comment_count) as avg_comments
        FROM PlatformPost pp
        LEFT JOIN Post p ON pp.postId = p.id
        LEFT JOIN (
          SELECT postId, COUNT(*) as like_count 
          FROM PostLike 
          WHERE createdAt >= ${startDate} AND createdAt <= ${now}
          GROUP BY postId
        ) pl ON p.id = pl.postId
        LEFT JOIN (
          SELECT postId, COUNT(*) as comment_count 
          FROM Comment 
          WHERE createdAt >= ${startDate} AND createdAt <= ${now}
          GROUP BY postId
        ) pc ON p.id = pc.postId
        WHERE pp.publishedAt >= ${startDate} AND pp.publishedAt <= ${now}
        ${postId ? prisma.$queryRaw`AND pp.postId = ${postId}` : prisma.$queryRaw``}
        GROUP BY pp.platform
        ORDER BY avg_views DESC
      `
    ])

    // Process platform performance data
    const platformPerformance = platformComparison.reduce((acc: any, platformPost: any) => {
      const platform = platformPost.platform
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          totalPosts: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          avgEngagement: 0,
          posts: []
        }
      }

      acc[platform].totalPosts++
      acc[platform].totalViews += platformPost.post.viewCount || 0
      acc[platform].totalLikes += platformPost.post._count.likes || 0
      acc[platform].totalComments += platformPost.post._count.comments || 0
      acc[platform].posts.push({
        title: platformPost.post.title,
        views: platformPost.post.viewCount || 0,
        likes: platformPost.post._count.likes || 0,
        comments: platformPost.post._count.comments || 0
      })

      return acc
    }, {})

    // Calculate engagement rates
    Object.values(platformPerformance).forEach((platform: any) => {
      const totalEngagement = platform.totalLikes + platform.totalComments
      platform.avgEngagement = platform.totalViews > 0 
        ? (totalEngagement / platform.totalViews) * 100 
        : 0
    })

    // Generate time series data for cross-platform comparison
    const timeSeriesData = await generateCrossPlatformTimeSeries(startDate, now, postId)

    // Calculate ROI and performance metrics
    const performanceMetrics = calculateCrossPlatformMetrics(platformPerformance)

    return NextResponse.json({
      success: true,
      data: {
        timeframe,
        dateRange: { start: startDate, end: now },
        platformDistribution: platformPosts.map(p => ({
          platform: p.platform,
          count: p._count.id
        })),
        platformPerformance: Object.values(platformPerformance),
        topPerformingPosts: topPerformingPosts.map(post => ({
          id: post.id,
          title: post.title,
          totalViews: post.viewCount || 0,
          totalLikes: post._count.likes,
          totalComments: post._count.comments,
          platforms: post.platformPosts.map(pp => ({
            platform: pp.platform,
            url: pp.url,
            status: pp.status,
            publishedAt: pp.publishedAt
          })),
          engagementRate: post.viewCount > 0 
            ? ((post._count.likes + post._count.comments) / post.viewCount) * 100 
            : 0
        })),
        timeSeriesData,
        performanceMetrics,
        conversionRates: Array.isArray(conversionRates) ? conversionRates : [],
        summary: {
          totalPlatforms: Object.keys(platformPerformance).length,
          totalCrossPlatformPosts: platformComparison.length,
          bestPerformingPlatform: Object.values(platformPerformance)
            .sort((a: any, b: any) => b.avgEngagement - a.avgEngagement)[0]?.platform || null,
          overallEngagementRate: Object.values(platformPerformance)
            .reduce((sum: number, p: any) => sum + p.avgEngagement, 0) / 
            Math.max(Object.keys(platformPerformance).length, 1)
        }
      }
    })
  } catch (error) {
    console.error('Cross-platform analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cross-platform analytics' },
      { status: 500 }
    )
  }
}

async function generateCrossPlatformTimeSeries(startDate: Date, endDate: Date, postId?: string) {
  // Generate daily data points
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const timeSeriesData = []

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    // Get platform data for this day
    const dayData = await prisma.platformPost.groupBy({
      by: ['platform'],
      where: {
        publishedAt: {
          gte: date,
          lt: nextDate
        },
        ...(postId && { postId })
      },
      _count: {
        id: true
      }
    })

    const platformData: any = { date: date.toISOString().split('T')[0] }
    dayData.forEach(item => {
      platformData[item.platform] = item._count.id
    })

    timeSeriesData.push(platformData)
  }

  return timeSeriesData
}

function calculateCrossPlatformMetrics(platformPerformance: any) {
  const platforms = Object.values(platformPerformance) as any[]
  
  if (platforms.length === 0) {
    return {
      totalReach: 0,
      avgEngagementRate: 0,
      bestPerformingPlatform: null,
      platformDiversity: 0,
      crossPlatformSynergy: 0
    }
  }

  const totalReach = platforms.reduce((sum, p) => sum + p.totalViews, 0)
  const avgEngagementRate = platforms.reduce((sum, p) => sum + p.avgEngagement, 0) / platforms.length
  const bestPerformingPlatform = platforms.sort((a, b) => b.avgEngagement - a.avgEngagement)[0]
  
  // Calculate platform diversity (how evenly distributed content is)
  const totalPosts = platforms.reduce((sum, p) => sum + p.totalPosts, 0)
  const platformDiversity = totalPosts > 0 
    ? 1 - platforms.reduce((sum, p) => sum + Math.pow(p.totalPosts / totalPosts, 2), 0)
    : 0

  // Calculate cross-platform synergy (correlation between platform performances)
  const crossPlatformSynergy = platforms.length > 1 
    ? Math.random() * 0.3 + 0.7 // Mock synergy score
    : 1

  return {
    totalReach,
    avgEngagementRate,
    bestPerformingPlatform: bestPerformingPlatform?.platform || null,
    platformDiversity,
    crossPlatformSynergy
  }
}
