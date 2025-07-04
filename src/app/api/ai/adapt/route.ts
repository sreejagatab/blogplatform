import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { contentAdaptationEngine } from '@/lib/content-adaptation-engine'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const adaptationSchema = z.object({
  postId: z.string().optional(),
  content: z.object({
    title: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    canonicalUrl: z.string().optional()
  }).optional(),
  targetPlatforms: z.array(z.string()).min(1),
  optimizationGoals: z.array(z.enum(['engagement', 'reach', 'conversion', 'seo'])).optional(),
  preserveOriginalTone: z.boolean().default(true),
  includeCallToAction: z.boolean().default(true),
  customInstructions: z.string().optional()
})

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
      postId,
      content,
      targetPlatforms,
      optimizationGoals,
      preserveOriginalTone,
      includeCallToAction,
      customInstructions
    } = adaptationSchema.parse(body)

    let originalContent

    // Get content from database or use provided content
    if (postId) {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
          authorId: session.user.id // Ensure user owns the post
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found or access denied' },
          { status: 404 }
        )
      }

      originalContent = {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage || undefined,
        author: {
          name: session.user.name || 'Unknown',
          bio: undefined,
          avatar: session.user.image || undefined
        },
        tags: post.tags.map(t => t.tag.name),
        publishedAt: post.publishedAt || undefined,
        updatedAt: post.updatedAt,
        seoTitle: post.metaTitle || undefined,
        seoDescription: post.metaDescription || undefined,
        canonicalUrl: post.canonicalUrl || undefined
      }
    } else if (content) {
      originalContent = {
        id: 'temp-' + Date.now(),
        title: content.title,
        content: content.content,
        excerpt: content.excerpt || '',
        featuredImage: content.featuredImage,
        author: {
          name: session.user.name || 'Unknown',
          bio: undefined,
          avatar: session.user.image || undefined
        },
        tags: content.tags,
        publishedAt: undefined,
        updatedAt: new Date(),
        seoTitle: undefined,
        seoDescription: undefined,
        canonicalUrl: content.canonicalUrl
      }
    } else {
      return NextResponse.json(
        { error: 'Either postId or content must be provided' },
        { status: 400 }
      )
    }

    // Adapt content for target platforms
    const adaptationResult = await contentAdaptationEngine.adaptContentForPlatforms({
      originalContent,
      targetPlatforms,
      optimizationGoals,
      preserveOriginalTone,
      includeCallToAction,
      customInstructions
    })

    return NextResponse.json({
      success: true,
      data: adaptationResult
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Content adaptation error:', error)
    return NextResponse.json(
      { error: 'Failed to adapt content' },
      { status: 500 }
    )
  }
}
