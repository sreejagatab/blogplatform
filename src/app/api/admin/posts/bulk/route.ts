import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, postIds } = await request.json()

    if (!action || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Check if user has permission to modify these posts
    const posts = await prisma.post.findMany({
      where: { 
        id: { in: postIds },
        // Non-admins can only modify their own posts
        ...(session.user.role !== 'ADMIN' && { authorId: session.user.id })
      },
      select: { id: true }
    })

    if (posts.length !== postIds.length) {
      return NextResponse.json(
        { error: 'Some posts not found or permission denied' },
        { status: 403 }
      )
    }

    let updateData: any = {}
    
    switch (action) {
      case 'publish':
        updateData = {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        }
        break
      
      case 'draft':
        updateData = {
          status: 'DRAFT',
          publishedAt: null,
        }
        break
      
      case 'archive':
        updateData = {
          status: 'ARCHIVED',
        }
        break
      
      case 'feature':
        updateData = {
          featured: true,
        }
        break
      
      case 'unfeature':
        updateData = {
          featured: false,
        }
        break
      
      case 'delete':
        // For delete action, we actually delete the records
        await prisma.post.deleteMany({
          where: { id: { in: postIds } }
        })
        
        return NextResponse.json({
          message: `${postIds.length} post(s) deleted successfully`,
          action,
          count: postIds.length,
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update the posts
    const result = await prisma.post.updateMany({
      where: { id: { in: postIds } },
      data: updateData,
    })

    return NextResponse.json({
      message: `${result.count} post(s) ${action}d successfully`,
      action,
      count: result.count,
    })

  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
