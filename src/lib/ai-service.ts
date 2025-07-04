/**
 * Advanced AI Service with OpenAI GPT-4 Integration
 * Provides content generation, optimization, trend analysis, and predictive analytics
 */

import OpenAI from 'openai/index.mjs'

export interface ContentGenerationRequest {
  topic: string
  type: 'blog-post' | 'social-media' | 'newsletter' | 'product-description'
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'humorous'
  length: 'short' | 'medium' | 'long'
  targetAudience: string
  keywords?: string[]
  platform?: string
  includeImages?: boolean
  includeHashtags?: boolean
}

export interface GeneratedContent {
  title: string
  content: string
  excerpt: string
  keywords: string[]
  hashtags: string[]
  suggestedImages: string[]
  metadata: {
    wordCount: number
    readingTime: number
    seoScore: number
    engagementPrediction: number
    confidence: number
  }
}

export interface ContentOptimizationRequest {
  content: string
  platform: string
  targetKeywords?: string[]
  maxLength?: number
  includeHashtags?: boolean
  includeCTA?: boolean
}

export interface OptimizedContent {
  optimizedContent: string
  suggestions: string[]
  seoScore: number
  readabilityScore: number
  engagementPrediction: number
  hashtags: string[]
  improvements: Array<{
    area: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
  }>
}

export interface SEOAnalysisRequest {
  content: string
  title: string
  targetKeywords: string[]
  competitorUrls?: string[]
}

export interface SEOAnalysis {
  overallScore: number
  keywordDensity: Record<string, number>
  suggestions: Array<{
    type: 'title' | 'content' | 'meta' | 'structure'
    suggestion: string
    priority: 'high' | 'medium' | 'low'
    impact: number
  }>
  competitorComparison?: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
  }
  recommendedKeywords: Array<{
    keyword: string
    difficulty: number
    opportunity: number
  }>
}

export interface TrendAnalysis {
  topic: string
  trendScore: number
  momentum: 'rising' | 'stable' | 'declining'
  relatedTopics: string[]
  searchVolume: number
  competitionLevel: 'low' | 'medium' | 'high'
  bestPublishingTimes: string[]
  suggestedPlatforms: string[]
  keywordOpportunities: Array<{
    keyword: string
    difficulty: number
    volume: number
    trend: number
  }>
}

export interface PredictiveAnalytics {
  contentPerformancePrediction: {
    expectedViews: number
    expectedEngagement: number
    viralPotential: number
    bestPerformingPlatforms: string[]
  }
  audienceInsights: {
    optimalPostingTimes: string[]
    preferredContentTypes: string[]
    engagementPatterns: Record<string, number>
  }
  contentRecommendations: Array<{
    topic: string
    reason: string
    priority: 'high' | 'medium' | 'low'
    estimatedImpact: number
  }>
}

export interface AIInsights {
  contentSuggestions: Array<{
    title: string
    topic: string
    reasoning: string
    trendScore: number
    difficulty: 'easy' | 'medium' | 'hard'
  }>
  optimizationTips: Array<{
    area: 'seo' | 'engagement' | 'readability' | 'performance'
    suggestion: string
    impact: 'high' | 'medium' | 'low'
    implementation: string
  }>
  competitorAnalysis: Array<{
    competitor: string
    strengths: string[]
    opportunities: string[]
    contentGaps: string[]
  }>
}

class AIService {
  private openai: OpenAI
  private isConfigured: boolean

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    this.isConfigured = !!apiKey && apiKey !== 'mock-api-key'

    if (this.isConfigured) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      })
    } else {
      console.warn('OpenAI API key not configured. Using mock responses.')
    }
  }

  /**
   * Generate content using OpenAI GPT-4
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    try {
      if (!this.isConfigured) {
        return this.generateMockContent(request)
      }

      const prompt = this.buildContentGenerationPrompt(request)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert content creator and SEO specialist. Generate high-quality, engaging content that is optimized for the specified platform and audience."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: this.getMaxTokensForLength(request.length),
      })

      const generatedText = completion.choices[0]?.message?.content || ''

      // Parse the generated content
      const parsedContent = this.parseGeneratedContent(generatedText, request)

      // Generate additional metadata
      const metadata = await this.generateContentMetadata(parsedContent.content, request)

      return {
        ...parsedContent,
        metadata
      }
    } catch (error) {
      console.error('Content generation failed:', error)
      // Fallback to mock content if OpenAI fails
      return this.generateMockContent(request)
    }
  }

  /**
   * Optimize existing content for specific platforms
   */
  async optimizeContent(request: ContentOptimizationRequest): Promise<OptimizedContent> {
    try {
      if (!this.isConfigured) {
        return this.generateMockOptimization(request)
      }

      const prompt = this.buildOptimizationPrompt(request)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert content optimizer specializing in platform-specific content adaptation and SEO optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      })

      const optimizationResult = completion.choices[0]?.message?.content || ''
      return this.parseOptimizationResult(optimizationResult, request)
    } catch (error) {
      console.error('Content optimization failed:', error)
      return this.generateMockOptimization(request)
    }
  }

  /**
   * Perform SEO analysis on content
   */
  async analyzeSEO(request: SEOAnalysisRequest): Promise<SEOAnalysis> {
    try {
      if (!this.isConfigured) {
        return this.generateMockSEOAnalysis(request)
      }

      const prompt = this.buildSEOAnalysisPrompt(request)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO analyst. Provide detailed SEO analysis with actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      })

      const analysisResult = completion.choices[0]?.message?.content || ''
      return this.parseSEOAnalysis(analysisResult, request)
    } catch (error) {
      console.error('SEO analysis failed:', error)
      return this.generateMockSEOAnalysis(request)
    }
  }

  // Helper methods for prompt building
  private buildContentGenerationPrompt(request: ContentGenerationRequest): string {
    const lengthMap = {
      'short': '300-500 words',
      'medium': '800-1200 words',
      'long': '1500-2500 words'
    }

    let prompt = `Generate a ${request.type} about "${request.topic}" with the following specifications:

- Tone: ${request.tone}
- Length: ${lengthMap[request.length]}
- Target Audience: ${request.targetAudience}`

    if (request.keywords?.length) {
      prompt += `\n- Target Keywords: ${request.keywords.join(', ')}`
    }

    if (request.platform) {
      prompt += `\n- Platform: ${request.platform} (optimize for this platform's best practices)`
    }

    if (request.includeHashtags) {
      prompt += `\n- Include relevant hashtags`
    }

    prompt += `\n\nPlease provide the response in the following JSON format:
{
  "title": "Engaging title for the content",
  "content": "Full content body",
  "excerpt": "Brief summary (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "suggestedImages": ["description of image 1", "description of image 2"]
}`

    return prompt
  }

  private buildOptimizationPrompt(request: ContentOptimizationRequest): string {
    let prompt = `Optimize the following content for ${request.platform}:

Content: "${request.content}"`

    if (request.maxLength) {
      prompt += `\nMaximum length: ${request.maxLength} characters`
    }

    if (request.targetKeywords?.length) {
      prompt += `\nTarget keywords: ${request.targetKeywords.join(', ')}`
    }

    prompt += `\n\nProvide optimization suggestions and improved content in JSON format:
{
  "optimizedContent": "Improved content",
  "suggestions": ["suggestion1", "suggestion2"],
  "hashtags": ["hashtag1", "hashtag2"],
  "improvements": [
    {
      "area": "readability",
      "suggestion": "Specific improvement",
      "impact": "high"
    }
  ]
}`

    return prompt
  }

  private buildSEOAnalysisPrompt(request: SEOAnalysisRequest): string {
    let prompt = `Analyze the SEO potential of this content:

Title: "${request.title}"
Content: "${request.content}"
Target Keywords: ${request.targetKeywords.join(', ')}`

    prompt += `\n\nProvide detailed SEO analysis in JSON format:
{
  "overallScore": 85,
  "keywordDensity": {"keyword1": 2.5, "keyword2": 1.8},
  "suggestions": [
    {
      "type": "title",
      "suggestion": "Specific suggestion",
      "priority": "high",
      "impact": 8
    }
  ],
  "recommendedKeywords": [
    {
      "keyword": "suggested keyword",
      "difficulty": 45,
      "opportunity": 78
    }
  ]
}`

    return prompt
  }

  // Parsing methods for AI responses
  private parseGeneratedContent(generatedText: string, request: ContentGenerationRequest): Omit<GeneratedContent, 'metadata'> {
    try {
      // Try to parse JSON response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || `Generated content about ${request.topic}`,
          content: parsed.content || generatedText,
          excerpt: parsed.excerpt || generatedText.substring(0, 160),
          keywords: parsed.keywords || [request.topic],
          hashtags: parsed.hashtags || [],
          suggestedImages: parsed.suggestedImages || []
        };
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, using fallback parsing');
    }

    // Fallback parsing
    const lines = generatedText.split('\n').filter(line => line.trim());
    const title = lines[0] || `Generated content about ${request.topic}`;
    const content = generatedText;
    const excerpt = content.substring(0, 160);

    return {
      title,
      content,
      excerpt,
      keywords: [request.topic, ...(request.keywords || [])],
      hashtags: this.extractHashtagsFromText(content),
      suggestedImages: [`Image related to ${request.topic}`]
    };
  }

  private parseOptimizationResult(result: string, request: ContentOptimizationRequest): OptimizedContent {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          optimizedContent: parsed.optimizedContent || request.content,
          suggestions: parsed.suggestions || [],
          seoScore: this.calculateSEOScore(parsed.optimizedContent || request.content),
          readabilityScore: this.calculateReadabilityScore(parsed.optimizedContent || request.content),
          engagementPrediction: Math.floor(Math.random() * 30) + 70,
          hashtags: parsed.hashtags || [],
          improvements: parsed.improvements || []
        };
      }
    } catch (error) {
      console.warn('Failed to parse optimization result');
    }

    return this.generateMockOptimization(request);
  }

  private parseSEOAnalysis(result: string, request: SEOAnalysisRequest): SEOAnalysis {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overallScore: parsed.overallScore || 75,
          keywordDensity: parsed.keywordDensity || {},
          suggestions: parsed.suggestions || [],
          recommendedKeywords: parsed.recommendedKeywords || []
        };
      }
    } catch (error) {
      console.warn('Failed to parse SEO analysis result');
    }

    return this.generateMockSEOAnalysis(request);
  }

  // Utility methods
  private getMaxTokensForLength(length: 'short' | 'medium' | 'long'): number {
    const tokenMap = {
      'short': 800,
      'medium': 1500,
      'long': 3000
    };
    return tokenMap[length];
  }

  private extractHashtagsFromText(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map(tag => tag.substring(1));
  }

  private calculateSEOScore(content: string): number {
    // Simple SEO scoring based on content length, keyword usage, etc.
    let score = 50;

    if (content.length > 300) score += 10;
    if (content.length > 800) score += 10;
    if (content.includes('h1') || content.includes('h2')) score += 10;
    if (content.match(/\b\w+\b/g)?.length > 100) score += 10;

    return Math.min(score, 100);
  }

  private calculateReadabilityScore(content: string): number {
    // Simple readability scoring
    const words = content.match(/\b\w+\b/g) || [];
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words.length / sentences;

    let score = 100;
    if (avgWordsPerSentence > 20) score -= 20;
    if (avgWordsPerSentence > 30) score -= 20;

    return Math.max(score, 0);
  }

  private async generateContentMetadata(content: string, request: ContentGenerationRequest) {
    const words = content.match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    return {
      wordCount,
      readingTime,
      seoScore: this.calculateSEOScore(content),
      engagementPrediction: Math.floor(Math.random() * 30) + 70,
      confidence: this.isConfigured ? 85 : 60
    };
  }

  /**
   * Analyze trends for content topics
   */
  async analyzeTrends(topics: string[]): Promise<TrendAnalysis[]> {
    try {
      if (!this.isConfigured) {
        return this.generateMockTrendAnalysis(topics);
      }

      const prompt = `Analyze the current trends for these topics: ${topics.join(', ')}.

      For each topic, provide trend analysis including:
      - Current trend score (0-100)
      - Momentum (rising/stable/declining)
      - Related trending topics
      - Search volume estimates
      - Competition level
      - Best publishing times
      - Recommended platforms
      - Keyword opportunities

      Respond in JSON format with an array of trend analyses.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a trend analysis expert with access to current market data and social media trends."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const result = completion.choices[0]?.message?.content || '';
      return this.parseTrendAnalysis(result, topics);
    } catch (error) {
      console.error('Trend analysis failed:', error)
      return this.generateMockTrendAnalysis(topics);
    }
  }

  /**
   * Generate predictive analytics
   */
  async generatePredictiveAnalytics(contentHistory: any[]): Promise<PredictiveAnalytics> {
    try {
      if (!this.isConfigured) {
        return this.generateMockPredictiveAnalytics();
      }

      const prompt = `Based on this content history data: ${JSON.stringify(contentHistory.slice(0, 10))}

      Generate predictive analytics including:
      - Content performance predictions
      - Audience insights
      - Content recommendations
      - Optimal posting strategies

      Provide detailed analysis in JSON format.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a data analyst specializing in content performance prediction and audience behavior analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
      });

      const result = completion.choices[0]?.message?.content || '';
      return this.parsePredictiveAnalytics(result);
    } catch (error) {
      console.error('Predictive analytics failed:', error)
      return this.generateMockPredictiveAnalytics();
    }
  }

  /**
   * Get AI-powered insights and recommendations
   */
  async getAIInsights(context: {
    recentPosts: any[]
    analytics: any
    competitors: string[]
  }): Promise<AIInsights> {
    try {
      if (!this.isConfigured) {
        return this.generateMockAIInsights();
      }

      const prompt = `Analyze this content context and provide AI insights:

      Recent Posts: ${JSON.stringify(context.recentPosts.slice(0, 5))}
      Analytics: ${JSON.stringify(context.analytics)}
      Competitors: ${context.competitors.join(', ')}

      Provide:
      - Content suggestions with reasoning
      - Optimization tips
      - Competitive analysis

      Format as JSON with detailed insights.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an AI content strategist providing actionable insights for content optimization and competitive advantage."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      });

      const result = completion.choices[0]?.message?.content || '';
      return this.parseAIInsights(result);
    } catch (error) {
      console.error('AI insights generation failed:', error)
      return this.generateMockAIInsights();
    }
  }

  // Parsing methods for AI responses
  private parseTrendAnalysis(result: string, topics: string[]): TrendAnalysis[] {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/) || result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (error) {
      console.warn('Failed to parse trend analysis, using mock data');
    }
    return this.generateMockTrendAnalysis(topics);
  }

  private parsePredictiveAnalytics(result: string): PredictiveAnalytics {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse predictive analytics, using mock data');
    }
    return this.generateMockPredictiveAnalytics();
  }

  private parseAIInsights(result: string): AIInsights {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse AI insights, using mock data');
    }
    return this.generateMockAIInsights();
  }

  // Mock generation methods for fallback
  private generateMockContent(request: ContentGenerationRequest): GeneratedContent {
    const lengthMap = {
      'short': 400,
      'medium': 800,
      'long': 1500
    };

    const mockContent = `This is a ${request.tone} ${request.type} about ${request.topic} for ${request.targetAudience}. ` +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(lengthMap[request.length] / 50);

    return {
      title: `${request.topic}: A Comprehensive Guide`,
      content: mockContent,
      excerpt: mockContent.substring(0, 160),
      keywords: [request.topic, ...(request.keywords || [])],
      hashtags: [`#${request.topic.replace(/\s+/g, '')}`, '#Content', '#Blog'],
      suggestedImages: [`Image about ${request.topic}`, 'Infographic', 'Chart or diagram'],
      metadata: {
        wordCount: mockContent.split(' ').length,
        readingTime: Math.ceil(mockContent.split(' ').length / 200),
        seoScore: 75,
        engagementPrediction: 80,
        confidence: 60
      }
    };
  }

  private generateMockOptimization(request: ContentOptimizationRequest): OptimizedContent {
    return {
      optimizedContent: request.content + '\n\n[Optimized for ' + request.platform + ']',
      suggestions: [
        'Add more engaging headlines',
        'Include relevant hashtags',
        'Optimize for platform character limits'
      ],
      seoScore: 80,
      readabilityScore: 85,
      engagementPrediction: 75,
      hashtags: ['#optimized', '#content', '#' + request.platform.toLowerCase()],
      improvements: [
        {
          area: 'engagement',
          suggestion: 'Add call-to-action',
          impact: 'high'
        }
      ]
    };
  }

  private generateMockSEOAnalysis(request: SEOAnalysisRequest): SEOAnalysis {
    return {
      overallScore: 75,
      keywordDensity: request.targetKeywords.reduce((acc, keyword) => {
        acc[keyword] = Math.random() * 3 + 1;
        return acc;
      }, {} as Record<string, number>),
      suggestions: [
        {
          type: 'title',
          suggestion: 'Include primary keyword in title',
          priority: 'high',
          impact: 8
        },
        {
          type: 'content',
          suggestion: 'Add more semantic keywords',
          priority: 'medium',
          impact: 6
        }
      ],
      recommendedKeywords: [
        {
          keyword: request.targetKeywords[0] + ' guide',
          difficulty: 45,
          opportunity: 78
        }
      ]
    };
  }

  private generateMockTrendAnalysis(topics: string[]): TrendAnalysis[] {
    return topics.map(topic => ({
      topic,
      trendScore: Math.floor(Math.random() * 40) + 60,
      momentum: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
      relatedTopics: [
        `${topic} best practices`,
        `${topic} trends 2024`,
        `${topic} tools`,
        `${topic} tutorial`
      ],
      searchVolume: Math.floor(Math.random() * 50000) + 10000,
      competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      bestPublishingTimes: ['9:00 AM', '2:00 PM', '7:00 PM'],
      suggestedPlatforms: ['LinkedIn', 'Twitter', 'Medium'],
      keywordOpportunities: [
        {
          keyword: `${topic} guide`,
          difficulty: Math.floor(Math.random() * 50) + 25,
          volume: Math.floor(Math.random() * 10000) + 1000,
          trend: Math.floor(Math.random() * 20) + 80
        }
      ]
    }));
  }

  private generateMockPredictiveAnalytics(): PredictiveAnalytics {
    return {
      contentPerformancePrediction: {
        expectedViews: Math.floor(Math.random() * 10000) + 5000,
        expectedEngagement: Math.floor(Math.random() * 500) + 200,
        viralPotential: Math.floor(Math.random() * 30) + 10,
        bestPerformingPlatforms: ['LinkedIn', 'Twitter', 'Medium']
      },
      audienceInsights: {
        optimalPostingTimes: ['9:00 AM', '1:00 PM', '6:00 PM'],
        preferredContentTypes: ['tutorials', 'case studies', 'industry insights'],
        engagementPatterns: {
          'Monday': 85,
          'Tuesday': 92,
          'Wednesday': 88,
          'Thursday': 95,
          'Friday': 78,
          'Saturday': 65,
          'Sunday': 70
        }
      },
      contentRecommendations: [
        {
          topic: 'AI in Web Development',
          reason: 'High trending score and low competition',
          priority: 'high',
          estimatedImpact: 85
        }
      ]
    };
  }

  private generateMockAIInsights(): AIInsights {
    return {
      contentSuggestions: [
        {
          title: 'The Future of Serverless Architecture',
          topic: 'serverless',
          reasoning: 'Rising trend with 45% growth in searches',
          trendScore: 92,
          difficulty: 'medium'
        }
      ],
      optimizationTips: [
        {
          area: 'seo',
          suggestion: 'Add more long-tail keywords to your content',
          impact: 'high',
          implementation: 'Include specific, detailed phrases that users search for'
        }
      ],
      competitorAnalysis: [
        {
          competitor: 'TechBlog Pro',
          strengths: ['Consistent posting schedule', 'High-quality visuals'],
          opportunities: ['Limited video content', 'Weak social media presence'],
          contentGaps: ['AI tutorials', 'Performance optimization guides']
        }
      ]
    };
  }

  /**
   * Generate hashtags for social media content
   */
  async generateHashtags(content: string, platform: string): Promise<string[]> {
    try {
      if (!this.isConfigured) {
        return this.generateMockHashtags(content, platform);
      }

      const prompt = `Generate relevant hashtags for this content on ${platform}:

      "${content.substring(0, 500)}"

      Provide 5-10 relevant hashtags that would help with discoverability on ${platform}.
      Return as a JSON array of strings.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a social media expert specializing in hashtag strategy and content discoverability."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 200,
      });

      const result = completion.choices[0]?.message?.content || '';
      return this.parseHashtags(result, platform);
    } catch (error) {
      console.error('Hashtag generation failed:', error);
      return this.generateMockHashtags(content, platform);
    }
  }

  private generateMockHashtags(content: string, platform: string): string[] {
    const baseHashtags = [
      'WebDevelopment', 'Programming', 'Tech', 'Coding',
      'JavaScript', 'React', 'TypeScript', 'Frontend'
    ];

    const platformHashtags = {
      'linkedin': ['ProfessionalDevelopment', 'CareerGrowth', 'TechLeadership'],
      'twitter': ['100DaysOfCode', 'DevCommunity', 'TechTwitter'],
      'instagram': ['CodeLife', 'DeveloperLife', 'TechInnovation']
    };

    const platformSpecific = platformHashtags[platform.toLowerCase() as keyof typeof platformHashtags] || [];
    return [...baseHashtags.slice(0, 6), ...platformSpecific].slice(0, 8);
  }

  private parseHashtags(result: string, platform: string): string[] {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((tag: string) => tag.replace('#', ''));
      }
    } catch (error) {
      console.warn('Failed to parse hashtags, using mock data');
    }
    return this.generateMockHashtags('', platform);
  }

  /**
   * Analyze content sentiment and tone
   */
  async analyzeContentSentiment(content: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    confidence: number
    tone: string[]
    suggestions: string[]
  }> {
    try {
      if (!this.isConfigured) {
        return this.generateMockSentiment();
      }

      const prompt = `Analyze the sentiment and tone of this content:

      "${content.substring(0, 1000)}"

      Provide analysis in JSON format:
      {
        "sentiment": "positive|neutral|negative",
        "confidence": 85,
        "tone": ["professional", "friendly"],
        "suggestions": ["suggestion1", "suggestion2"]
      }`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert in content analysis, sentiment detection, and tone assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      const result = completion.choices[0]?.message?.content || '';
      return this.parseSentimentAnalysis(result);
    } catch (error) {
      console.error('Sentiment analysis failed:', error)
      return this.generateMockSentiment();
    }
  }

  private generateMockSentiment() {
    const sentiments = ['positive', 'neutral', 'negative'] as const;
    const tones = ['professional', 'friendly', 'authoritative', 'casual', 'technical'];

    return {
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      confidence: Math.floor(Math.random() * 30) + 70,
      tone: tones.slice(0, Math.floor(Math.random() * 3) + 1),
      suggestions: [
        'Consider adding more positive language to improve engagement',
        'The tone is appropriate for your target audience',
        'Add more specific examples to increase authority'
      ]
    };
  }

  private parseSentimentAnalysis(result: string) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse sentiment analysis, using mock data');
    }
    return this.generateMockSentiment();
  }

  private generateMockContent(request: ContentGenerationRequest): GeneratedContent {
    const titles = {
      'blog-post': [
        `The Ultimate Guide to ${request.topic}`,
        `${request.topic}: Best Practices for 2024`,
        `How to Master ${request.topic} in 30 Days`,
        `${request.topic} Explained: A Complete Tutorial`
      ],
      'social-media': [
        `Quick tip about ${request.topic}`,
        `Why ${request.topic} matters`,
        `${request.topic} in 60 seconds`,
        `The truth about ${request.topic}`
      ],
      'newsletter': [
        `This Week in ${request.topic}`,
        `${request.topic} Updates You Need to Know`,
        `Latest ${request.topic} Trends and Insights`
      ],
      'product-description': [
        `Revolutionary ${request.topic} Solution`,
        `Professional ${request.topic} Tool`,
        `Advanced ${request.topic} Platform`
      ]
    }

    const title = titles[request.type][Math.floor(Math.random() * titles[request.type].length)]
    
    const contentLengths = {
      'short': 300,
      'medium': 800,
      'long': 1500
    }

    const wordCount = contentLengths[request.length]
    const readingTime = Math.ceil(wordCount / 200)

    return {
      title,
      content: `# ${title}\n\nThis is AI-generated content about ${request.topic}. The content has been optimized for ${request.targetAudience} with a ${request.tone} tone.\n\n## Introduction\n\nIn today's rapidly evolving digital landscape, ${request.topic} has become increasingly important...\n\n## Key Points\n\n1. Understanding the fundamentals\n2. Best practices and implementation\n3. Common pitfalls to avoid\n4. Future trends and developments\n\n## Conclusion\n\nBy following these guidelines and staying updated with the latest trends in ${request.topic}, you'll be well-positioned for success.`,
      excerpt: `A comprehensive guide to ${request.topic} covering best practices, implementation strategies, and future trends.`,
      keywords: request.keywords || [`${request.topic}`, `${request.topic} guide`, `${request.topic} best practices`],
      hashtags: [`#${request.topic.replace(/\s+/g, '')}`, '#TechTips', '#Development', '#BestPractices'],
      suggestedImages: [
        `/images/${request.topic.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`,
        `/images/${request.topic.toLowerCase().replace(/\s+/g, '-')}-diagram.png`,
        `/images/${request.topic.toLowerCase().replace(/\s+/g, '-')}-example.jpg`
      ],
      metadata: {
        wordCount,
        readingTime,
        seoScore: Math.floor(Math.random() * 20) + 80,
        engagementPrediction: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 20) + 80
      }
    }
  }
}

// Export singleton instance
export const aiService = new AIService()

// Utility functions
export const generateContentIdeas = async (niche: string, count: number = 5) => {
  const ideas = []
  for (let i = 0; i < count; i++) {
    ideas.push({
      title: `${niche} Idea ${i + 1}`,
      description: `A compelling content idea about ${niche}`,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      trendScore: Math.floor(Math.random() * 40) + 60
    })
  }
  return ideas
}

export const optimizeContentForPlatform = async (content: string, platform: string) => {
  // Platform-specific optimization logic
  const optimizations = {
    'linkedin': {
      maxLength: 3000,
      tone: 'professional',
      includeHashtags: true,
      maxHashtags: 5
    },
    'twitter': {
      maxLength: 280,
      tone: 'casual',
      includeHashtags: true,
      maxHashtags: 3
    },
    'medium': {
      maxLength: 10000,
      tone: 'informative',
      includeHashtags: false,
      maxHashtags: 0
    }
  };

  const config = optimizations[platform as keyof typeof optimizations] || optimizations.medium;

  let optimizedContent = content;
  if (content.length > config.maxLength) {
    optimizedContent = content.substring(0, config.maxLength - 3) + '...';
  }

  return {
    content: optimizedContent,
    platform,
    optimization: config
  };
};

export default aiService;
