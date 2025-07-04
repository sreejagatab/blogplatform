import { BasePlatformAdapter } from '../base-adapter';
import { 
  BlogPost, 
  PublishResult, 
  PlatformCapabilities, 
  AuthCredentials 
} from '../types';

export class InstagramAdapter extends BasePlatformAdapter {
  platform = 'instagram';
  displayName = 'Instagram';
  category = 'social' as const;
  
  private apiBaseUrl = 'https://graph.facebook.com/v18.0';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 2200,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png'],
      videoFormats: ['mp4', 'mov'],
      maxImageSize: 8 * 1024 * 1024, // 8MB
      maxVideoSize: 100 * 1024 * 1024, // 100MB
      maxImagesPerPost: 10, // Carousel posts
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken || !credentials.instagramBusinessAccountId) {
        throw new Error('Instagram access token and business account ID are required');
      }

      // Verify Instagram Business Account
      const response = await fetch(
        `${this.apiBaseUrl}/${credentials.instagramBusinessAccountId}?fields=id,username&access_token=${credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Invalid Instagram credentials');
      }

      const accountData = await response.json();
      this.isAuthenticated = true;
      this.credentials = credentials;
      
      console.log(`Instagram authenticated for account: ${accountData.username}`);
      return true;
    } catch (error) {
      console.error('Instagram authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async publishPost(post: BlogPost): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with Instagram'
      };
    }

    try {
      // Instagram requires an image for posts
      if (!post.featuredImage) {
        return {
          success: false,
          error: 'Instagram posts require an image'
        };
      }

      const adaptedContent = await this.adaptContent(post);
      
      // Step 1: Create media container
      const containerResponse = await fetch(
        `${this.apiBaseUrl}/${this.credentials.instagramBusinessAccountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: post.featuredImage,
            caption: adaptedContent.content,
            access_token: this.credentials.accessToken
          })
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create Instagram media container');
      }

      const containerResult = await containerResponse.json();
      
      // Step 2: Publish the media container
      const publishResponse = await fetch(
        `${this.apiBaseUrl}/${this.credentials.instagramBusinessAccountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: containerResult.id,
            access_token: this.credentials.accessToken
          })
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(error.error?.message || 'Failed to publish Instagram post');
      }

      const publishResult = await publishResponse.json();
      
      return {
        success: true,
        platformPostId: publishResult.id,
        url: `https://instagram.com/p/${publishResult.id}`,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      console.error('Instagram publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async schedulePost(post: BlogPost, publishAt: Date): Promise<PublishResult> {
    // Instagram Basic Display API doesn't support scheduling directly
    // This would typically be handled by a third-party service or Meta Business Suite
    return {
      success: false,
      error: 'Instagram scheduling requires Meta Business Suite integration'
    };
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/${platformPostId}?access_token=${this.credentials.accessToken}`,
        {
          method: 'DELETE'
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Instagram delete error:', error);
      return false;
    }
  }

  async getAnalytics(platformPostId: string): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/${platformPostId}/insights?metric=impressions,reach,likes,comments,saves,shares&access_token=${this.credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram analytics');
      }

      const data = await response.json();
      
      const metrics = {};
      data.data.forEach(metric => {
        metrics[metric.name] = metric.values[0]?.value || 0;
      });
      
      return {
        impressions: metrics.impressions || 0,
        reach: metrics.reach || 0,
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        saves: metrics.saves || 0,
        shares: metrics.shares || 0,
        platform: 'instagram',
        postId: platformPostId,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Instagram analytics error:', error);
      return null;
    }
  }

  private async adaptContent(post: BlogPost): Promise<{
    content: string;
    warnings: string[];
  }> {
    const warnings: string[] = [];
    let content = post.excerpt || post.content;

    // Remove HTML tags
    content = content.replace(/<[^>]*>/g, '');

    // Truncate if too long
    const maxLength = this.getCapabilities().maxContentLength;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
      warnings.push(`Content truncated to ${maxLength} characters for Instagram`);
    }

    // Add hashtags (Instagram supports up to 30 hashtags)
    if (post.tags && post.tags.length > 0) {
      const hashtags = post.tags
        .slice(0, 30) // Limit to 30 hashtags
        .map(tag => `#${tag.replace(/\s+/g, '').toLowerCase()}`)
        .join(' ');
      
      content += `\n\n${hashtags}`;
    }

    // Add mention to author if available
    if (post.author?.instagram) {
      content += `\n\nBy @${post.author.instagram}`;
    }

    return { content, warnings };
  }

  // Instagram-specific methods
  async createCarouselPost(images: string[], caption: string): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with Instagram'
      };
    }

    try {
      // Create media containers for each image
      const containerIds = [];
      
      for (const imageUrl of images) {
        const containerResponse = await fetch(
          `${this.apiBaseUrl}/${this.credentials.instagramBusinessAccountId}/media`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_url: imageUrl,
              is_carousel_item: true,
              access_token: this.credentials.accessToken
            })
          }
        );

        if (!containerResponse.ok) {
          throw new Error('Failed to create carousel item');
        }

        const containerResult = await containerResponse.json();
        containerIds.push(containerResult.id);
      }

      // Create carousel container
      const carouselResponse = await fetch(
        `${this.apiBaseUrl}/${this.credentials.instagramBusinessAccountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            media_type: 'CAROUSEL',
            children: containerIds.join(','),
            caption: caption,
            access_token: this.credentials.accessToken
          })
        }
      );

      if (!carouselResponse.ok) {
        throw new Error('Failed to create carousel container');
      }

      const carouselResult = await carouselResponse.json();

      // Publish carousel
      const publishResponse = await fetch(
        `${this.apiBaseUrl}/${this.credentials.instagramBusinessAccountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: carouselResult.id,
            access_token: this.credentials.accessToken
          })
        }
      );

      if (!publishResponse.ok) {
        throw new Error('Failed to publish carousel');
      }

      const publishResult = await publishResponse.json();
      
      return {
        success: true,
        platformPostId: publishResult.id,
        url: `https://instagram.com/p/${publishResult.id}`
      };
    } catch (error) {
      console.error('Instagram carousel error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
