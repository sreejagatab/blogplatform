import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to like posts' },
        { status: 401 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id
        }
      }
    })

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          id: existingLike.id
        }
      })

      // Update like count
      await prisma.post.update({
        where: { id: params.id },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      })

      return NextResponse.json(
        { message: 'Post unliked', liked: false },
        { status: 200 }
      )
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          postId: params.id,
          userId: session.user.id
        }
      })

      // Update like count
      await prisma.post.update({
        where: { id: params.id },
        data: {
          likeCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json(
        { message: 'Post liked', liked: true },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json({ liked: false })
  }
}
