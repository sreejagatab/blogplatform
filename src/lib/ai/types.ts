/**
 * AI Content Enhancement System Types
 * Defines interfaces for AI-powered content optimization and enhancement
 */

// AI Provider Types
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'azure';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

// Content Enhancement Types
export interface ContentAnalysis {
  readingTime: number;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  sentimentScore: number; // -1 to 1
  topicRelevance: number; // 0 to 1
  keyPhrases: string[];
  suggestedTags: string[];
  languageDetection: string;
  wordCount: number;
  paragraphCount: number;
  headingStructure: HeadingAnalysis[];
}

export interface HeadingAnalysis {
  level: number;
  text: string;
  position: number;
  suggestions: string[];
}

export interface SEOAnalysis {
  titleScore: number; // 0 to 100
  descriptionScore: number; // 0 to 100
  keywordDensity: Record<string, number>;
  suggestedTitle: string[];
  suggestedDescription: string[];
  suggestedKeywords: string[];
  internalLinkOpportunities: string[];
  imageAltTextSuggestions: Record<string, string>;
  headingOptimization: HeadingOptimization[];
}

export interface HeadingOptimization {
  current: string;
  suggested: string;
  reasoning: string;
  level: number;
}

export interface ContentOptimization {
  originalContent: string;
  optimizedContent: string;
  changes: ContentChange[];
  improvementScore: number; // 0 to 100
  suggestions: OptimizationSuggestion[];
}

export interface ContentChange {
  type: 'addition' | 'modification' | 'removal';
  section: string;
  original: string;
  modified: string;
  reasoning: string;
}

export interface OptimizationSuggestion {
  type: 'structure' | 'clarity' | 'engagement' | 'seo' | 'readability';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  implementation: string;
}

// Platform Adaptation Types
export interface PlatformContentAdaptation {
  platform: string;
  adaptedContent: string;
  adaptedTitle: string;
  hashtags: string[];
  mentions: string[];
  mediaUrls: string[];
  scheduledTime?: Date;
  customFields: Record<string, any>;
}

export interface ContentAdaptationRequest {
  originalContent: string;
  originalTitle: string;
  platforms: string[];
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'informative' | 'persuasive';
  includeHashtags?: boolean;
  maxLength?: Record<string, number>; // platform -> max length
}

// AI Writing Assistant Types
export interface WritingAssistanceRequest {
  type: 'continue' | 'rewrite' | 'summarize' | 'expand' | 'simplify';
  content: string;
  context?: string;
  tone?: string;
  targetLength?: number;
  targetAudience?: string;
}

export interface WritingAssistanceResponse {
  suggestions: string[];
  confidence: number; // 0 to 1
  reasoning: string;
  alternatives: string[];
}

// Image Analysis Types
export interface ImageAnalysis {
  description: string;
  suggestedAltText: string;
  detectedObjects: string[];
  suggestedCaption: string;
  accessibilityScore: number; // 0 to 100
  seoScore: number; // 0 to 100
}

// Translation Types
export interface TranslationRequest {
  content: string;
  fromLanguage: string;
  toLanguage: string;
  preserveFormatting: boolean;
  tone?: string;
}

export interface TranslationResponse {
  translatedContent: string;
  confidence: number; // 0 to 1
  detectedLanguage?: string;
  alternatives: string[];
}

// Trend Analysis Types
export interface TrendAnalysis {
  trendingTopics: TrendingTopic[];
  suggestedHashtags: string[];
  optimalPostingTimes: Record<string, string[]>; // platform -> times
  competitorInsights: CompetitorInsight[];
  contentGaps: string[];
}

export interface TrendingTopic {
  topic: string;
  relevanceScore: number; // 0 to 1
  platforms: string[];
  suggestedContent: string[];
  searchVolume?: number;
}

export interface CompetitorInsight {
  competitor: string;
  strategy: string;
  successMetrics: Record<string, number>;
  contentTypes: string[];
  postingFrequency: number;
}

// AI Service Interface
export interface AIContentService {
  analyzeContent(content: string): Promise<ContentAnalysis>;
  analyzeSEO(title: string, content: string, targetKeywords?: string[]): Promise<SEOAnalysis>;
  optimizeContent(content: string, goals: string[]): Promise<ContentOptimization>;
  adaptForPlatforms(request: ContentAdaptationRequest): Promise<PlatformContentAdaptation[]>;
  getWritingAssistance(request: WritingAssistanceRequest): Promise<WritingAssistanceResponse>;
  analyzeImage(imageUrl: string, context?: string): Promise<ImageAnalysis>;
  translateContent(request: TranslationRequest): Promise<TranslationResponse>;
  analyzeTrends(topic?: string, platforms?: string[]): Promise<TrendAnalysis>;
}

// Configuration Types
export interface AIContentConfig {
  defaultProvider: AIProvider;
  providers: Record<AIProvider, AIProviderConfig>;
  features: {
    contentAnalysis: boolean;
    seoOptimization: boolean;
    platformAdaptation: boolean;
    writingAssistance: boolean;
    imageAnalysis: boolean;
    translation: boolean;
    trendAnalysis: boolean;
  };
  limits: {
    dailyRequests: number;
    requestsPerMinute: number;
    maxContentLength: number;
  };
}

// Error Types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public provider: AIProvider,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends AIServiceError {
  constructor(provider: AIProvider, resetTime?: Date) {
    super('Rate limit exceeded', provider, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends AIServiceError {
  constructor(provider: AIProvider) {
    super('API quota exceeded', provider, 'QUOTA_EXCEEDED', 429);
    this.name = 'QuotaExceededError';
  }
}
