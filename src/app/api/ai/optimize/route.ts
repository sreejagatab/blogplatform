import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { aiService } from '@/lib/ai-service'
import { z } from 'zod'

const optimizeSchema = z.object({
  content: z.string().min(1),
  title: z.string().optional(),
  platform: z.string(),
  targetAudience: z.string().optional(),
  goals: z.array(z.string()).default(['engagement', 'readability']),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational']).default('professional'),
  includeHashtags: z.boolean().default(true),
  includeSEO: z.boolean().default(true),
  maxLength: z.number().optional()
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
      content,
      title,
      platform,
      targetAudience,
      goals,
      tone,
      includeHashtags,
      includeSEO,
      maxLength
    } = optimizeSchema.parse(body)

    // Use our new AI service for content optimization
    const optimizationRequest = {
      content,
      platform,
      targetKeywords: [],
      maxLength,
      includeHashtags,
      includeCTA: true
    }

    const contentOptimization = await aiService.optimizeContent(optimizationRequest)

    // Generate hashtags if requested
    let hashtags: string[] = []
    if (includeHashtags) {
      try {
        hashtags = await aiService.generateHashtags(content, platform)
      } catch (error) {
        console.error('Hashtag generation failed:', error)
        hashtags = []
      }
    }

    // SEO analysis if requested
    let seoAnalysis = null
    if (includeSEO && title) {
      try {
        const seoRequest = {
          content,
          title,
          targetKeywords: []
        }
        seoAnalysis = await aiService.analyzeSEO(seoRequest)
      } catch (error) {
        console.error('SEO analysis failed:', error)
      }
    }

    // Content sentiment analysis
    let sentimentAnalysis = null
    try {
      sentimentAnalysis = await aiService.analyzeContentSentiment(content)
    } catch (error) {
      console.error('Sentiment analysis failed:', error)
    }

    return NextResponse.json({
      success: true,
      data: {
        // Optimized content
        optimizedContent: contentOptimization.optimizedContent,
        suggestions: contentOptimization.suggestions,
        improvements: contentOptimization.improvements,

        // Additional data
        hashtags,
        seoAnalysis,
        sentimentAnalysis,

        // Scores and metrics
        seoScore: contentOptimization.seoScore,
        readabilityScore: contentOptimization.readabilityScore,
        engagementPrediction: contentOptimization.engagementPrediction,

        // Recommendations
        recommendations: generateRecommendations(contentOptimization, seoAnalysis, sentimentAnalysis),

        metadata: {
          platform,
          goals,
          tone,
          originalLength: content.length,
          optimizedLength: contentOptimization.optimizedContent.length,
          processingTime: Date.now()
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

    console.error('AI optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize content' },
      { status: 500 }
    )
  }
}

function generateRecommendations(optimization: any, seoAnalysis: any, sentimentAnalysis: any): string[] {
  const recommendations: string[] = []

  // Content optimization recommendations
  if (optimization?.readabilityScore < 70) {
    recommendations.push('Consider simplifying language for better readability')
  }

  if (optimization?.engagementPrediction < 60) {
    recommendations.push('Add more engaging elements like questions or calls-to-action')
  }

  // SEO recommendations
  if (seoAnalysis?.overallScore < 70) {
    recommendations.push('Improve SEO by adding more relevant keywords and meta descriptions')
  }

  // Sentiment recommendations
  if (sentimentAnalysis?.sentiment === 'negative') {
    recommendations.push('Consider more positive framing to improve audience reception')
  }

  if (sentimentAnalysis?.confidence < 70) {
    recommendations.push('Content tone could be more consistent throughout')
  }

  // Add improvement suggestions from optimization
  if (optimization?.improvements?.length > 0) {
    const topImprovements = optimization.improvements
      .filter((imp: any) => imp.impact === 'high')
      .slice(0, 2)
      .map((imp: any) => imp.suggestion)
    recommendations.push(...topImprovements)
  }

  return recommendations.slice(0, 5)
}
