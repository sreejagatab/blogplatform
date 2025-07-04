import { BasePlatformAdapter } from '../base-adapter';
import {
  BlogPost,
  PlatformCredentials,
  AdaptedContent,
  PostResult,
  PlatformCapabilities,
  PlatformStatus
} from '../types';

export class FacebookAdapter extends BasePlatformAdapter {
  platform = 'facebook';
  displayName = 'Facebook';
  category = 'social' as const;
  
  private apiBaseUrl = 'https://graph.facebook.com/v18.0';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 63206,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: ['b', 'i', 'u', 'a'],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov', 'avi'],
      maxImageSize: 4 * 1024 * 1024, // 4MB
      maxVideoSize: 1024 * 1024 * 1024, // 1GB
      maxImagesPerPost: 10,
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Facebook access token is required');
      }

      // Verify token by getting user info
      const response = await fetch(
        `${this.apiBaseUrl}/me?access_token=${credentials.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Invalid Facebook access token');
      }

      const userData = await response.json();
      this.credentials = credentials;
      
      console.log(`Facebook authenticated for user: ${userData.name}`);
      return true;
    } catch (error) {
      console.error('Facebook authentication failed:', error);
      return false;
    }
  }

  async publishPost(content: AdaptedContent): Promise<PostResult> {
    if (!this.credentials?.accessToken) {
      return {
        success: false,
        errorMessage: 'Not authenticated with Facebook'
      };
    }

    try {
      // Prepare post data
      const postData: any = {
        message: content.content,
        access_token: this.credentials.accessToken
      };

      // Add image if present
      if (content.images && content.images.length > 0) {
        postData.link = content.images[0];
      }

      // Publish to Facebook Page (requires page access token)
      const pageId = this.credentials.pageId || 'me';
      const response = await fetch(
        `${this.apiBaseUrl}/${pageId}/feed`,
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
        throw new Error(error.error?.message || 'Failed to publish to Facebook');
      }

      const result = await response.json();
      
      return {
        success: true,
        platformPostId: result.id,
        platformUrl: `https://facebook.com/${result.id}`
      };
    } catch (error) {
      console.error('Facebook publish error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }



  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const warnings: string[] = [];
    let content = originalContent.content;

    // Remove HTML tags (Facebook doesn't support rich formatting in posts)
    content = content.replace(/<[^>]*>/g, '');

    // Truncate if too long
    const maxLength = this.getCapabilities().maxContentLength;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
      warnings.push(`Content truncated to ${maxLength} characters for Facebook`);
    }

    // Add hashtags if present
    let hashtags: string[] = [];
    if (originalContent.tags && originalContent.tags.length > 0) {
      hashtags = originalContent.tags.map(tag => `#${tag.replace(/\s+/g, '')}`);
      content += `\n\n${hashtags.join(' ')}`;
    }

    // Add call-to-action
    if (originalContent.canonicalUrl) {
      content += `\n\nRead more: ${originalContent.canonicalUrl}`;
    }

    return {
      title: originalContent.title,
      content,
      hashtags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: { warnings }
    };
  }

  async checkHealth(): Promise<PlatformStatus> {
    try {
      const response = await fetch('https://graph.facebook.com/v18.0/', {
        method: 'GET'
      });

      return {
        isOnline: response.ok,
        responseTime: response.ok ? 100 : undefined,
        lastChecked: new Date(),
        errorMessage: response.ok ? undefined : 'Facebook API not accessible'
      };
    } catch (error) {
      return {
        isOnline: false,
        lastChecked: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
