import { BasePlatformAdapter } from '../base-adapter';
import { 
  PlatformCredentials, 
  AdaptedContent, 
  PostResult, 
  PlatformCapabilities, 
  PlatformStatus,
  BlogPost 
} from '../types';

export class MastodonAdapter extends BasePlatformAdapter {
  platform = 'mastodon';
  displayName = 'Mastodon';
  category = 'social' as const;
  
  private instanceUrl: string = 'https://mastodon.social'; // Default instance
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 500, // Standard Mastodon limit (can vary by instance)
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: ['a', 'span', 'p', 'br'],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov', 'webm'],
      maxImageSize: 10 * 1024 * 1024, // 10MB (varies by instance)
      maxVideoSize: 40 * 1024 * 1024, // 40MB (varies by instance)
      maxImagesPerPost: 4,
      maxVideosPerPost: 1,
      supportsContentWarnings: true,
      supportsVisibility: true // public, unlisted, followers-only, direct
    };
  }

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Mastodon access token is required');
      }
      
      // Set instance URL if provided
      if (credentials.instanceUrl) {
        this.instanceUrl = credentials.instanceUrl;
      }
      
      this.credentials = credentials;
      
      // Validate token by getting account info
      const response = await fetch(`${this.instanceUrl}/api/v1/accounts/verify_credentials`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Mastodon authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`Mastodon authenticated for user: ${userData.username}@${new URL(this.instanceUrl).hostname}`);
      
      return true;
    } catch (error) {
      console.error('Mastodon authentication error:', error);
      return false;
    }
  }

  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Mastodon not authenticated');
      }

      // Upload media if present
      const mediaIds: string[] = [];
      
      if (content.images && content.images.length > 0) {
        for (const imageUrl of content.images.slice(0, 4)) { // Max 4 images
          const mediaId = await this.uploadMedia(imageUrl, 'image');
          if (mediaId) mediaIds.push(mediaId);
        }
      }
      
      if (content.videos && content.videos.length > 0) {
        const mediaId = await this.uploadMedia(content.videos[0], 'video');
        if (mediaId) mediaIds.push(mediaId);
      }

      // Prepare post data
      const postData: any = {
        status: content.content,
        visibility: content.metadata?.visibility || 'public',
        media_ids: mediaIds
      };

      // Add content warning if specified
      if (content.metadata?.contentWarning) {
        postData.spoiler_text = content.metadata.contentWarning;
      }

      // Add language if specified
      if (content.metadata?.language) {
        postData.language = content.metadata.language;
      }

      // Schedule post if specified
      if (content.metadata?.scheduledAt) {
        postData.scheduled_at = new Date(content.metadata.scheduledAt).toISOString();
      }

      const response = await fetch(`${this.instanceUrl}/api/v1/statuses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to publish to Mastodon');
      }

      return {
        success: true,
        platformPostId: result.id,
        url: result.url,
        metadata: {
          visibility: result.visibility,
          mediaAttachments: result.media_attachments?.length || 0,
          scheduled: !!postData.scheduled_at
        }
      };
    } catch (error) {
      console.error('Mastodon publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async uploadMedia(mediaUrl: string, type: 'image' | 'video'): Promise<string | null> {
    try {
      // Download media file
      const mediaResponse = await fetch(mediaUrl);
      if (!mediaResponse.ok) {
        throw new Error('Failed to download media file');
      }

      const mediaBlob = await mediaResponse.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', mediaBlob);
      formData.append('description', `${type} from blog post`);

      const response = await fetch(`${this.instanceUrl}/api/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Media upload failed:', result);
        return null;
      }

      // Wait for processing if needed
      if (result.url === null) {
        // Media is still processing, wait a bit
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check status
        const statusResponse = await fetch(`${this.instanceUrl}/api/v1/media/${result.id}`, {
          headers: {
            'Authorization': `Bearer ${this.credentials!.accessToken}`
          }
        });
        
        const statusResult = await statusResponse.json();
        return statusResult.url ? result.id : null;
      }

      return result.id;
    } catch (error) {
      console.error('Media upload error:', error);
      return null;
    }
  }

  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const capabilities = this.getCapabilities();
    let content = originalContent.excerpt || originalContent.content.substring(0, 800);
    const warnings: string[] = [];

    // Truncate if too long
    if (content.length > capabilities.maxContentLength - 50) { // Leave room for hashtags
      content = content.substring(0, capabilities.maxContentLength - 53) + '...';
      warnings.push('Content was truncated to fit Mastodon\'s character limit');
    }

    // Extract and add hashtags
    const hashtags = this.extractHashtags(originalContent);
    const hashtagString = hashtags.slice(0, 5).join(' ');
    
    if (content.length + hashtagString.length + 2 <= capabilities.maxContentLength) {
      content += '\n\n' + hashtagString;
    } else {
      warnings.push('Some hashtags were omitted due to character limit');
    }

    // Add link to original post
    if (originalContent.canonicalUrl) {
      const linkText = `\n\nRead more: ${originalContent.canonicalUrl}`;
      if (content.length + linkText.length <= capabilities.maxContentLength) {
        content += linkText;
      } else {
        warnings.push('Link to original post was omitted due to character limit');
      }
    }

    return {
      title: originalContent.title,
      content,
      hashtags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: { 
        warnings,
        visibility: 'public',
        language: 'en'
      }
    };
  }

  private extractHashtags(content: BlogPost): string[] {
    const hashtags: string[] = [];
    
    // Add tags as hashtags
    if (content.tags) {
      hashtags.push(...content.tags.map(tag => `#${tag.replace(/\s+/g, '').toLowerCase()}`));
    }
    
    // Add category as hashtag
    if (content.category) {
      hashtags.push(`#${content.category.replace(/\s+/g, '').toLowerCase()}`);
    }
    
    // Add some general hashtags
    hashtags.push('#blog', '#content');
    
    return hashtags.slice(0, 8); // Reasonable limit for Mastodon
  }

  async checkHealth(): Promise<PlatformStatus> {
    try {
      const response = await fetch(`${this.instanceUrl}/api/v1/instance`, {
        method: 'GET'
      });

      const instanceData = await response.json();

      return {
        isOnline: response.ok,
        responseTime: response.ok ? 100 : undefined,
        lastChecked: new Date(),
        errorMessage: response.ok ? undefined : 'Mastodon instance not accessible',
        metadata: response.ok ? {
          instanceName: instanceData.title,
          version: instanceData.version,
          userCount: instanceData.stats?.user_count
        } : undefined
      };
    } catch (error) {
      return {
        isOnline: false,
        lastChecked: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getRateLimit(): { remainingRequests: number; resetTime: Date } {
    // Mastodon rate limits vary by instance, use conservative defaults
    return {
      remainingRequests: this.rateLimitRemaining || 300,
      resetTime: this.rateLimitResetTime
    };
  }

  // Mastodon-specific methods
  async getInstanceInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.instanceUrl}/api/v1/instance`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get instance info:', error);
      return null;
    }
  }

  async searchHashtags(query: string): Promise<string[]> {
    try {
      if (!this.credentials?.accessToken) return [];

      const response = await fetch(`${this.instanceUrl}/api/v2/search?q=${encodeURIComponent(query)}&type=hashtags&limit=10`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`
        }
      });

      const result = await response.json();
      return result.hashtags?.map((tag: any) => `#${tag.name}`) || [];
    } catch (error) {
      console.error('Hashtag search failed:', error);
      return [];
    }
  }
}
