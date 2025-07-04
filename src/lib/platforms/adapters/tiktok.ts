import { BasePlatformAdapter } from '../base-adapter';
import { 
  PlatformCredentials, 
  AdaptedContent, 
  PostResult, 
  PlatformCapabilities, 
  PlatformStatus,
  BlogPost 
} from '../types';

export class TikTokAdapter extends BasePlatformAdapter {
  platform = 'tiktok';
  displayName = 'TikTok';
  category = 'social' as const;
  
  private apiBaseUrl = 'https://open-api.tiktok.com/platform/v1';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 2200, // Caption length
      supportsImages: false, // TikTok is video-first
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false, // Not available in public API
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: [],
      videoFormats: ['mp4', 'mov', 'mpeg', 'flv', 'webm', '3gp'],
      maxImageSize: 0,
      maxVideoSize: 287 * 1024 * 1024, // 287MB
      maxImagesPerPost: 0,
      maxVideosPerPost: 1,
      videoDurationLimits: {
        min: 3, // 3 seconds
        max: 180 // 3 minutes for most accounts
      }
    };
  }

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('TikTok access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate token by getting user info
      const response = await fetch(`${this.apiBaseUrl}/user/info/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: ['open_id', 'union_id', 'avatar_url', 'display_name']
        })
      });
      
      if (!response.ok) {
        throw new Error(`TikTok authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      if (userData.error) {
        throw new Error(`TikTok API error: ${userData.error.message}`);
      }
      
      console.log(`TikTok authenticated for user: ${userData.data.display_name}`);
      return true;
    } catch (error) {
      console.error('TikTok authentication error:', error);
      return false;
    }
  }

  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('TikTok not authenticated');
      }

      // TikTok requires video content
      if (!content.videos || content.videos.length === 0) {
        throw new Error('TikTok requires video content');
      }

      // Upload video first
      const videoUploadResult = await this.uploadVideo(content.videos[0]);
      if (!videoUploadResult.success) {
        throw new Error(`Video upload failed: ${videoUploadResult.error}`);
      }

      // Create post with uploaded video
      const postData = {
        video_id: videoUploadResult.videoId,
        text: content.content,
        privacy_level: 'MUTUAL_FOLLOW_FRIEND', // or 'PUBLIC_TO_EVERYONE'
        comment_disabled: false,
        duet_disabled: false,
        stitch_disabled: false
      };

      const response = await fetch(`${this.apiBaseUrl}/post/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error?.message || 'Failed to publish to TikTok');
      }

      return {
        success: true,
        platformPostId: result.data.publish_id,
        url: `https://www.tiktok.com/@username/video/${result.data.publish_id}`, // Placeholder URL
        metadata: {
          videoId: videoUploadResult.videoId,
          publishId: result.data.publish_id
        }
      };
    } catch (error) {
      console.error('TikTok publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async uploadVideo(videoUrl: string): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      // First, initiate video upload
      const initResponse = await fetch(`${this.apiBaseUrl}/post/publish/video/init/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: 0, // Will be determined during upload
            chunk_size: 10000000, // 10MB chunks
            total_chunk_count: 1
          }
        })
      });

      const initResult = await initResponse.json();
      if (!initResponse.ok || initResult.error) {
        throw new Error(initResult.error?.message || 'Failed to initialize video upload');
      }

      const uploadUrl = initResult.data.upload_url;
      const publishId = initResult.data.publish_id;

      // Upload video file (simplified - in production, handle chunked upload)
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: videoBlob,
        headers: {
          'Content-Type': 'video/mp4'
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video file');
      }

      return {
        success: true,
        videoId: publishId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video upload failed'
      };
    }
  }

  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const capabilities = this.getCapabilities();
    let content = originalContent.excerpt || originalContent.content.substring(0, 500);
    const warnings: string[] = [];

    // TikTok is video-first, so we need to create engaging video captions
    if (content.length > capabilities.maxContentLength) {
      content = content.substring(0, capabilities.maxContentLength - 3) + '...';
      warnings.push('Content was truncated to fit TikTok\'s character limit');
    }

    // Extract and optimize hashtags for TikTok
    const hashtags = await this.generateTikTokHashtags(originalContent);
    
    // Add trending hashtags if space allows
    const hashtagString = hashtags.join(' ');
    if (content.length + hashtagString.length + 2 <= capabilities.maxContentLength) {
      content += '\n\n' + hashtagString;
    } else {
      warnings.push('Some hashtags were omitted due to character limit');
    }

    // TikTok requires video content
    if (!originalContent.videos || originalContent.videos.length === 0) {
      warnings.push('TikTok requires video content. Consider creating a video version of your blog post.');
    }

    return {
      title: originalContent.title,
      content,
      hashtags,
      videos: originalContent.videos || [],
      metadata: { 
        warnings,
        requiresVideo: true,
        suggestedVideoLength: '15-60 seconds for maximum engagement'
      }
    };
  }

  private async generateTikTokHashtags(content: BlogPost): Promise<string[]> {
    // TikTok-specific hashtag generation
    const baseHashtags = ['#fyp', '#viral', '#trending'];
    const contentHashtags: string[] = [];

    // Extract keywords from title and content
    const text = (content.title + ' ' + content.content).toLowerCase();
    
    // Add relevant hashtags based on content
    if (text.includes('tech') || text.includes('technology')) {
      contentHashtags.push('#tech', '#technology', '#innovation');
    }
    if (text.includes('tutorial') || text.includes('how to')) {
      contentHashtags.push('#tutorial', '#howto', '#learn');
    }
    if (text.includes('tip') || text.includes('advice')) {
      contentHashtags.push('#tips', '#advice', '#lifehack');
    }

    // Combine and limit to reasonable number
    const allHashtags = [...baseHashtags, ...contentHashtags, ...(content.tags || []).map(tag => `#${tag.replace(/\s+/g, '').toLowerCase()}`)];
    return allHashtags.slice(0, 10); // Limit to 10 hashtags
  }

  async checkHealth(): Promise<PlatformStatus> {
    try {
      // Check TikTok API status
      const response = await fetch('https://open-api.tiktok.com/platform/oauth/connect/', {
        method: 'GET'
      });

      return {
        isOnline: response.ok,
        responseTime: response.ok ? 150 : undefined,
        lastChecked: new Date(),
        errorMessage: response.ok ? undefined : 'TikTok API not accessible'
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
    // TikTok has rate limits but they're not clearly documented
    // Implement conservative defaults
    return {
      remainingRequests: this.rateLimitRemaining || 100,
      resetTime: this.rateLimitResetTime
    };
  }
}
