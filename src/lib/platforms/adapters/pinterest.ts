import { BasePlatformAdapter } from '../base-adapter';
import { 
  BlogPost, 
  PublishResult, 
  PlatformCapabilities, 
  AuthCredentials 
} from '../types';

export class PinterestAdapter extends BasePlatformAdapter {
  platform = 'pinterest';
  displayName = 'Pinterest';
  category = 'social';
  
  private apiBaseUrl = 'https://api.pinterest.com/v5';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 500, // Pin description length
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: false, // Pinterest doesn't use hashtags
      supportsMentions: false,
      supportsScheduling: true,
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov', 'm4v'],
      maxImageSize: 32 * 1024 * 1024, // 32MB
      maxVideoSize: 2 * 1024 * 1024 * 1024, // 2GB
      maxImagesPerPost: 1,
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Pinterest access token is required');
      }

      // Verify token by getting user info
      const response = await fetch(
        `${this.apiBaseUrl}/user_account`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Invalid Pinterest access token');
      }

      const userData = await response.json();
      this.isAuthenticated = true;
      this.credentials = credentials;
      
      console.log(`Pinterest authenticated for user: ${userData.username}`);
      return true;
    } catch (error) {
      console.error('Pinterest authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async publishPost(post: BlogPost): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with Pinterest'
      };
    }

    try {
      // Pinterest requires an image for pins
      if (!post.featuredImage) {
        return {
          success: false,
          error: 'Pinterest pins require an image'
        };
      }

      const adaptedContent = await this.adaptContent(post);
      
      // Get default board ID (or use specified board)
      const boardId = this.credentials.boardId || await this.getDefaultBoardId();
      if (!boardId) {
        return {
          success: false,
          error: 'No Pinterest board available for posting'
        };
      }

      const pinData = {
        link: post.canonicalUrl || '',
        title: post.title,
        description: adaptedContent.content,
        media_source: {
          source_type: 'image_url',
          url: post.featuredImage
        },
        board_id: boardId
      };

      const response = await fetch(
        `${this.apiBaseUrl}/pins`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pinData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create Pinterest pin');
      }

      const result = await response.json();
      
      return {
        success: true,
        platformPostId: result.id,
        url: `https://pinterest.com/pin/${result.id}`,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      console.error('Pinterest publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async schedulePost(post: BlogPost, publishAt: Date): Promise<PublishResult> {
    // Pinterest API doesn't support direct scheduling
    // This would typically be handled by Pinterest Business tools or third-party services
    return {
      success: false,
      error: 'Pinterest scheduling requires Pinterest Business tools or third-party integration'
    };
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/pins/${platformPostId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Pinterest delete error:', error);
      return false;
    }
  }

  async getAnalytics(platformPostId: string): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/pins/${platformPostId}/analytics?metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Pinterest analytics');
      }

      const data = await response.json();
      
      return {
        impressions: data.all_time?.IMPRESSION || 0,
        saves: data.all_time?.SAVE || 0,
        pinClicks: data.all_time?.PIN_CLICK || 0,
        outboundClicks: data.all_time?.OUTBOUND_CLICK || 0,
        platform: 'pinterest',
        postId: platformPostId,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Pinterest analytics error:', error);
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
      warnings.push(`Content truncated to ${maxLength} characters for Pinterest`);
    }

    // Pinterest doesn't use hashtags, but we can include keywords naturally
    if (post.tags && post.tags.length > 0) {
      const keywords = post.tags.join(', ');
      content += `\n\nTopics: ${keywords}`;
    }

    return { content, warnings };
  }

  private async getDefaultBoardId(): Promise<string | null> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/boards?page_size=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.items?.[0]?.id || null;
    } catch (error) {
      console.error('Pinterest board fetch error:', error);
      return null;
    }
  }

  // Pinterest-specific methods
  async getBoards(): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/boards`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Pinterest boards error:', error);
      return [];
    }
  }

  async createBoard(name: string, description?: string): Promise<{ success: boolean; boardId?: string }> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return { success: false };
    }

    try {
      const boardData = {
        name,
        description: description || '',
        privacy: 'PUBLIC'
      };

      const response = await fetch(
        `${this.apiBaseUrl}/boards`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(boardData)
        }
      );

      if (!response.ok) {
        return { success: false };
      }

      const result = await response.json();
      return { success: true, boardId: result.id };
    } catch (error) {
      console.error('Pinterest create board error:', error);
      return { success: false };
    }
  }

  async searchPins(query: string, limit: number = 10): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/search/pins?query=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Pinterest search error:', error);
      return [];
    }
  }

  async getBoardSections(boardId: string): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/boards/${boardId}/sections`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Pinterest board sections error:', error);
      return [];
    }
  }
}
