import { BasePlatformAdapter } from '../base-adapter';
import { 
  PlatformCredentials, 
  AdaptedContent, 
  PostResult, 
  PlatformStatus, 
  PlatformCapabilities,
  BlogPost,
  PlatformMetrics
} from '../types';

export class DevToAdapter extends BasePlatformAdapter {
  platform = 'devto';
  displayName = 'Dev.to';
  category = 'blogging' as const;
  
  private apiBaseUrl = 'https://dev.to/api';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.apiKey) {
        throw new Error('Dev.to API key is required');
      }
      
      this.credentials = credentials;
      
      // Validate the API key by getting user info
      const response = await fetch(`${this.apiBaseUrl}/users/me`, {
        headers: {
          'api-key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Dev.to authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`Dev.to authenticated for user: ${userData.username}`);
      
      return true;
    } catch (error) {
      console.error('Dev.to authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.apiKey) {
        throw new Error('Dev.to not authenticated');
      }

      const articleData = {
        article: {
          title: content.title,
          published: true,
          body_markdown: this.formatContentForDevTo(content),
          tags: content.hashtags?.slice(0, 4) || [], // Dev.to allows max 4 tags
          series: undefined,
          canonical_url: content.metadata?.originalUrl,
          description: content.excerpt
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/articles`, {
        method: 'POST',
        headers: {
          'api-key': this.credentials.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Dev.to publish failed: ${errorData.error || response.status}`);
      }

      const articleResult = await response.json();

      return {
        success: true,
        platformPostId: articleResult.id.toString(),
        platformUrl: articleResult.url,
        publishedAt: new Date(articleResult.published_at),
        metadata: {
          articleId: articleResult.id,
          slug: articleResult.slug,
          path: articleResult.path,
          canonicalUrl: articleResult.canonical_url
        }
      };
    } catch (error) {
      console.error('Dev.to publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updatePost(platformPostId: string, content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.apiKey) {
        throw new Error('Dev.to not authenticated');
      }

      const articleData = {
        article: {
          title: content.title,
          body_markdown: this.formatContentForDevTo(content),
          tags: content.hashtags?.slice(0, 4) || [],
          canonical_url: content.metadata?.originalUrl,
          description: content.excerpt
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/articles/${platformPostId}`, {
        method: 'PUT',
        headers: {
          'api-key': this.credentials.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Dev.to update failed: ${errorData.error || response.status}`);
      }

      const articleResult = await response.json();

      return {
        success: true,
        platformPostId: articleResult.id.toString(),
        platformUrl: articleResult.url,
        publishedAt: new Date(articleResult.published_at),
        metadata: {
          articleId: articleResult.id,
          slug: articleResult.slug,
          path: articleResult.path
        }
      };
    } catch (error) {
      console.error('Dev.to update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    try {
      if (!this.credentials?.apiKey) {
        throw new Error('Dev.to not authenticated');
      }

      // Dev.to doesn't support deleting articles via API
      // We can only unpublish them
      const articleData = {
        article: {
          published: false
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/articles/${platformPostId}`, {
        method: 'PUT',
        headers: {
          'api-key': this.credentials.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      return response.ok;
    } catch (error) {
      console.error('Dev.to unpublish error:', error);
      return false;
    }
  }

  async getPostMetrics(platformPostId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.apiKey) {
        throw new Error('Dev.to not authenticated');
      }

      const response = await fetch(`${this.apiBaseUrl}/articles/${platformPostId}`, {
        headers: {
          'api-key': this.credentials.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch article metrics: ${response.status}`);
      }

      const article = await response.json();

      return {
        views: article.page_views_count || 0,
        likes: article.public_reactions_count || 0,
        comments: article.comments_count || 0,
        shares: 0, // Dev.to doesn't provide share counts
        followers: 0,
        impressions: article.page_views_count || 0,
        engagementRate: this.calculateEngagementRate(
          article.public_reactions_count || 0,
          article.comments_count || 0,
          article.page_views_count || 0
        ),
        clickThroughRate: 0,
        platformSpecific: {
          readingTimeMinutes: article.reading_time_minutes,
          tags: article.tag_list,
          series: article.series,
          organizationId: article.organization?.id
        }
      };
    } catch (error) {
      console.error('Dev.to metrics error:', error);
      return this.getDefaultMetrics();
    }
  }

  async getStatus(): Promise<PlatformStatus> {
    try {
      // Dev.to doesn't have a public status API, so we'll check if we can reach the API
      const response = await fetch(`${this.apiBaseUrl}/articles?per_page=1`);
      
      return {
        isOperational: response.ok,
        lastChecked: new Date(),
        issues: response.ok ? [] : ['API not responding']
      };
    } catch (error) {
      return {
        isOperational: false,
        lastChecked: new Date(),
        issues: ['Unable to reach Dev.to API']
      };
    }
  }

  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 100000, // Dev.to has generous content limits
      supportsImages: true,
      supportsVideo: false, // Dev.to doesn't support direct video uploads
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false, // Dev.to doesn't support scheduling via API
      supportsMarkdown: true,
      supportsHTMLTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      videoFormats: [],
      maxImageSize: 25 * 1024 * 1024, // 25MB
      maxVideoSize: 0,
      maxImagesPerPost: 50,
      maxVideosPerPost: 0
    };
  }

  private formatContentForDevTo(content: AdaptedContent): string {
    let formattedContent = content.content;
    
    // Dev.to uses markdown, so we need to ensure proper formatting
    if (!formattedContent.includes('# ') && !formattedContent.includes('## ')) {
      // Add some structure if the content doesn't have headers
      if (content.excerpt) {
        formattedContent = `${content.excerpt}\n\n${formattedContent}`;
      }
    }
    
    // Add cover image if available
    if (content.images && content.images.length > 0) {
      formattedContent = `![Cover Image](${content.images[0]})\n\n${formattedContent}`;
    }
    
    // Add tags as a footer if they exist
    if (content.hashtags && content.hashtags.length > 0) {
      formattedContent += `\n\n---\n\n*Tags: ${content.hashtags.map(tag => `#${tag}`).join(' ')}*`;
    }
    
    // Add original URL if this is a cross-post
    if (content.metadata?.originalUrl) {
      formattedContent += `\n\n---\n\n*Originally published at [${content.metadata.originalUrl}](${content.metadata.originalUrl})*`;
    }
    
    return formattedContent;
  }

  private calculateEngagementRate(likes: number, comments: number, views: number): number {
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  }
}
