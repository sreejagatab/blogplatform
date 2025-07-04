import { getAIContentManager } from './ai-content-manager'
import { AIServiceError } from './types'

export interface HashtagGenerationRequest {
  content: string
  title?: string
  platform: string
  targetAudience?: string
  industry?: string
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational'
  maxHashtags?: number
  includeNiche?: boolean
  includeTrending?: boolean
}

export interface HashtagGenerationResult {
  hashtags: string[]
  trending: string[]
  niche: string[]
  branded: string[]
  confidence: number
  explanation: string
  platformOptimized: boolean
}

export interface TrendingHashtag {
  tag: string
  volume: number
  trend: 'rising' | 'stable' | 'declining'
  category: string
}

export class AIHashtagGenerator {
  private aiManager = getAIContentManager()

  async generateHashtags(request: HashtagGenerationRequest): Promise<HashtagGenerationResult> {
    try {
      const prompt = this.buildHashtagPrompt(request)
      
      // Use AI to generate hashtags
      const response = await this.aiManager.getWritingAssistance({
        content: request.content,
        assistanceType: 'hashtag_generation',
        context: prompt,
        targetAudience: request.targetAudience,
        tone: request.tone || 'professional'
      })

      // Parse and structure the response
      return this.parseHashtagResponse(response, request)
    } catch (error) {
      console.error('Hashtag generation error:', error)
      throw new AIServiceError(
        'Failed to generate hashtags',
        'openai',
        'HASHTAG_GENERATION_FAILED'
      )
    }
  }

  async getTrendingHashtags(
    platform: string, 
    category?: string, 
    limit: number = 20
  ): Promise<TrendingHashtag[]> {
    try {
      // In a real implementation, this would connect to platform APIs
      // For now, we'll use AI to suggest trending hashtags
      const prompt = `Generate ${limit} trending hashtags for ${platform}${category ? ` in the ${category} category` : ''}. 
      
      Consider current trends, popular topics, and platform-specific hashtag patterns.
      
      Return as JSON array:
      [
        {
          "tag": "#hashtag",
          "volume": number (estimated weekly usage),
          "trend": "rising|stable|declining",
          "category": "category name"
        }
      ]`

      const trendAnalysis = await this.aiManager.analyzeTrends(category, [platform])
      
      // Combine AI insights with platform-specific knowledge
      return this.generateTrendingHashtags(platform, category, limit, trendAnalysis)
    } catch (error) {
      console.error('Trending hashtags error:', error)
      return []
    }
  }

  async optimizeHashtagsForPlatform(
    hashtags: string[], 
    platform: string,
    content?: string
  ): Promise<string[]> {
    const platformRules = this.getPlatformHashtagRules(platform)
    let optimized = [...hashtags]

    // Apply platform-specific optimizations
    optimized = optimized.map(tag => {
      // Ensure hashtag format
      if (!tag.startsWith('#')) {
        tag = '#' + tag
      }

      // Remove spaces and special characters
      tag = tag.replace(/[^a-zA-Z0-9#_]/g, '')

      // Apply platform-specific rules
      if (platformRules.maxLength && tag.length > platformRules.maxLength) {
        tag = tag.substring(0, platformRules.maxLength)
      }

      if (platformRules.caseStyle === 'lowercase') {
        tag = tag.toLowerCase()
      } else if (platformRules.caseStyle === 'camelcase') {
        tag = this.toCamelCase(tag)
      }

      return tag
    })

    // Filter out invalid hashtags
    optimized = optimized.filter(tag => 
      tag.length >= (platformRules.minLength || 2) &&
      tag.length <= (platformRules.maxLength || 100) &&
      !platformRules.bannedWords?.some(word => tag.toLowerCase().includes(word.toLowerCase()))
    )

    // Limit to platform maximum
    if (platformRules.maxCount && optimized.length > platformRules.maxCount) {
      optimized = optimized.slice(0, platformRules.maxCount)
    }

    return optimized
  }

  private buildHashtagPrompt(request: HashtagGenerationRequest): string {
    return `Generate relevant hashtags for ${request.platform} based on this content:

Title: ${request.title || 'N/A'}
Content: ${request.content.substring(0, 1000)}

Requirements:
- Platform: ${request.platform}
- Target audience: ${request.targetAudience || 'general'}
- Industry: ${request.industry || 'general'}
- Tone: ${request.tone || 'professional'}
- Max hashtags: ${request.maxHashtags || 10}
- Include niche hashtags: ${request.includeNiche ? 'yes' : 'no'}
- Include trending hashtags: ${request.includeTrending ? 'yes' : 'no'}

Generate hashtags that are:
1. Relevant to the content
2. Optimized for ${request.platform}
3. Mix of popular and niche tags
4. Appropriate for the target audience
5. Following platform best practices

Return as JSON:
{
  "hashtags": ["#tag1", "#tag2", ...],
  "trending": ["#trending1", "#trending2", ...],
  "niche": ["#niche1", "#niche2", ...],
  "branded": ["#brand1", "#brand2", ...],
  "confidence": 0.95,
  "explanation": "Brief explanation of hashtag strategy",
  "platformOptimized": true
}`
  }

  private parseHashtagResponse(response: any, request: HashtagGenerationRequest): HashtagGenerationResult {
    try {
      // Try to parse AI response
      const parsed = typeof response === 'string' ? JSON.parse(response) : response
      
      return {
        hashtags: parsed.hashtags || [],
        trending: parsed.trending || [],
        niche: parsed.niche || [],
        branded: parsed.branded || [],
        confidence: parsed.confidence || 0.8,
        explanation: parsed.explanation || 'AI-generated hashtags based on content analysis',
        platformOptimized: parsed.platformOptimized || true
      }
    } catch (error) {
      // Fallback to basic hashtag extraction
      return this.generateFallbackHashtags(request)
    }
  }

  private generateFallbackHashtags(request: HashtagGenerationRequest): HashtagGenerationResult {
    const words = request.content.toLowerCase().match(/\b\w+\b/g) || []
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'])
    
    const keywords = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, request.maxHashtags || 10)
      .map(word => `#${word}`)

    return {
      hashtags: keywords,
      trending: [],
      niche: [],
      branded: [],
      confidence: 0.6,
      explanation: 'Fallback hashtags generated from content keywords',
      platformOptimized: false
    }
  }

  private generateTrendingHashtags(
    platform: string, 
    category?: string, 
    limit: number = 20,
    trendAnalysis?: any
  ): TrendingHashtag[] {
    // Platform-specific trending hashtags (mock data - in production, use real APIs)
    const trendingByPlatform: Record<string, TrendingHashtag[]> = {
      twitter: [
        { tag: '#trending', volume: 50000, trend: 'rising', category: 'general' },
        { tag: '#viral', volume: 30000, trend: 'stable', category: 'general' },
        { tag: '#tech', volume: 25000, trend: 'rising', category: 'technology' }
      ],
      instagram: [
        { tag: '#instagood', volume: 100000, trend: 'stable', category: 'general' },
        { tag: '#photooftheday', volume: 80000, trend: 'stable', category: 'photography' },
        { tag: '#reels', volume: 60000, trend: 'rising', category: 'video' }
      ],
      linkedin: [
        { tag: '#professional', volume: 15000, trend: 'stable', category: 'business' },
        { tag: '#leadership', volume: 12000, trend: 'rising', category: 'business' },
        { tag: '#innovation', volume: 10000, trend: 'rising', category: 'technology' }
      ]
    }

    const platformTrending = trendingByPlatform[platform.toLowerCase()] || []
    
    return platformTrending
      .filter(tag => !category || tag.category === category)
      .slice(0, limit)
  }

  private getPlatformHashtagRules(platform: string) {
    const rules: Record<string, any> = {
      twitter: {
        maxCount: 2,
        maxLength: 100,
        minLength: 2,
        caseStyle: 'camelcase',
        bannedWords: []
      },
      instagram: {
        maxCount: 30,
        maxLength: 100,
        minLength: 2,
        caseStyle: 'lowercase',
        bannedWords: []
      },
      linkedin: {
        maxCount: 5,
        maxLength: 100,
        minLength: 2,
        caseStyle: 'camelcase',
        bannedWords: []
      },
      facebook: {
        maxCount: 10,
        maxLength: 100,
        minLength: 2,
        caseStyle: 'lowercase',
        bannedWords: []
      },
      tiktok: {
        maxCount: 20,
        maxLength: 100,
        minLength: 2,
        caseStyle: 'lowercase',
        bannedWords: []
      }
    }

    return rules[platform.toLowerCase()] || rules.twitter
  }

  private toCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
  }
}

// Export singleton instance
export const aiHashtagGenerator = new AIHashtagGenerator()
