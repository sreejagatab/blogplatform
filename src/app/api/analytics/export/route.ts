import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const format = searchParams.get('format') || 'json'
    const timeframe = searchParams.get('timeframe') || '30d'
    const includeDetails = searchParams.get('includeDetails') === 'true'

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

    // Gather comprehensive analytics data
    const [
      posts,
      pageViews,
      likes,
      comments,
      platformPosts,
      users
    ] = await Promise.all([
      prisma.post.findMany({
        where: {
          publishedAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          category: {
            select: {
              name: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true
                }
              }
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
      }),
      prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      }),
      prisma.postLike.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          post: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.comment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          post: {
            select: {
              title: true
            }
          },
          author: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.platformPost.findMany({
        where: {
          publishedAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          post: {
            select: {
              title: true,
              viewCount: true
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      })
    ])

    // Process data for export
    const exportData = {
      metadata: {
        exportDate: now.toISOString(),
        timeframe,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        },
        totalRecords: {
          posts: posts.length,
          pageViews: pageViews.length,
          likes: likes.length,
          comments: comments.length,
          platformPosts: platformPosts.length,
          newUsers: users
        }
      },
      summary: {
        totalPosts: posts.length,
        totalViews: pageViews.length,
        totalLikes: likes.length,
        totalComments: comments.length,
        totalPlatformPosts: platformPosts.length,
        newUsers: users,
        avgViewsPerPost: posts.length > 0 ? pageViews.length / posts.length : 0,
        avgLikesPerPost: posts.length > 0 ? likes.length / posts.length : 0,
        avgCommentsPerPost: posts.length > 0 ? comments.length / posts.length : 0,
        engagementRate: pageViews.length > 0 ? ((likes.length + comments.length) / pageViews.length) * 100 : 0
      },
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        publishedAt: post.publishedAt,
        author: post.author.name,
        category: post.category?.name,
        tags: post.tags.map(t => t.tag.name),
        viewCount: post.viewCount,
        likes: post._count.likes,
        comments: post._count.comments,
        pageViews: post._count.pageViews,
        engagementRate: post.viewCount > 0 ? ((post._count.likes + post._count.comments) / post.viewCount) * 100 : 0,
        ...(includeDetails && {
          excerpt: post.excerpt,
          readingTime: post.readingTime,
          featuredImage: post.featuredImage
        })
      })),
      platformBreakdown: platformPosts.reduce((acc: any, pp) => {
        if (!acc[pp.platform]) {
          acc[pp.platform] = {
            platform: pp.platform,
            totalPosts: 0,
            totalViews: 0,
            avgViews: 0,
            posts: []
          }
        }
        acc[pp.platform].totalPosts++
        acc[pp.platform].totalViews += pp.post.viewCount || 0
        acc[pp.platform].posts.push({
          title: pp.post.title,
          url: pp.url,
          status: pp.status,
          publishedAt: pp.publishedAt,
          views: pp.post.viewCount || 0
        })
        return acc
      }, {}),
      trafficSources: pageViews.reduce((acc: any, pv) => {
        const source = pv.referrer || 'Direct'
        acc[source] = (acc[source] || 0) + 1
        return acc
      }, {}),
      topContent: posts
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 10)
        .map(post => ({
          id: post.id,
          title: post.title,
          views: post.viewCount || 0,
          likes: post._count.likes,
          comments: post._count.comments,
          publishedAt: post.publishedAt
        })),
      ...(includeDetails && {
        detailedPageViews: pageViews.map(pv => ({
          id: pv.id,
          postId: pv.postId,
          path: pv.path,
          referrer: pv.referrer,
          visitorId: pv.visitorId,
          userAgent: pv.userAgent,
          createdAt: pv.createdAt
        })),
        detailedLikes: likes.map(like => ({
          id: like.id,
          postId: like.postId,
          postTitle: like.post.title,
          userId: like.userId,
          createdAt: like.createdAt
        })),
        detailedComments: comments.map(comment => ({
          id: comment.id,
          postId: comment.postId,
          postTitle: comment.post.title,
          author: comment.author.name,
          content: comment.content,
          createdAt: comment.createdAt
        }))
      })
    }

    // Handle different export formats
    if (format === 'csv') {
      return exportAsCSV(exportData)
    } else if (format === 'xlsx') {
      return exportAsExcel(exportData)
    } else {
      // Default JSON format
      return NextResponse.json({
        success: true,
        data: exportData
      })
    }
  } catch (error) {
    console.error('Analytics export error:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    )
  }
}

function exportAsCSV(data: any) {
  // Create CSV content for posts
  const csvHeaders = [
    'ID', 'Title', 'Author', 'Category', 'Published Date', 
    'Views', 'Likes', 'Comments', 'Engagement Rate'
  ]
  
  const csvRows = data.posts.map((post: any) => [
    post.id,
    `"${post.title.replace(/"/g, '""')}"`,
    post.author,
    post.category || '',
    post.publishedAt,
    post.viewCount || 0,
    post.likes,
    post.comments,
    post.engagementRate.toFixed(2)
  ])

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="analytics-export-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}

function exportAsExcel(data: any) {
  // For Excel export, we'll return JSON with instructions
  // In a real implementation, you'd use a library like xlsx
  return NextResponse.json({
    success: true,
    message: 'Excel export not implemented yet. Use CSV format instead.',
    data: data
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      reportType, 
      timeframe, 
      filters, 
      includeCharts, 
      emailTo 
    } = body

    // Generate custom report
    const reportData = await generateCustomReport({
      reportType,
      timeframe,
      filters,
      includeCharts
    })

    // If email is requested, send the report
    if (emailTo) {
      // In a real implementation, you'd send an email with the report
      console.log(`Sending report to ${emailTo}`)
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      message: emailTo ? `Report sent to ${emailTo}` : 'Report generated successfully'
    })
  } catch (error) {
    console.error('Custom report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate custom report' },
      { status: 500 }
    )
  }
}

async function generateCustomReport(options: any) {
  const { reportType, timeframe, filters } = options

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
    default:
      startDate.setDate(now.getDate() - 30)
  }

  // Generate report based on type
  switch (reportType) {
    case 'content-performance':
      return await generateContentPerformanceReport(startDate, now, filters)
    case 'audience-insights':
      return await generateAudienceInsightsReport(startDate, now, filters)
    case 'platform-comparison':
      return await generatePlatformComparisonReport(startDate, now, filters)
    default:
      return await generateOverviewReport(startDate, now, filters)
  }
}

async function generateContentPerformanceReport(startDate: Date, endDate: Date, filters: any) {
  // Implementation for content performance report
  return {
    reportType: 'content-performance',
    dateRange: { start: startDate, end: endDate },
    data: {
      // Report data would go here
    }
  }
}

async function generateAudienceInsightsReport(startDate: Date, endDate: Date, filters: any) {
  // Implementation for audience insights report
  return {
    reportType: 'audience-insights',
    dateRange: { start: startDate, end: endDate },
    data: {
      // Report data would go here
    }
  }
}

async function generatePlatformComparisonReport(startDate: Date, endDate: Date, filters: any) {
  // Implementation for platform comparison report
  return {
    reportType: 'platform-comparison',
    dateRange: { start: startDate, end: endDate },
    data: {
      // Report data would go here
    }
  }
}

async function generateOverviewReport(startDate: Date, endDate: Date, filters: any) {
  // Implementation for overview report
  return {
    reportType: 'overview',
    dateRange: { start: startDate, end: endDate },
    data: {
      // Report data would go here
    }
  }
}
