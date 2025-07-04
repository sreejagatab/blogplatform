import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { aiService } from '@/lib/ai-service'
import { z } from 'zod'

const trendsSchema = z.object({
  topics: z.array(z.string()).min(1).max(10),
  timeframe: z.enum(['24h', '7d', '30d', '90d']).default('30d'),
  includeKeywords: z.boolean().default(true),
  includePlatforms: z.boolean().default(true)
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
    const { topics, timeframe, includeKeywords, includePlatforms } = trendsSchema.parse(body)

    // Analyze trends for the provided topics
    const trendAnalyses = await aiService.analyzeTrends(topics)

    // Enhance with additional insights
    const enhancedAnalyses = trendAnalyses.map(analysis => ({
      ...analysis,
      insights: generateTrendInsights(analysis),
      recommendations: generateTrendRecommendations(analysis),
      competitorOpportunities: generateCompetitorOpportunities(analysis.topic)
    }))

    // Generate cross-topic insights
    const crossTopicInsights = generateCrossTopicInsights(enhancedAnalyses)

    return NextResponse.json({
      success: true,
      data: {
        trends: enhancedAnalyses,
        crossTopicInsights,
        summary: {
          totalTopics: topics.length,
          averageTrendScore: enhancedAnalyses.reduce((sum, t) => sum + t.trendScore, 0) / enhancedAnalyses.length,
          topTrendingTopic: enhancedAnalyses.reduce((max, t) => t.trendScore > max.trendScore ? t : max),
          timeframe,
          analyzedAt: new Date().toISOString()
        },
        metadata: {
          includeKeywords,
          includePlatforms,
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

    console.error('Trend analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze trends' },
      { status: 500 }
    )
  }
}

// GET endpoint for trending topics discovery
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
    const category = searchParams.get('category') || 'technology'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Generate trending topics for the category
    const trendingTopics = generateTrendingTopics(category, limit)

    return NextResponse.json({
      success: true,
      data: {
        trendingTopics,
        category,
        discoveredAt: new Date().toISOString(),
        totalCount: trendingTopics.length
      }
    })
  } catch (error) {
    console.error('Trending topics discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover trending topics' },
      { status: 500 }
    )
  }
}

function generateTrendInsights(analysis: any): string[] {
  const insights: string[] = []

  if (analysis.momentum === 'rising') {
    insights.push(`${analysis.topic} is gaining significant momentum with ${analysis.trendScore}% trend score`)
  }

  if (analysis.competitionLevel === 'low') {
    insights.push('Low competition presents an excellent opportunity for content creation')
  }

  if (analysis.searchVolume > 50000) {
    insights.push('High search volume indicates strong audience interest')
  }

  return insights
}

function generateTrendRecommendations(analysis: any): string[] {
  const recommendations: string[] = []

  if (analysis.momentum === 'rising') {
    recommendations.push('Create content quickly to capitalize on rising trend')
  }

  if (analysis.competitionLevel === 'low') {
    recommendations.push('Focus on comprehensive, authoritative content to establish dominance')
  }

  recommendations.push(`Best publishing times: ${analysis.bestPublishingTimes.join(', ')}`)
  recommendations.push(`Recommended platforms: ${analysis.suggestedPlatforms.join(', ')}`)

  return recommendations
}

function generateCompetitorOpportunities(topic: string): string[] {
  return [
    `Create more comprehensive ${topic} guides than competitors`,
    `Focus on practical, actionable ${topic} content`,
    `Develop ${topic} case studies and real-world examples`,
    `Build ${topic} community and engagement`
  ]
}

function generateCrossTopicInsights(analyses: any[]): any {
  const avgTrendScore = analyses.reduce((sum, a) => sum + a.trendScore, 0) / analyses.length
  const risingTopics = analyses.filter(a => a.momentum === 'rising')
  const lowCompetitionTopics = analyses.filter(a => a.competitionLevel === 'low')

  return {
    averageTrendScore: Math.round(avgTrendScore),
    risingTopicsCount: risingTopics.length,
    lowCompetitionOpportunities: lowCompetitionTopics.length,
    recommendedFocus: risingTopics.length > 0 ? risingTopics[0].topic : analyses[0].topic,
    contentStrategy: generateContentStrategy(analyses)
  }
}

function generateContentStrategy(analyses: any[]): string[] {
  const strategy: string[] = []

  const risingTopics = analyses.filter(a => a.momentum === 'rising')
  if (risingTopics.length > 0) {
    strategy.push('Prioritize rising trend topics for immediate content creation')
  }

  const lowCompetition = analyses.filter(a => a.competitionLevel === 'low')
  if (lowCompetition.length > 0) {
    strategy.push('Target low-competition topics for long-term SEO gains')
  }

  strategy.push('Create content series connecting related trending topics')
  strategy.push('Develop platform-specific content variations for maximum reach')

  return strategy
}

function generateTrendingTopics(category: string, limit: number): any[] {
  const topics = [
    'AI and Machine Learning',
    'Sustainable Technology',
    'Remote Work Tools',
    'Cybersecurity Trends',
    'Cloud Computing',
    'Data Privacy',
    'Blockchain Applications',
    'IoT Innovations',
    'Mobile Development',
    'Web3 Technologies',
    'Digital Transformation',
    'Automation Tools',
    'DevOps Practices',
    'API Development',
    'Microservices Architecture'
  ]

  return topics.slice(0, limit).map((topic, index) => ({
    id: `trending-${index + 1}`,
    topic,
    trendScore: Math.floor(Math.random() * 40) + 60,
    momentum: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)],
    searchVolume: Math.floor(Math.random() * 100000) + 10000,
    competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    category,
    estimatedOpportunity: Math.floor(Math.random() * 50) + 50
  }))
}
