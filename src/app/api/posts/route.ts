import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build query conditions
    const where: any = {
      status: 'PUBLISHED',
      ...(featured && { featured: true }),
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
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Build order by clause
    let orderBy: any = { publishedAt: 'desc' }
    switch (sort) {
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

    const posts = await prisma.post.findMany({
      where,
      take: limit + 1, // Take one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1
      }),
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
    })

    const hasMore = posts.length > limit
    const postsToReturn = hasMore ? posts.slice(0, -1) : posts
    const nextCursor = hasMore ? posts[posts.length - 2].id : null

    return NextResponse.json({
      posts: postsToReturn,
      nextCursor,
      hasMore
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

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
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      categoryId,
      tags = [],
      status = 'DRAFT'
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    if (slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })
      
      if (existingPost) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        content,
        excerpt,
        featuredImage,
        categoryId,
        authorId: session.user.id,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        // Handle tags if provided
        ...(tags.length > 0 && {
          tags: {
            create: tags.map((tagId: string) => ({
              tag: { connect: { id: tagId } }
            }))
          }
        })
      },
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
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
