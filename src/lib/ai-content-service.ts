import OpenAI from 'openai/index.mjs'

// AI Content Service
export class AIContentService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }

  /**
   * Optimize content for a specific platform
   */
  async optimizeForPlatform(content: string, platform: string, targetAudience?: string): Promise<{
    optimizedContent: string
    suggestions: string[]
    seoKeywords: string[]
    readabilityScore: number
  }> {
    try {
      const prompt = `
        Optimize the following content for ${platform}:
        
        Original Content:
        ${content}
        
        Target Audience: ${targetAudience || 'General audience'}
        
        Please provide:
        1. Optimized content that follows ${platform}'s best practices
        2. 3-5 improvement suggestions
        3. 5-10 SEO keywords
        4. A readability score (1-10, where 10 is most readable)
        
        Format your response as JSON:
        {
          "optimizedContent": "...",
          "suggestions": ["...", "..."],
          "seoKeywords": ["...", "..."],
          "readabilityScore": 8
        }
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content optimizer specializing in platform-specific content adaptation and SEO optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return result
    } catch (error) {
      console.error('AI optimization error:', error)
      return {
        optimizedContent: content,
        suggestions: ['AI optimization temporarily unavailable'],
        seoKeywords: [],
        readabilityScore: 7
      }
    }
  }

  /**
   * Generate content variations for A/B testing
   */
  async generateVariations(content: string, variationCount: number = 3): Promise<string[]> {
    try {
      const prompt = `
        Create ${variationCount} different variations of the following content for A/B testing.
        Each variation should maintain the core message but use different:
        - Headlines/titles
        - Writing style (formal, casual, conversational)
        - Call-to-action approaches
        - Content structure
        
        Original Content:
        ${content}
        
        Return as a JSON array of strings.
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a content marketing expert specializing in A/B testing and conversion optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })

      const variations = JSON.parse(response.choices[0].message.content || '[]')
      return variations
    } catch (error) {
      console.error('Variation generation error:', error)
      return [content]
    }
  }

  /**
   * Generate SEO-optimized meta descriptions
   */
  async generateMetaDescription(title: string, content: string): Promise<string> {
    try {
      const prompt = `
        Generate an SEO-optimized meta description for this content:
        
        Title: ${title}
        Content: ${content.substring(0, 500)}...
        
        Requirements:
        - 150-160 characters maximum
        - Include primary keywords
        - Compelling and click-worthy
        - Accurate content summary
        
        Return only the meta description text.
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in meta description optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 100
      })

      return response.choices[0].message.content?.trim() || ''
    } catch (error) {
      console.error('Meta description generation error:', error)
      return ''
    }
  }

  /**
   * Extract and suggest hashtags for social media platforms
   */
  async generateHashtags(content: string, platform: string, count: number = 10): Promise<string[]> {
    try {
      const prompt = `
        Generate ${count} relevant hashtags for this content on ${platform}:
        
        Content: ${content}
        
        Requirements:
        - Platform-appropriate hashtags
        - Mix of popular and niche hashtags
        - Relevant to content topic
        - Follow ${platform} hashtag best practices
        
        Return as a JSON array of hashtag strings (without # symbol).
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a social media marketing expert specializing in hashtag strategy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 300
      })

      const hashtags = JSON.parse(response.choices[0].message.content || '[]')
      return hashtags
    } catch (error) {
      console.error('Hashtag generation error:', error)
      return []
    }
  }

  /**
   * Analyze content sentiment and tone
   */
  async analyzeContent(content: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral'
    tone: string
    readabilityLevel: string
    wordCount: number
    estimatedReadTime: number
    keyTopics: string[]
  }> {
    try {
      const prompt = `
        Analyze the following content and provide insights:
        
        Content: ${content}
        
        Provide analysis in JSON format:
        {
          "sentiment": "positive|negative|neutral",
          "tone": "professional|casual|formal|conversational|etc",
          "readabilityLevel": "elementary|middle school|high school|college|graduate",
          "wordCount": number,
          "estimatedReadTime": number_in_minutes,
          "keyTopics": ["topic1", "topic2", "topic3"]
        }
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content analysis expert specializing in readability, sentiment, and topic extraction.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      return {
        sentiment: analysis.sentiment || 'neutral',
        tone: analysis.tone || 'professional',
        readabilityLevel: analysis.readabilityLevel || 'high school',
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
        keyTopics: analysis.keyTopics || []
      }
    } catch (error) {
      console.error('Content analysis error:', error)
      return {
        sentiment: 'neutral',
        tone: 'professional',
        readabilityLevel: 'high school',
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
        keyTopics: []
      }
    }
  }

  /**
   * Generate content ideas based on trending topics
   */
  async generateContentIdeas(topic: string, platform: string, count: number = 5): Promise<{
    title: string
    description: string
    targetKeywords: string[]
    estimatedEngagement: 'high' | 'medium' | 'low'
  }[]> {
    try {
      const prompt = `
        Generate ${count} content ideas for the topic "${topic}" optimized for ${platform}:
        
        For each idea, provide:
        - Compelling title
        - Brief description
        - 3-5 target keywords
        - Estimated engagement potential
        
        Format as JSON array:
        [{
          "title": "...",
          "description": "...",
          "targetKeywords": ["..."],
          "estimatedEngagement": "high|medium|low"
        }]
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a content strategist specializing in viral content creation and audience engagement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })

      const ideas = JSON.parse(response.choices[0].message.content || '[]')
      return ideas
    } catch (error) {
      console.error('Content ideas generation error:', error)
      return []
    }
  }
}

// Export singleton instance
export const aiContentService = new AIContentService()
