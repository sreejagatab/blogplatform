/**
 * Content Adaptation Engine
 * AI-powered content optimization for platform-specific formatting and distribution
 */

import { aiService } from './ai-service'
import { BlogPost, AdaptedContent, PlatformCapabilities } from './platforms/types'

export interface ContentAdaptationRequest {
  originalContent: BlogPost
  targetPlatforms: string[]
  optimizationGoals?: ('engagement' | 'reach' | 'conversion' | 'seo')[]
  preserveOriginalTone?: boolean
  includeCallToAction?: boolean
  customInstructions?: string
}

export interface AdaptationResult {
  platform: string
  adaptedContent: AdaptedContent
  adaptationScore: number
  optimizations: Array<{
    type: string
    description: string
    impact: 'high' | 'medium' | 'low'
  }>
  warnings?: string[]
}

export interface ContentAdaptationResponse {
  originalContent: BlogPost
  adaptations: AdaptationResult[]
  summary: {
    totalPlatforms: number
    averageAdaptationScore: number
    recommendedPublishingOrder: string[]
    estimatedReach: number
  }
  processingTime: number
}

class ContentAdaptationEngine {
  private platformCapabilities: Record<string, PlatformCapabilities> = {
    twitter: {
      maxContentLength: 280,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov'],
      maxImageSize: 5 * 1024 * 1024,
      maxVideoSize: 512 * 1024 * 1024,
      maxImagesPerPost: 4,
      maxVideosPerPost: 1
    },
    linkedin: {
      maxContentLength: 3000,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif'],
      videoFormats: ['mp4', 'mov', 'avi'],
      maxImageSize: 5 * 1024 * 1024,
      maxVideoSize: 200 * 1024 * 1024,
      maxImagesPerPost: 1,
      maxVideosPerPost: 1
    },
    medium: {
      maxContentLength: 100000,
      supportsImages: true,
      supportsVideo: false,
      supportsHashtags: true,
      supportsMentions: false,
      supportsScheduling: true,
      supportsMarkdown: true,
      supportsHTMLTags: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote'],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif'],
      videoFormats: [],
      maxImageSize: 25 * 1024 * 1024,
      maxVideoSize: 0,
      maxImagesPerPost: 20,
      maxVideosPerPost: 0
    },
    facebook: {
      maxContentLength: 63206,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif'],
      videoFormats: ['mp4', 'mov', 'avi'],
      maxImageSize: 4 * 1024 * 1024,
      maxVideoSize: 1024 * 1024 * 1024,
      maxImagesPerPost: 10,
      maxVideosPerPost: 1
    },
    instagram: {
      maxContentLength: 2200,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png'],
      videoFormats: ['mp4', 'mov'],
      maxImageSize: 8 * 1024 * 1024,
      maxVideoSize: 100 * 1024 * 1024,
      maxImagesPerPost: 10,
      maxVideosPerPost: 1
    }
  }

  /**
   * Adapt content for multiple platforms simultaneously
   */
  async adaptContentForPlatforms(request: ContentAdaptationRequest): Promise<ContentAdaptationResponse> {
    const startTime = Date.now()
    const adaptations: AdaptationResult[] = []

    for (const platform of request.targetPlatforms) {
      try {
        const adaptation = await this.adaptContentForSinglePlatform(
          request.originalContent,
          platform,
          request
        )
        adaptations.push(adaptation)
      } catch (error) {
        console.error(`Failed to adapt content for ${platform}:`, error)
        adaptations.push({
          platform,
          adaptedContent: this.createFallbackContent(request.originalContent, platform),
          adaptationScore: 0,
          optimizations: [],
          warnings: [`Failed to adapt content: ${error instanceof Error ? error.message : 'Unknown error'}`]
        })
      }
    }

    const processingTime = Date.now() - startTime

    return {
      originalContent: request.originalContent,
      adaptations,
      summary: this.generateAdaptationSummary(adaptations),
      processingTime
    }
  }

  /**
   * Adapt content for a single platform
   */
  private async adaptContentForSinglePlatform(
    originalContent: BlogPost,
    platform: string,
    request: ContentAdaptationRequest
  ): Promise<AdaptationResult> {
    const capabilities = this.platformCapabilities[platform]
    if (!capabilities) {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    // Use AI service to optimize content for the platform
    const optimizationRequest = {
      content: originalContent.content,
      platform,
      targetKeywords: originalContent.tags,
      maxLength: capabilities.maxContentLength,
      includeHashtags: capabilities.supportsHashtags,
      includeCTA: request.includeCallToAction ?? true
    }

    const aiOptimization = await aiService.optimizeContent(optimizationRequest)

    // Generate platform-specific hashtags
    let hashtags: string[] = []
    if (capabilities.supportsHashtags) {
      hashtags = await aiService.generateHashtags(aiOptimization.optimizedContent, platform)
    }

    // Create adapted content
    const adaptedContent: AdaptedContent = {
      title: this.adaptTitle(originalContent.title, platform, capabilities),
      content: aiOptimization.optimizedContent,
      excerpt: this.generateExcerpt(aiOptimization.optimizedContent, platform),
      hashtags,
      images: this.adaptImages(originalContent.featuredImage, platform, capabilities),
      metadata: {
        originalUrl: originalContent.canonicalUrl,
        platform,
        adaptedAt: new Date().toISOString(),
        aiOptimized: true
      }
    }

    // Calculate adaptation score
    const adaptationScore = this.calculateAdaptationScore(
      originalContent,
      adaptedContent,
      capabilities,
      aiOptimization
    )

    // Generate optimization insights
    const optimizations = this.generateOptimizationInsights(
      originalContent,
      adaptedContent,
      platform,
      aiOptimization
    )

    return {
      platform,
      adaptedContent,
      adaptationScore,
      optimizations
    }
  }

  private adaptTitle(title: string, platform: string, capabilities: PlatformCapabilities): string {
    const platformTitleLimits = {
      twitter: 100, // Leave room for content
      linkedin: 150,
      medium: 100,
      facebook: 255,
      instagram: 125
    }

    const maxLength = platformTitleLimits[platform as keyof typeof platformTitleLimits] || 100

    if (title.length <= maxLength) {
      return title
    }

    // Truncate intelligently at word boundaries
    const truncated = title.substring(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...'
    }
    
    return truncated + '...'
  }

  private generateExcerpt(content: string, platform: string): string {
    const excerptLengths = {
      twitter: 100,
      linkedin: 200,
      medium: 300,
      facebook: 200,
      instagram: 150
    }

    const maxLength = excerptLengths[platform as keyof typeof excerptLengths] || 200
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    
    if (plainText.length <= maxLength) {
      return plainText
    }

    const truncated = plainText.substring(0, maxLength - 3)
    const lastSentence = truncated.lastIndexOf('.')
    const lastSpace = truncated.lastIndexOf(' ')
    
    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1)
    }
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...'
    }
    
    return truncated + '...'
  }

  private adaptImages(featuredImage: string | undefined, platform: string, capabilities: PlatformCapabilities): string[] {
    if (!featuredImage || !capabilities.supportsImages) {
      return []
    }

    // For now, return the featured image
    // In a full implementation, this would resize/optimize images for each platform
    return [featuredImage].slice(0, capabilities.maxImagesPerPost)
  }

  private calculateAdaptationScore(
    original: BlogPost,
    adapted: AdaptedContent,
    capabilities: PlatformCapabilities,
    aiOptimization: any
  ): number {
    let score = 50 // Base score

    // Content length optimization
    const lengthRatio = adapted.content.length / capabilities.maxContentLength
    if (lengthRatio <= 0.8) {
      score += 20
    } else if (lengthRatio <= 1.0) {
      score += 10
    }

    // Hashtag optimization
    if (capabilities.supportsHashtags && adapted.hashtags && adapted.hashtags.length > 0) {
      score += 15
    }

    // AI optimization score
    if (aiOptimization.seoScore) {
      score += Math.min(aiOptimization.seoScore / 5, 15)
    }

    return Math.min(Math.round(score), 100)
  }

  private generateOptimizationInsights(
    original: BlogPost,
    adapted: AdaptedContent,
    platform: string,
    aiOptimization: any
  ): Array<{ type: string; description: string; impact: 'high' | 'medium' | 'low' }> {
    const insights = []

    // Content length insight
    const originalLength = original.content.length
    const adaptedLength = adapted.content.length
    
    if (adaptedLength < originalLength * 0.5) {
      insights.push({
        type: 'content_compression',
        description: `Content compressed by ${Math.round((1 - adaptedLength / originalLength) * 100)}% for ${platform}`,
        impact: 'high' as const
      })
    }

    // Hashtag insights
    if (adapted.hashtags && adapted.hashtags.length > 0) {
      insights.push({
        type: 'hashtag_optimization',
        description: `Added ${adapted.hashtags.length} platform-optimized hashtags`,
        impact: 'medium' as const
      })
    }

    // AI optimization insights
    if (aiOptimization.improvements) {
      aiOptimization.improvements.forEach((improvement: any) => {
        insights.push({
          type: 'ai_optimization',
          description: improvement.suggestion,
          impact: improvement.impact
        })
      })
    }

    return insights
  }

  private createFallbackContent(original: BlogPost, platform: string): AdaptedContent {
    const capabilities = this.platformCapabilities[platform] || this.platformCapabilities.medium

    return {
      title: this.adaptTitle(original.title, platform, capabilities),
      content: this.generateExcerpt(original.content, platform),
      excerpt: original.excerpt || this.generateExcerpt(original.content, platform),
      hashtags: original.tags.slice(0, 5),
      images: original.featuredImage ? [original.featuredImage] : [],
      metadata: {
        originalUrl: original.canonicalUrl,
        platform,
        adaptedAt: new Date().toISOString(),
        fallback: true
      }
    }
  }

  private generateAdaptationSummary(adaptations: AdaptationResult[]) {
    const totalPlatforms = adaptations.length
    const averageAdaptationScore = adaptations.reduce((sum, a) => sum + a.adaptationScore, 0) / totalPlatforms
    
    // Sort by adaptation score for recommended publishing order
    const recommendedPublishingOrder = adaptations
      .sort((a, b) => b.adaptationScore - a.adaptationScore)
      .map(a => a.platform)

    // Estimate reach based on platform and adaptation quality
    const platformReachEstimates = {
      twitter: 1000,
      linkedin: 500,
      medium: 2000,
      facebook: 800,
      instagram: 1200
    }

    const estimatedReach = adaptations.reduce((total, adaptation) => {
      const baseReach = platformReachEstimates[adaptation.platform as keyof typeof platformReachEstimates] || 500
      const scoreMultiplier = adaptation.adaptationScore / 100
      return total + (baseReach * scoreMultiplier)
    }, 0)

    return {
      totalPlatforms,
      averageAdaptationScore: Math.round(averageAdaptationScore),
      recommendedPublishingOrder,
      estimatedReach: Math.round(estimatedReach)
    }
  }
}

// Export singleton instance
export const contentAdaptationEngine = new ContentAdaptationEngine()

// Export utility functions
export const adaptContentForPlatform = async (content: BlogPost, platform: string) => {
  return await contentAdaptationEngine.adaptContentForPlatforms({
    originalContent: content,
    targetPlatforms: [platform]
  })
}

export const adaptContentForMultiplePlatforms = async (content: BlogPost, platforms: string[]) => {
  return await contentAdaptationEngine.adaptContentForPlatforms({
    originalContent: content,
    targetPlatforms: platforms
  })
}
