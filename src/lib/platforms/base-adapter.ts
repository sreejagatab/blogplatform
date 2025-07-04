import { 
  PlatformAdapter, 
  PlatformCredentials, 
  AdaptedContent, 
  PostResult, 
  PlatformMetrics, 
  PlatformStatus, 
  PlatformCapabilities,
  BlogPost 
} from './types';

export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract platform: string;
  abstract displayName: string;
  abstract category: 'social' | 'blogging' | 'professional' | 'news' | 'community';
  
  protected credentials?: PlatformCredentials;
  protected rateLimitRemaining: number = 0;
  protected rateLimitResetTime: Date = new Date();
  
  // Abstract methods that must be implemented by each platform
  abstract authenticate(credentials: PlatformCredentials): Promise<boolean>;
  abstract publishPost(content: AdaptedContent): Promise<PostResult>;
  abstract adaptContent(originalContent: BlogPost): Promise<AdaptedContent>;
  abstract getCapabilities(): PlatformCapabilities;
  abstract checkHealth(): Promise<PlatformStatus>;
  
  // Default implementations that can be overridden
  async validateConnection(): Promise<boolean> {
    try {
      const status = await this.checkHealth();
      return status.isOnline;
    } catch (error) {
      console.error(`Failed to validate connection for ${this.platform}:`, error);
      return false;
    }
  }
  
  async validateContent(content: AdaptedContent): Promise<{ valid: boolean; errors?: string[] }> {
    const capabilities = this.getCapabilities();
    const errors: string[] = [];
    
    // Check content length
    if (content.content.length > capabilities.maxContentLength) {
      errors.push(`Content exceeds maximum length of ${capabilities.maxContentLength} characters`);
    }
    
    // Check image support
    if (content.images && content.images.length > 0 && !capabilities.supportsImages) {
      errors.push('Platform does not support images');
    }
    
    // Check video support
    if (content.videos && content.videos.length > 0 && !capabilities.supportsVideo) {
      errors.push('Platform does not support videos');
    }
    
    // Check hashtag support
    if (content.hashtags && content.hashtags.length > 0 && !capabilities.supportsHashtags) {
      errors.push('Platform does not support hashtags');
    }
    
    // Check mention support
    if (content.mentions && content.mentions.length > 0 && !capabilities.supportsMentions) {
      errors.push('Platform does not support mentions');
    }
    
    // Check image limits
    if (content.images && content.images.length > capabilities.maxImagesPerPost) {
      errors.push(`Too many images. Maximum allowed: ${capabilities.maxImagesPerPost}`);
    }
    
    // Check video limits
    if (content.videos && content.videos.length > capabilities.maxVideosPerPost) {
      errors.push(`Too many videos. Maximum allowed: ${capabilities.maxVideosPerPost}`);
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  getRateLimit(): { remainingRequests: number; resetTime: Date } {
    return {
      remainingRequests: this.rateLimitRemaining,
      resetTime: this.rateLimitResetTime
    };
  }
  
  protected updateRateLimit(remaining: number, resetTime: Date): void {
    this.rateLimitRemaining = remaining;
    this.rateLimitResetTime = resetTime;
  }
  
  protected async waitForRateLimit(): Promise<void> {
    if (this.rateLimitRemaining <= 0 && this.rateLimitResetTime > new Date()) {
      const waitTime = this.rateLimitResetTime.getTime() - new Date().getTime();
      if (waitTime > 0) {
        console.log(`Rate limit exceeded for ${this.platform}. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // Helper methods for content processing
  protected stripHtml(content: string): string {
    return content.replace(/<[^>]*>/g, '');
  }
  
  protected extractPlainText(content: string): string {
    return this.stripHtml(content)
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
  
  protected truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength - suffix.length);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0 && lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + suffix;
    }
    
    return truncated + suffix;
  }
  
  protected extractHashtags(content: string, maxCount: number = 10): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = content.match(hashtagRegex) || [];
    return matches.slice(0, maxCount).map(tag => tag.substring(1));
  }
  
  protected extractMentions(content: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = content.match(mentionRegex) || [];
    return matches.map(mention => mention.substring(1));
  }
  
  protected extractUrls(content: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return content.match(urlRegex) || [];
  }
  
  protected generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = this.extractPlainText(content);
    return this.truncateText(plainText, maxLength);
  }
  
  // Error handling helpers
  protected handleApiError(error: any, operation: string): PostResult {
    console.error(`${this.platform} API error during ${operation}:`, error);
    
    let errorMessage = `Failed to ${operation}`;
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          errorMessage = 'Authentication failed. Please reconnect your account.';
          break;
        case 403:
          errorMessage = 'Access forbidden. Check your permissions.';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later.';
          break;
        case 500:
          errorMessage = 'Platform server error. Please try again later.';
          break;
        default:
          errorMessage = data?.message || `HTTP ${status} error`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      errorMessage
    };
  }
  
  // Optional methods with default implementations
  async refreshAuthentication?(): Promise<boolean> {
    // Default implementation - platform should override if they support refresh tokens
    return false;
  }
  
  async schedulePost?(content: AdaptedContent, publishAt: Date): Promise<PostResult> {
    return {
      success: false,
      errorMessage: `${this.platform} does not support post scheduling`
    };
  }
  
  async updatePost?(postId: string, content: AdaptedContent): Promise<PostResult> {
    return {
      success: false,
      errorMessage: `${this.platform} does not support post updates`
    };
  }
  
  async deletePost?(postId: string): Promise<boolean> {
    return false; // Most platforms don't support deletion
  }
  
  async getPostMetrics?(postId: string): Promise<PlatformMetrics> {
    return {}; // Return empty metrics if not supported
  }
  
  async getBulkMetrics?(postIds: string[]): Promise<Record<string, PlatformMetrics>> {
    return {}; // Return empty metrics if not supported
  }
}
