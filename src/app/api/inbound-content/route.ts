import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const getContentSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  platform: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

const updateContentSchema = z.object({
  contentId: z.string(),
  status: z.enum(['pending', 'processed', 'published', 'archived']).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  extractedTags: z.array(z.string()).optional()
})

// GET /api/inbound-content - Get user's inbound content
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const validatedParams = getContentSchema.parse(params)

    // Build where clause
    const where: any = {
      userId: session.user.id
    }

    if (validatedParams.platform) {
      where.platform = validatedParams.platform
    }

    if (validatedParams.status) {
      where.status = validatedParams.status
    }

    if (validatedParams.search) {
      where.OR = [
        { title: { contains: validatedParams.search, mode: 'insensitive' } },
        { content: { contains: validatedParams.search, mode: 'insensitive' } },
        { extractedTags: { has: validatedParams.search } },
        { extractedTopics: { has: validatedParams.search } }
      ]
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit
    const take = validatedParams.limit

    // Get content with pagination
    const [content, totalCount] = await Promise.all([
      prisma.inboundContent.findMany({
        where,
        skip,
        take,
        orderBy: {
          [validatedParams.sortBy]: validatedParams.sortOrder
        },
        select: {
          id: true,
          platform: true,
          platformPostId: true,
          title: true,
          content: true,
          excerpt: true,
          extractedTags: true,
          extractedTopics: true,
          sentiment: true,
          language: true,
          wordCount: true,
          readingTime: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          crossPosts: {
            select: {
              id: true,
              targetPlatform: true,
              status: true,
              platformPostId: true,
              platformUrl: true,
              publishedAt: true
            }
          }
        }
      }),
      prisma.inboundContent.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validatedParams.limit)
    const hasNextPage = validatedParams.page < totalPages
    const hasPreviousPage = validatedParams.page > 1

    return NextResponse.json({
      content,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    })
  } catch (error) {
    console.error('Failed to fetch inbound content:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch inbound content' },
      { status: 500 }
    )
  }
}

// PUT /api/inbound-content - Update inbound content
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateContentSchema.parse(body)

    // Verify user owns this content
    const existingContent = await prisma.inboundContent.findFirst({
      where: {
        id: validatedData.contentId,
        userId: session.user.id
      }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Update content
    const updatedContent = await prisma.inboundContent.update({
      where: { id: validatedData.contentId },
      data: {
        status: validatedData.status,
        title: validatedData.title,
        content: validatedData.content,
        extractedTags: validatedData.extractedTags,
        updatedAt: new Date()
      },
      select: {
        id: true,
        platform: true,
        title: true,
        content: true,
        status: true,
        extractedTags: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      content: updatedContent,
      message: 'Content updated successfully'
    })
  } catch (error) {
    console.error('Failed to update inbound content:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE /api/inbound-content - Delete inbound content
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this content
    const existingContent = await prisma.inboundContent.findFirst({
      where: {
        id: contentId,
        userId: session.user.id
      }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Delete content (this will also delete related cross-posts due to cascade)
    await prisma.inboundContent.delete({
      where: { id: contentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete inbound content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
