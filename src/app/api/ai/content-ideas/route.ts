import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAIContentManager } from '@/lib/ai/ai-content-manager'
import { z } from 'zod'

const contentIdeasSchema = z.object({
  topic: z.string().min(1),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  contentType: z.enum(['blog', 'social', 'video', 'newsletter', 'all']).default('all'),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational']).default('professional'),
  platforms: z.array(z.string()).default(['general']),
  count: z.number().min(1).max(50).default(10),
  includeOutlines: z.boolean().default(false),
  includeTrends: z.boolean().default(true)
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
      topic,
      industry,
      targetAudience,
      contentType,
      tone,
      platforms,
      count,
      includeOutlines,
      includeTrends
    } = contentIdeasSchema.parse(body)

    const aiManager = getAIContentManager()

    // Generate content ideas using AI
    const prompt = buildContentIdeasPrompt({
      topic,
      industry,
      targetAudience,
      contentType,
      tone,
      platforms,
      count,
      includeOutlines
    })

    const ideas = await aiManager.getWritingAssistance({
      content: prompt,
      assistanceType: 'content_ideas',
      context: `Generate ${count} content ideas for ${topic}`,
      targetAudience,
      tone
    })

    // Get trending topics if requested
    let trendingTopics = null
    if (includeTrends) {
      try {
        trendingTopics = await aiManager.analyzeTrends(topic, platforms)
      } catch (error) {
        console.error('Failed to get trending topics:', error)
      }
    }

    // Parse and structure the response
    const structuredIdeas = parseContentIdeas(ideas, includeOutlines)

    // Generate additional metadata for each idea
    const enhancedIdeas = await Promise.all(
      structuredIdeas.map(async (idea) => {
        try {
          // Generate quick SEO keywords for each idea
          const seoAnalysis = await aiManager.analyzeSEO(idea.title, idea.description || '')
          
          return {
            ...idea,
            seoKeywords: seoAnalysis.keywords?.slice(0, 5) || [],
            estimatedEngagement: calculateEngagementScore(idea, topic, platforms),
            difficulty: assessContentDifficulty(idea),
            platforms: suggestOptimalPlatforms(idea, platforms)
          }
        } catch (error) {
          return {
            ...idea,
            seoKeywords: [],
            estimatedEngagement: 'medium',
            difficulty: 'medium',
            platforms: platforms
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        ideas: enhancedIdeas,
        trendingTopics,
        metadata: {
          topic,
          industry,
          targetAudience,
          contentType,
          tone,
          platforms,
          generatedAt: new Date().toISOString(),
          totalIdeas: enhancedIdeas.length
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

    console.error('Content ideas generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    )
  }
}

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
    const action = searchParams.get('action')

    if (action === 'trending') {
      const platform = searchParams.get('platform') || 'general'
      const category = searchParams.get('category')
      
      const aiManager = getAIContentManager()
      const trendingTopics = await aiManager.analyzeTrends(category, [platform])

      return NextResponse.json({
        success: true,
        data: {
          platform,
          category,
          trends: trendingTopics,
          lastUpdated: new Date().toISOString()
        }
      })
    }

    if (action === 'templates') {
      const contentType = searchParams.get('type') || 'blog'
      const templates = getContentTemplates(contentType)

      return NextResponse.json({
        success: true,
        data: {
          contentType,
          templates
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Content ideas GET error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function buildContentIdeasPrompt(params: any): string {
  return `Generate ${params.count} creative content ideas for the topic "${params.topic}".

Context:
- Industry: ${params.industry || 'General'}
- Target Audience: ${params.targetAudience || 'General audience'}
- Content Type: ${params.contentType}
- Tone: ${params.tone}
- Platforms: ${params.platforms.join(', ')}

Requirements:
1. Each idea should be unique and engaging
2. Include a compelling title
3. Provide a brief description (2-3 sentences)
4. Suggest content format (article, video, infographic, etc.)
5. Estimate content length/duration
${params.includeOutlines ? '6. Include a basic outline with 3-5 key points' : ''}

Return as JSON array:
[
  {
    "title": "Compelling title",
    "description": "Brief description of the content idea",
    "format": "blog|video|infographic|social|newsletter",
    "estimatedLength": "word count or duration",
    "tags": ["tag1", "tag2", "tag3"],
    "hook": "Attention-grabbing opening line",
    ${params.includeOutlines ? '"outline": ["Point 1", "Point 2", "Point 3"],' : ''}
    "callToAction": "Suggested CTA"
  }
]`
}

function parseContentIdeas(aiResponse: any, includeOutlines: boolean): any[] {
  try {
    // Try to parse AI response
    let ideas = []
    
    if (typeof aiResponse === 'string') {
      ideas = JSON.parse(aiResponse)
    } else if (aiResponse.suggestions) {
      // Handle different response formats
      ideas = Array.isArray(aiResponse.suggestions) ? aiResponse.suggestions : [aiResponse.suggestions]
    } else {
      ideas = Array.isArray(aiResponse) ? aiResponse : [aiResponse]
    }

    return ideas.map((idea: any, index: number) => ({
      id: `idea-${Date.now()}-${index}`,
      title: idea.title || `Content Idea ${index + 1}`,
      description: idea.description || 'No description provided',
      format: idea.format || 'blog',
      estimatedLength: idea.estimatedLength || '500-1000 words',
      tags: Array.isArray(idea.tags) ? idea.tags : [],
      hook: idea.hook || '',
      outline: includeOutlines ? (idea.outline || []) : [],
      callToAction: idea.callToAction || 'Learn more',
      createdAt: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to parse content ideas:', error)
    return []
  }
}

function calculateEngagementScore(idea: any, topic: string, platforms: string[]): string {
  // Simple engagement scoring based on various factors
  let score = 0

  // Title length (optimal 6-12 words)
  const titleWords = idea.title.split(' ').length
  if (titleWords >= 6 && titleWords <= 12) score += 2

  // Has compelling hook
  if (idea.hook && idea.hook.length > 10) score += 2

  // Has clear CTA
  if (idea.callToAction && idea.callToAction.length > 5) score += 1

  // Format popularity on platforms
  if (platforms.includes('instagram') && idea.format === 'video') score += 2
  if (platforms.includes('linkedin') && idea.format === 'blog') score += 2
  if (platforms.includes('tiktok') && idea.format === 'video') score += 3

  // Tags relevance
  if (idea.tags.length >= 3) score += 1

  if (score >= 7) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

function assessContentDifficulty(idea: any): string {
  // Assess content creation difficulty
  let difficulty = 0

  if (idea.format === 'video') difficulty += 2
  if (idea.format === 'infographic') difficulty += 2
  if (idea.estimatedLength.includes('2000+')) difficulty += 1
  if (idea.outline && idea.outline.length > 5) difficulty += 1

  if (difficulty >= 4) return 'hard'
  if (difficulty >= 2) return 'medium'
  return 'easy'
}

function suggestOptimalPlatforms(idea: any, requestedPlatforms: string[]): string[] {
  const platformSuggestions: Record<string, string[]> = {
    'blog': ['linkedin', 'medium', 'website'],
    'video': ['youtube', 'tiktok', 'instagram', 'facebook'],
    'infographic': ['pinterest', 'instagram', 'linkedin'],
    'social': ['twitter', 'facebook', 'instagram', 'linkedin'],
    'newsletter': ['email', 'linkedin']
  }

  const suggested = platformSuggestions[idea.format] || requestedPlatforms
  return suggested.filter(platform => requestedPlatforms.includes(platform) || requestedPlatforms.includes('general'))
}

function getContentTemplates(contentType: string): any[] {
  const templates: Record<string, any[]> = {
    blog: [
      {
        name: 'How-to Guide',
        structure: ['Introduction', 'Step 1', 'Step 2', 'Step 3', 'Conclusion'],
        description: 'Educational content that teaches readers how to accomplish something'
      },
      {
        name: 'Listicle',
        structure: ['Introduction', 'Item 1', 'Item 2', 'Item 3', 'Conclusion'],
        description: 'List-based content that\'s easy to scan and share'
      }
    ],
    social: [
      {
        name: 'Question Post',
        structure: ['Hook Question', 'Context', 'Call to Action'],
        description: 'Engagement-focused post that encourages comments'
      }
    ]
  }

  return templates[contentType] || []
}
