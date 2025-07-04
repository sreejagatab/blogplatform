import { BasePlatformAdapter } from '../base-adapter';
import { 
  BlogPost, 
  PublishResult, 
  PlatformCapabilities, 
  AuthCredentials 
} from '../types';

export class YouTubeAdapter extends BasePlatformAdapter {
  platform = 'youtube';
  displayName = 'YouTube';
  category = 'social';
  
  private apiBaseUrl = 'https://www.googleapis.com/youtube/v3';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 5000, // Description length
      supportsImages: true, // Thumbnails
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: false,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      videoFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
      maxImageSize: 2 * 1024 * 1024, // 2MB for thumbnails
      maxVideoSize: 256 * 1024 * 1024 * 1024, // 256GB
      maxImagesPerPost: 1, // One thumbnail
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('YouTube access token is required');
      }

      // Verify token by getting channel info
      const response = await fetch(
        `${this.apiBaseUrl}/channels?part=snippet&mine=true&access_token=${credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Invalid YouTube access token');
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        throw new Error('No YouTube channel found for this account');
      }

      this.isAuthenticated = true;
      this.credentials = credentials;
      
      console.log(`YouTube authenticated for channel: ${data.items[0].snippet.title}`);
      return true;
    } catch (error) {
      console.error('YouTube authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async publishPost(post: BlogPost): Promise<PublishResult> {
    // YouTube doesn't support direct text posts
    // This would typically create a community post or video description
    return this.createCommunityPost(post);
  }

  async createCommunityPost(post: BlogPost): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with YouTube'
      };
    }

    try {
      const adaptedContent = await this.adaptContent(post);
      
      // YouTube Community Posts API (requires channel verification)
      const postData = {
        snippet: {
          text: adaptedContent.content
        }
      };

      // Add image if present
      if (post.featuredImage) {
        // First upload the image
        const imageUploadResponse = await this.uploadImage(post.featuredImage);
        if (imageUploadResponse.success) {
          postData.snippet.image = {
            url: imageUploadResponse.url
          };
        }
      }

      const response = await fetch(
        `${this.apiBaseUrl}/communityPosts?part=snippet&access_token=${this.credentials.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create YouTube community post');
      }

      const result = await response.json();
      
      return {
        success: true,
        platformPostId: result.id,
        url: `https://youtube.com/post/${result.id}`,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      console.error('YouTube community post error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Community posts may not be available for this channel'
      };
    }
  }

  async uploadVideo(videoFile: File, post: BlogPost): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with YouTube'
      };
    }

    try {
      const adaptedContent = await this.adaptContent(post);
      
      // Step 1: Initialize upload
      const metadata = {
        snippet: {
          title: post.title,
          description: adaptedContent.content,
          tags: post.tags,
          categoryId: '22', // People & Blogs category
          defaultLanguage: 'en'
        },
        status: {
          privacyStatus: 'public', // or 'private', 'unlisted'
          selfDeclaredMadeForKids: false
        }
      };

      const initResponse = await fetch(
        `${this.apiBaseUrl}/videos?uploadType=resumable&part=snippet,status&access_token=${this.credentials.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Upload-Content-Length': videoFile.size.toString(),
            'X-Upload-Content-Type': videoFile.type
          },
          body: JSON.stringify(metadata)
        }
      );

      if (!initResponse.ok) {
        throw new Error('Failed to initialize video upload');
      }

      const uploadUrl = initResponse.headers.get('Location');
      if (!uploadUrl) {
        throw new Error('No upload URL received');
      }

      // Step 2: Upload video file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': videoFile.type
        },
        body: videoFile
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video file');
      }

      const result = await uploadResponse.json();
      
      return {
        success: true,
        platformPostId: result.id,
        url: `https://youtube.com/watch?v=${result.id}`,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      console.error('YouTube video upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async schedulePost(post: BlogPost, publishAt: Date): Promise<PublishResult> {
    // For community posts, scheduling isn't directly supported
    // For videos, you would set the publishAt time in the video metadata
    return {
      success: false,
      error: 'YouTube community post scheduling not supported. Use video scheduling instead.'
    };
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return false;
    }

    try {
      // For community posts
      const response = await fetch(
        `${this.apiBaseUrl}/communityPosts?id=${platformPostId}&access_token=${this.credentials.accessToken}`,
        {
          method: 'DELETE'
        }
      );

      return response.ok;
    } catch (error) {
      console.error('YouTube delete error:', error);
      return false;
    }
  }

  async getAnalytics(platformPostId: string): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      // YouTube Analytics API requires separate setup
      const response = await fetch(
        `${this.apiBaseUrl}/videos?part=statistics&id=${platformPostId}&access_token=${this.credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch YouTube analytics');
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return null;
      }

      const stats = data.items[0].statistics;
      
      return {
        views: parseInt(stats.viewCount) || 0,
        likes: parseInt(stats.likeCount) || 0,
        comments: parseInt(stats.commentCount) || 0,
        favorites: parseInt(stats.favoriteCount) || 0,
        platform: 'youtube',
        postId: platformPostId,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('YouTube analytics error:', error);
      return null;
    }
  }

  private async adaptContent(post: BlogPost): Promise<{
    content: string;
    warnings: string[];
  }> {
    const warnings: string[] = [];
    let content = post.content;

    // Remove HTML tags
    content = content.replace(/<[^>]*>/g, '');

    // Truncate if too long
    const maxLength = this.getCapabilities().maxContentLength;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
      warnings.push(`Content truncated to ${maxLength} characters for YouTube`);
    }

    // Add hashtags (YouTube supports hashtags in descriptions)
    if (post.tags && post.tags.length > 0) {
      const hashtags = post.tags
        .slice(0, 15) // YouTube recommends max 15 hashtags
        .map(tag => `#${tag.replace(/\s+/g, '')}`)
        .join(' ');
      
      content += `\n\n${hashtags}`;
    }

    // Add call-to-action
    if (post.canonicalUrl) {
      content += `\n\nRead the full article: ${post.canonicalUrl}`;
    }

    return { content, warnings };
  }

  private async uploadImage(imageUrl: string): Promise<{ success: boolean; url?: string }> {
    try {
      // This would typically involve uploading to YouTube's image service
      // For now, we'll return the original URL
      return { success: true, url: imageUrl };
    } catch (error) {
      console.error('YouTube image upload error:', error);
      return { success: false };
    }
  }

  // YouTube-specific methods
  async getChannelInfo(): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/channels?part=snippet,statistics&mine=true&access_token=${this.credentials.accessToken}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.items?.[0] || null;
    } catch (error) {
      console.error('YouTube channel info error:', error);
      return null;
    }
  }

  async getVideoCategories(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/videoCategories?part=snippet&regionCode=US&access_token=${this.credentials?.accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('YouTube categories error:', error);
      return [];
    }
  }
}
