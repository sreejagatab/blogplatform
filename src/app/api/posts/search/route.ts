import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'relevance'

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ],
      ...(category && { 
        category: { 
          slug: category 
        } 
      }),
      ...(tag && { 
        tags: { 
          some: { 
            tag: { 
              slug: tag 
            } 
          } 
        } 
      })
    }

    // Build order by clause
    let orderBy: any = { publishedAt: 'desc' }
    switch (sort) {
      case 'newest':
        orderBy = { publishedAt: 'desc' }
        break
      case 'oldest':
        orderBy = { publishedAt: 'asc' }
        break
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'liked':
        orderBy = { likeCount: 'desc' }
        break
      case 'commented':
        orderBy = { commentCount: 'desc' }
        break
      default:
        orderBy = { publishedAt: 'desc' }
    }

    // Get posts and total count
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        tags: post.tags.map(pt => pt.tag)
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      },
      query
    })
  } catch (error) {
    console.error('Error searching posts:', error)
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    )
  }
}
