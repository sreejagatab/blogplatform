import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'all' // all, pending, approved, rejected
    const search = searchParams.get('search') || ''
    const postId = searchParams.get('postId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      ...(status !== 'all' && { 
        approved: status === 'approved' ? true : status === 'pending' ? null : false 
      }),
      ...(search && {
        OR: [
          { content: { contains: search, mode: 'insensitive' } },
          { author: { name: { contains: search, mode: 'insensitive' } } },
          { author: { email: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(postId && { postId })
    }

    // Get comments and total count
    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              replies: true
            }
          }
        }
      }),
      prisma.comment.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, commentIds } = body

    if (!action || !commentIds || !Array.isArray(commentIds)) {
      return NextResponse.json(
        { error: 'Action and commentIds are required' },
        { status: 400 }
      )
    }

    let result
    
    switch (action) {
      case 'approve':
        result = await prisma.comment.updateMany({
          where: { id: { in: commentIds } },
          data: { 
            approved: true,
            moderatedAt: new Date(),
            moderatedBy: session.user.id
          }
        })
        break

      case 'reject':
        result = await prisma.comment.updateMany({
          where: { id: { in: commentIds } },
          data: { 
            approved: false,
            moderatedAt: new Date(),
            moderatedBy: session.user.id
          }
        })
        break

      case 'delete':
        // First delete replies
        await prisma.comment.deleteMany({
          where: {
            parentId: { in: commentIds }
          }
        })
        
        // Then delete the comments
        result = await prisma.comment.deleteMany({
          where: { id: { in: commentIds } }
        })
        break

      case 'spam':
        result = await prisma.comment.updateMany({
          where: { id: { in: commentIds } },
          data: { 
            approved: false,
            isSpam: true,
            moderatedAt: new Date(),
            moderatedBy: session.user.id
          }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${result.count} comments`,
      count: result.count
    })

  } catch (error) {
    console.error('Error moderating comments:', error)
    return NextResponse.json(
      { error: 'Failed to moderate comments' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { commentId, content, approved } = body

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        ...(content && { content }),
        ...(approved !== undefined && { 
          approved,
          moderatedAt: new Date(),
          moderatedBy: session.user.id
        })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}
