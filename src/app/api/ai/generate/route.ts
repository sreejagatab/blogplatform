import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { aiService } from '@/lib/ai-service'
import { z } from 'zod'

const generateSchema = z.object({
  topic: z.string().min(1),
  type: z.enum(['blog-post', 'social-media', 'newsletter', 'product-description']),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'humorous']),
  length: z.enum(['short', 'medium', 'long']),
  targetAudience: z.string().min(1),
  keywords: z.array(z.string()).optional(),
  platform: z.string().optional(),
  includeImages: z.boolean().default(false),
  includeHashtags: z.boolean().default(true)
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
    const generationRequest = generateSchema.parse(body)

    // Generate content using AI service
    const generatedContent = await aiService.generateContent(generationRequest)

    // Generate additional hashtags if platform is specified
    let platformHashtags: string[] = []
    if (generationRequest.platform && generationRequest.includeHashtags) {
      try {
        platformHashtags = await aiService.generateHashtags(
          generatedContent.content,
          generationRequest.platform
        )
      } catch (error) {
        console.error('Platform hashtag generation failed:', error)
      }
    }

    // Combine hashtags
    const allHashtags = [
      ...generatedContent.hashtags,
      ...platformHashtags.filter(tag => !generatedContent.hashtags.includes(tag))
    ].slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        ...generatedContent,
        hashtags: allHashtags,
        platformOptimized: !!generationRequest.platform,
        generatedAt: new Date().toISOString(),
        request: {
          topic: generationRequest.topic,
          type: generationRequest.type,
          tone: generationRequest.tone,
          length: generationRequest.length,
          targetAudience: generationRequest.targetAudience,
          platform: generationRequest.platform
        }
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('AI content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

// GET endpoint for content ideas
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche') || 'technology'
    const count = parseInt(searchParams.get('count') || '5')

    // Generate content ideas
    const ideas = []
    const topics = [
      `${niche} trends 2024`,
      `Best ${niche} practices`,
      `${niche} for beginners`,
      `Advanced ${niche} techniques`,
      `${niche} case studies`,
      `Future of ${niche}`,
      `${niche} tools and resources`,
      `Common ${niche} mistakes`,
      `${niche} success stories`,
      `${niche} industry insights`
    ]

    for (let i = 0; i < Math.min(count, topics.length); i++) {
      const topic = topics[i]
      ideas.push({
        id: `idea-${i + 1}`,
        title: topic,
        description: `Comprehensive guide about ${topic.toLowerCase()}`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        estimatedReadTime: Math.floor(Math.random() * 10) + 5,
        trendScore: Math.floor(Math.random() * 40) + 60,
        suggestedType: ['blog-post', 'social-media', 'newsletter'][Math.floor(Math.random() * 3)],
        keywords: [
          topic.toLowerCase(),
          `${niche} guide`,
          `${niche} tips`,
          `${niche} best practices`
        ]
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ideas,
        niche,
        generatedAt: new Date().toISOString(),
        totalCount: ideas.length
      }
    })
  } catch (error) {
    console.error('Content ideas generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    )
  }
}
