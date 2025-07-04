/**
 * OpenAI Content Service Implementation
 * Provides AI-powered content enhancement using OpenAI's GPT models
 */

import OpenAI from 'openai/index.mjs';
import {
  AIContentService,
  ContentAnalysis,
  SEOAnalysis,
  ContentOptimization,
  PlatformContentAdaptation,
  ContentAdaptationRequest,
  WritingAssistanceRequest,
  WritingAssistanceResponse,
  ImageAnalysis,
  TranslationRequest,
  TranslationResponse,
  TrendAnalysis,
  AIServiceError,
  RateLimitError,
  QuotaExceededError,
} from '../types';

export class OpenAIContentService implements AIContentService {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'gpt-4-turbo-preview';
    this.maxTokens = config.maxTokens || 4000;
    this.temperature = config.temperature || 0.7;
  }

  async analyzeContent(content: string): Promise<ContentAnalysis> {
    try {
      const prompt = `Analyze the following content and provide a comprehensive analysis:

Content:
"""
${content}
"""

Please provide a JSON response with the following structure:
{
  "readingTime": number (estimated minutes),
  "readingLevel": "beginner" | "intermediate" | "advanced",
  "sentimentScore": number (-1 to 1),
  "topicRelevance": number (0 to 1),
  "keyPhrases": string[],
  "suggestedTags": string[],
  "languageDetection": string,
  "wordCount": number,
  "paragraphCount": number,
  "headingStructure": [
    {
      "level": number,
      "text": string,
      "position": number,
      "suggestions": string[]
    }
  ]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert content analyst who provides detailed analysis of written content. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as ContentAnalysis;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async analyzeSEO(
    title: string,
    content: string,
    targetKeywords?: string[]
  ): Promise<SEOAnalysis> {
    try {
      const prompt = `Analyze the SEO performance of this content:

Title: ${title}
Content:
"""
${content}
"""
${targetKeywords ? `Target Keywords: ${targetKeywords.join(', ')}` : ''}

Provide a comprehensive SEO analysis with scores, suggestions, and improvements in JSON format:
{
  "titleScore": number (0-100),
  "descriptionScore": number (0-100),
  "keywordDensity": {"keyword": density},
  "suggestedTitle": string[],
  "suggestedDescription": string[],
  "suggestedKeywords": string[],
  "internalLinkOpportunities": string[],
  "imageAltTextSuggestions": {"imageContext": "altText"},
  "headingOptimization": [
    {
      "current": string,
      "suggested": string,
      "reasoning": string,
      "level": number
    }
  ]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert who provides detailed analysis and optimization suggestions. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
      });

      const seoAnalysis = JSON.parse(response.choices[0].message.content || '{}');
      return seoAnalysis as SEOAnalysis;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async optimizeContent(content: string, goals: string[]): Promise<ContentOptimization> {
    try {
      const prompt = `Optimize the following content based on these goals: ${goals.join(', ')}

Original Content:
"""
${content}
"""

Provide an optimized version with detailed change tracking in JSON format:
{
  "originalContent": string,
  "optimizedContent": string,
  "changes": [
    {
      "type": "addition" | "modification" | "removal",
      "section": string,
      "original": string,
      "modified": string,
      "reasoning": string
    }
  ],
  "improvementScore": number (0-100),
  "suggestions": [
    {
      "type": "structure" | "clarity" | "engagement" | "seo" | "readability",
      "priority": "low" | "medium" | "high",
      "title": string,
      "description": string,
      "implementation": string
    }
  ]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a content optimization expert who improves written content for better engagement and performance. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5,
      });

      const optimization = JSON.parse(response.choices[0].message.content || '{}');
      return optimization as ContentOptimization;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async adaptForPlatforms(request: ContentAdaptationRequest): Promise<PlatformContentAdaptation[]> {
    try {
      const prompt = `Adapt this content for multiple social media platforms:

Original Title: ${request.originalTitle}
Original Content:
"""
${request.originalContent}
"""

Target Platforms: ${request.platforms.join(', ')}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.includeHashtags ? 'Include relevant hashtags' : ''}

Provide platform-specific adaptations in JSON format:
[
  {
    "platform": string,
    "adaptedContent": string,
    "adaptedTitle": string,
    "hashtags": string[],
    "mentions": string[],
    "mediaUrls": string[],
    "customFields": {}
  }
]`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a social media expert who adapts content for different platforms while maintaining the core message. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.6,
      });

      const adaptations = JSON.parse(response.choices[0].message.content || '[]');
      return adaptations as PlatformContentAdaptation[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWritingAssistance(request: WritingAssistanceRequest): Promise<WritingAssistanceResponse> {
    try {
      const prompt = `Provide writing assistance for the following:

Type: ${request.type}
Content:
"""
${request.content}
"""
${request.context ? `Context: ${request.context}` : ''}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.targetLength ? `Target Length: ${request.targetLength} words` : ''}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}

Provide writing assistance in JSON format:
{
  "suggestions": string[],
  "confidence": number (0-1),
  "reasoning": string,
  "alternatives": string[]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional writing assistant who helps improve content quality and style. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
      });

      const assistance = JSON.parse(response.choices[0].message.content || '{}');
      return assistance as WritingAssistanceResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async analyzeImage(imageUrl: string, context?: string): Promise<ImageAnalysis> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and provide detailed information in JSON format:
{
  "description": string,
  "suggestedAltText": string,
  "detectedObjects": string[],
  "suggestedCaption": string,
  "accessibilityScore": number (0-100),
  "seoScore": number (0-100)
}
${context ? `Context: ${context}` : ''}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as ImageAnalysis;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async translateContent(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const prompt = `Translate the following content:

From: ${request.fromLanguage}
To: ${request.toLanguage}
Preserve Formatting: ${request.preserveFormatting}
${request.tone ? `Tone: ${request.tone}` : ''}

Content:
"""
${request.content}
"""

Provide translation result in JSON format:
{
  "translatedContent": string,
  "confidence": number (0-1),
  "detectedLanguage": string,
  "alternatives": string[]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator who provides accurate translations while preserving tone and context. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
      });

      const translation = JSON.parse(response.choices[0].message.content || '{}');
      return translation as TranslationResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async analyzeTrends(topic?: string, platforms?: string[]): Promise<TrendAnalysis> {
    try {
      const prompt = `Analyze current content trends and provide insights:

${topic ? `Topic: ${topic}` : 'General content trends'}
${platforms ? `Platforms: ${platforms.join(', ')}` : 'All major platforms'}

Provide trend analysis in JSON format:
{
  "trendingTopics": [
    {
      "topic": string,
      "relevanceScore": number (0-1),
      "platforms": string[],
      "suggestedContent": string[],
      "searchVolume": number
    }
  ],
  "suggestedHashtags": string[],
  "optimalPostingTimes": {"platform": ["time1", "time2"]},
  "competitorInsights": [
    {
      "competitor": string,
      "strategy": string,
      "successMetrics": {"metric": value},
      "contentTypes": string[],
      "postingFrequency": number
    }
  ],
  "contentGaps": string[]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a digital marketing expert who analyzes content trends and provides strategic insights. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.4,
      });

      const trends = JSON.parse(response.choices[0].message.content || '{}');
      return trends as TrendAnalysis;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AIServiceError {
    if (error.status === 429) {
      return new RateLimitError('openai');
    }
    if (error.status === 402 || error.code === 'insufficient_quota') {
      return new QuotaExceededError('openai');
    }
    return new AIServiceError(
      error.message || 'OpenAI API error',
      'openai',
      error.code || 'UNKNOWN_ERROR',
      error.status
    );
  }
}
