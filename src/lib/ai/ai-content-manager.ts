/**
 * AI Content Service Manager
 * Manages multiple AI providers and provides unified interface for content enhancement
 */

import {
  AIContentService,
  AIProvider,
  AIProviderConfig,
  AIContentConfig,
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
} from './types';

import { OpenAIContentService } from './providers/openai';

export class AIContentManager implements AIContentService {
  private providers: Map<AIProvider, AIContentService> = new Map();
  private config: AIContentConfig;
  private rateLimits: Map<AIProvider, { count: number; resetTime: Date }> = new Map();

  constructor(config: AIContentConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize OpenAI provider
    if (this.config.providers.openai?.enabled) {
      const openaiService = new OpenAIContentService({
        apiKey: this.config.providers.openai.apiKey,
        model: this.config.providers.openai.model,
        maxTokens: this.config.providers.openai.maxTokens,
        temperature: this.config.providers.openai.temperature,
      });
      this.providers.set('openai', openaiService);
    }

    // TODO: Initialize other providers (Anthropic, Google, Azure)
    // Similar pattern for other providers
  }

  private async getProvider(preferredProvider?: AIProvider): Promise<AIContentService> {
    const provider = preferredProvider || this.config.defaultProvider;
    
    // Check rate limits
    const rateLimit = this.rateLimits.get(provider);
    if (rateLimit && rateLimit.resetTime > new Date() && rateLimit.count >= this.config.limits.requestsPerMinute) {
      // Try fallback provider
      const fallbackProvider = this.getFallbackProvider(provider);
      if (fallbackProvider) {
        return this.getProvider(fallbackProvider);
      }
      throw new RateLimitError(provider, rateLimit.resetTime);
    }

    const service = this.providers.get(provider);
    if (!service) {
      throw new AIServiceError(`Provider ${provider} not available`, provider, 'PROVIDER_NOT_AVAILABLE');
    }

    // Update rate limit tracking
    this.updateRateLimit(provider);
    
    return service;
  }

  private getFallbackProvider(currentProvider: AIProvider): AIProvider | null {
    const availableProviders = Array.from(this.providers.keys()).filter(p => p !== currentProvider);
    return availableProviders.length > 0 ? availableProviders[0] : null;
  }

  private updateRateLimit(provider: AIProvider): void {
    const now = new Date();
    const rateLimit = this.rateLimits.get(provider);
    
    if (!rateLimit || now.getTime() - rateLimit.resetTime.getTime() >= 60000) {
      // Reset rate limit window
      this.rateLimits.set(provider, { count: 1, resetTime: new Date(now.getTime() + 60000) });
    } else {
      rateLimit.count++;
    }
  }

  async analyzeContent(content: string, provider?: AIProvider): Promise<ContentAnalysis> {
    if (!this.config.features.contentAnalysis) {
      throw new AIServiceError('Content analysis feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    if (content.length > this.config.limits.maxContentLength) {
      throw new AIServiceError('Content too long', provider || this.config.defaultProvider, 'CONTENT_TOO_LONG');
    }

    const service = await this.getProvider(provider);
    return await service.analyzeContent(content);
  }

  async analyzeSEO(
    title: string,
    content: string,
    targetKeywords?: string[],
    provider?: AIProvider
  ): Promise<SEOAnalysis> {
    if (!this.config.features.seoOptimization) {
      throw new AIServiceError('SEO optimization feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.analyzeSEO(title, content, targetKeywords);
  }

  async optimizeContent(
    content: string,
    goals: string[],
    provider?: AIProvider
  ): Promise<ContentOptimization> {
    if (!this.config.features.seoOptimization) {
      throw new AIServiceError('Content optimization feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.optimizeContent(content, goals);
  }

  async adaptForPlatforms(
    request: ContentAdaptationRequest,
    provider?: AIProvider
  ): Promise<PlatformContentAdaptation[]> {
    if (!this.config.features.platformAdaptation) {
      throw new AIServiceError('Platform adaptation feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.adaptForPlatforms(request);
  }

  async getWritingAssistance(
    request: WritingAssistanceRequest,
    provider?: AIProvider
  ): Promise<WritingAssistanceResponse> {
    if (!this.config.features.writingAssistance) {
      throw new AIServiceError('Writing assistance feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.getWritingAssistance(request);
  }

  async analyzeImage(
    imageUrl: string,
    context?: string,
    provider?: AIProvider
  ): Promise<ImageAnalysis> {
    if (!this.config.features.imageAnalysis) {
      throw new AIServiceError('Image analysis feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.analyzeImage(imageUrl, context);
  }

  async translateContent(
    request: TranslationRequest,
    provider?: AIProvider
  ): Promise<TranslationResponse> {
    if (!this.config.features.translation) {
      throw new AIServiceError('Translation feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.translateContent(request);
  }

  async analyzeTrends(
    topic?: string,
    platforms?: string[],
    provider?: AIProvider
  ): Promise<TrendAnalysis> {
    if (!this.config.features.trendAnalysis) {
      throw new AIServiceError('Trend analysis feature is disabled', provider || this.config.defaultProvider, 'FEATURE_DISABLED');
    }

    const service = await this.getProvider(provider);
    return await service.analyzeTrends(topic, platforms);
  }

  // Utility methods
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }

  getProviderStatus(provider: AIProvider): { available: boolean; rateLimited: boolean; resetTime?: Date } {
    const available = this.providers.has(provider);
    const rateLimit = this.rateLimits.get(provider);
    const rateLimited = rateLimit ? rateLimit.resetTime > new Date() && rateLimit.count >= this.config.limits.requestsPerMinute : false;
    
    return {
      available,
      rateLimited,
      resetTime: rateLimit?.resetTime,
    };
  }

  updateConfig(newConfig: Partial<AIContentConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeProviders();
  }

  // Batch processing methods
  async batchAnalyzeContent(contents: string[], provider?: AIProvider): Promise<ContentAnalysis[]> {
    const results = await Promise.allSettled(
      contents.map(content => this.analyzeContent(content, provider))
    );
    
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        throw result.reason;
      }
    });
  }

  async batchOptimizeContent(
    requests: { content: string; goals: string[] }[],
    provider?: AIProvider
  ): Promise<ContentOptimization[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.optimizeContent(request.content, request.goals, provider))
    );
    
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        throw result.reason;
      }
    });
  }
}

// Singleton instance
let aiContentManagerInstance: AIContentManager | null = null;

export function getAIContentManager(): AIContentManager {
  if (!aiContentManagerInstance) {
    const config: AIContentConfig = {
      defaultProvider: 'openai',
      providers: {
        openai: {
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY || '',
          model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
          enabled: !!process.env.OPENAI_API_KEY,
        },
        anthropic: {
          provider: 'anthropic',
          apiKey: process.env.ANTHROPIC_API_KEY || '',
          model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
          maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4000'),
          temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7'),
          enabled: !!process.env.ANTHROPIC_API_KEY,
        },
        google: {
          provider: 'google',
          apiKey: process.env.GOOGLE_AI_API_KEY || '',
          model: process.env.GOOGLE_AI_MODEL || 'gemini-pro',
          maxTokens: parseInt(process.env.GOOGLE_AI_MAX_TOKENS || '4000'),
          temperature: parseFloat(process.env.GOOGLE_AI_TEMPERATURE || '0.7'),
          enabled: !!process.env.GOOGLE_AI_API_KEY,
        },
        azure: {
          provider: 'azure',
          apiKey: process.env.AZURE_OPENAI_API_KEY || '',
          model: process.env.AZURE_OPENAI_MODEL || 'gpt-4',
          maxTokens: parseInt(process.env.AZURE_OPENAI_MAX_TOKENS || '4000'),
          temperature: parseFloat(process.env.AZURE_OPENAI_TEMPERATURE || '0.7'),
          enabled: !!process.env.AZURE_OPENAI_API_KEY,
        },
      },
      features: {
        contentAnalysis: true,
        seoOptimization: true,
        platformAdaptation: true,
        writingAssistance: true,
        imageAnalysis: true,
        translation: true,
        trendAnalysis: true,
      },
      limits: {
        dailyRequests: parseInt(process.env.AI_DAILY_REQUESTS_LIMIT || '1000'),
        requestsPerMinute: parseInt(process.env.AI_REQUESTS_PER_MINUTE_LIMIT || '60'),
        maxContentLength: parseInt(process.env.AI_MAX_CONTENT_LENGTH || '50000'),
      },
    };

    aiContentManagerInstance = new AIContentManager(config);
  }

  return aiContentManagerInstance;
}

// Export the singleton instance
export const aiContentManager = getAIContentManager();
