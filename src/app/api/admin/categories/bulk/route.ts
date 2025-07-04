import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, categoryIds } = body

    if (!action || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Action and category IDs are required' },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'delete':
        // Check if any categories have posts
        const categoriesWithPosts = await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          include: {
            _count: {
              select: { posts: true }
            }
          }
        })

        const categoriesWithPostsCount = categoriesWithPosts.filter(cat => cat._count.posts > 0)
        
        if (categoriesWithPostsCount.length > 0) {
          return NextResponse.json(
            { 
              error: 'Cannot delete categories with existing posts',
              categoriesWithPosts: categoriesWithPostsCount.map(cat => ({
                id: cat.id,
                name: cat.name,
                postCount: cat._count.posts
              }))
            },
            { status: 400 }
          )
        }

        const deleteResult = await prisma.category.deleteMany({
          where: { id: { in: categoryIds } }
        })

        result = {
          action: 'delete',
          deletedCount: deleteResult.count,
          success: true
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
