// Platform Integration System - Core Types and Interfaces

export interface PlatformCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface AdaptedContent {
  title: string;
  content: string;
  excerpt?: string;
  hashtags?: string[];
  mentions?: string[];
  images?: string[];
  videos?: string[];
  links?: string[];
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

export interface PostResult {
  success: boolean;
  platformPostId?: string;
  platformUrl?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface PlatformMetrics {
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  reactions?: Record<string, number>;
  clickThroughRate?: number;
  engagementRate?: number;
  reachImpressions?: number;
}

export interface PlatformStatus {
  isOnline: boolean;
  responseTime?: number;
  lastChecked: Date;
  errorMessage?: string;
}

// Core Platform Adapter Interface
export interface PlatformAdapter {
  platform: string;
  displayName: string;
  category: 'social' | 'blogging' | 'professional' | 'news' | 'community';
  
  // Authentication
  authenticate(credentials: PlatformCredentials): Promise<boolean>;
  refreshAuthentication?(): Promise<boolean>;
  validateConnection(): Promise<boolean>;
  
  // Content Publishing
  publishPost(content: AdaptedContent): Promise<PostResult>;
  schedulePost?(content: AdaptedContent, publishAt: Date): Promise<PostResult>;
  updatePost?(postId: string, content: AdaptedContent): Promise<PostResult>;
  deletePost?(postId: string): Promise<boolean>;
  
  // Content Adaptation
  adaptContent(originalContent: BlogPost): Promise<AdaptedContent>;
  validateContent(content: AdaptedContent): Promise<{ valid: boolean; errors?: string[] }>;
  
  // Analytics
  getPostMetrics?(postId: string): Promise<PlatformMetrics>;
  getBulkMetrics?(postIds: string[]): Promise<Record<string, PlatformMetrics>>;
  
  // Platform Status
  checkHealth(): Promise<PlatformStatus>;
  
  // Rate Limiting
  getRateLimit(): { remainingRequests: number; resetTime: Date };
  
  // Platform-specific features
  getCapabilities(): PlatformCapabilities;
}

export interface PlatformCapabilities {
  maxContentLength: number;
  supportsImages: boolean;
  supportsVideo: boolean;
  supportsHashtags: boolean;
  supportsMentions: boolean;
  supportsScheduling: boolean;
  supportsMarkdown: boolean;
  supportsHTMLTags: string[];
  imageFormats: string[];
  videoFormats: string[];
  maxImageSize: number;
  maxVideoSize: number;
  maxImagesPerPost: number;
  maxVideosPerPost: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt?: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

// Content Adaptation Engine
export interface ContentAdapter {
  adaptForPlatform(content: BlogPost, platform: string): Promise<AdaptedContent>;
  generateHashtags(content: BlogPost, platform: string, maxCount?: number): Promise<string[]>;
  optimizeImages(images: string[], platform: string): Promise<string[]>;
  truncateContent(content: string, maxLength: number, preserveFormatting?: boolean): string;
  extractKeyPoints(content: string, maxPoints?: number): Promise<string[]>;
  generateSocialTitle(originalTitle: string, platform: string): Promise<string>;
  addPlatformSpecificFormatting(content: string, platform: string): string;
}

// Distribution Engine
export interface DistributionJob {
  id: string;
  postId: string;
  platforms: string[];
  scheduledFor?: Date;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  results: Record<string, PostResult>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DistributionEngine {
  distributePost(postId: string, platforms: string[], scheduledFor?: Date): Promise<DistributionJob>;
  getJobStatus(jobId: string): Promise<DistributionJob>;
  cancelJob(jobId: string): Promise<boolean>;
  retryFailedPlatforms(jobId: string): Promise<DistributionJob>;
  getBulkJobStatus(jobIds: string[]): Promise<DistributionJob[]>;
}

// Platform Manager
export interface PlatformManager {
  registerAdapter(adapter: PlatformAdapter): void;
  getAdapter(platform: string): PlatformAdapter | null;
  getAllAdapters(): PlatformAdapter[];
  getAvailablePlatforms(): string[];
  getPlatformsByCategory(category: string): PlatformAdapter[];
  validateAllConnections(userId: string): Promise<Record<string, boolean>>;
  getHealthStatus(): Promise<Record<string, PlatformStatus>>;
}

// Analytics Aggregator
export interface AnalyticsAggregator {
  aggregateMetrics(postId: string): Promise<{
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    platformBreakdown: Record<string, PlatformMetrics>;
    bestPerformingPlatform: string;
    worstPerformingPlatform: string;
    averageEngagementRate: number;
  }>;
  
  getTimeSeriesData(postId: string, timeRange: '24h' | '7d' | '30d' | '90d'): Promise<{
    timestamps: Date[];
    metrics: Record<string, number[]>;
  }>;
  
  comparePlatformPerformance(timeRange: string): Promise<{
    platforms: string[];
    avgViews: number[];
    avgEngagement: number[];
    postCount: number[];
  }>;
}
