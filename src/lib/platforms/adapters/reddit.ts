import { BasePlatformAdapter } from '../base-adapter';
import { 
  BlogPost, 
  PublishResult, 
  PlatformCapabilities, 
  AuthCredentials 
} from '../types';

export class RedditAdapter extends BasePlatformAdapter {
  platform = 'reddit';
  displayName = 'Reddit';
  category = 'community';
  
  private apiBaseUrl = 'https://oauth.reddit.com/api';
  private authUrl = 'https://www.reddit.com/api/v1/access_token';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 40000, // Self post content
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: false, // Reddit doesn't use hashtags
      supportsMentions: true, // u/username format
      supportsScheduling: false, // Reddit doesn't support scheduling
      supportsMarkdown: true,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov', 'webm'],
      maxImageSize: 20 * 1024 * 1024, // 20MB
      maxVideoSize: 1024 * 1024 * 1024, // 1GB
      maxImagesPerPost: 1,
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
        throw new Error('Reddit client ID, client secret, and refresh token are required');
      }

      // Get access token using refresh token
      const authResponse = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'UniversalBlogPlatform/1.0'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: credentials.refreshToken
        })
      });

      if (!authResponse.ok) {
        throw new Error('Failed to refresh Reddit access token');
      }

      const authData = await authResponse.json();
      
      // Verify token by getting user info
      const userResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
          'User-Agent': 'UniversalBlogPlatform/1.0'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Invalid Reddit access token');
      }

      const userData = await userResponse.json();
      this.isAuthenticated = true;
      this.credentials = {
        ...credentials,
        accessToken: authData.access_token
      };
      
      console.log(`Reddit authenticated for user: ${userData.name}`);
      return true;
    } catch (error) {
      console.error('Reddit authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async publishPost(post: BlogPost): Promise<PublishResult> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated with Reddit'
      };
    }

    try {
      const subreddit = this.credentials.subreddit || 'test';
      const adaptedContent = await this.adaptContent(post);
      
      let postData: any = {
        sr: subreddit,
        title: post.title,
        kind: 'self', // Text post
        text: adaptedContent.content,
        api_type: 'json'
      };

      // If there's a featured image, create a link post instead
      if (post.featuredImage) {
        postData = {
          sr: subreddit,
          title: post.title,
          kind: 'link',
          url: post.featuredImage,
          api_type: 'json'
        };
      }

      const response = await fetch(
        `${this.apiBaseUrl}/submit`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'UniversalBlogPlatform/1.0'
          },
          body: new URLSearchParams(postData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.json?.errors?.[0]?.[1] || 'Failed to submit Reddit post');
      }

      const result = await response.json();
      
      if (result.json?.errors && result.json.errors.length > 0) {
        throw new Error(result.json.errors[0][1]);
      }

      const postUrl = result.json?.data?.url;
      const postId = result.json?.data?.name;
      
      return {
        success: true,
        platformPostId: postId,
        url: postUrl,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      console.error('Reddit publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async schedulePost(post: BlogPost, publishAt: Date): Promise<PublishResult> {
    return {
      success: false,
      error: 'Reddit does not support post scheduling'
    };
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/del`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'UniversalBlogPlatform/1.0'
          },
          body: new URLSearchParams({
            id: platformPostId
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Reddit delete error:', error);
      return false;
    }
  }

  async getAnalytics(platformPostId: string): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return null;
    }

    try {
      // Get post info
      const response = await fetch(
        `https://oauth.reddit.com/by_id/${platformPostId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'User-Agent': 'UniversalBlogPlatform/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Reddit post analytics');
      }

      const data = await response.json();
      
      if (!data.data?.children || data.data.children.length === 0) {
        return null;
      }

      const postData = data.data.children[0].data;
      
      return {
        upvotes: postData.ups || 0,
        downvotes: postData.downs || 0,
        score: postData.score || 0,
        comments: postData.num_comments || 0,
        upvoteRatio: postData.upvote_ratio || 0,
        awards: postData.total_awards_received || 0,
        platform: 'reddit',
        postId: platformPostId,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Reddit analytics error:', error);
      return null;
    }
  }

  private async adaptContent(post: BlogPost): Promise<{
    content: string;
    warnings: string[];
  }> {
    const warnings: string[] = [];
    let content = post.content;

    // Reddit supports Markdown, so we can keep some formatting
    // Convert HTML to Markdown-like format
    content = content
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags

    // Truncate if too long
    const maxLength = this.getCapabilities().maxContentLength;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
      warnings.push(`Content truncated to ${maxLength} characters for Reddit`);
    }

    // Add source link if available
    if (post.canonicalUrl) {
      content += `\n\n---\n\n[Read the full article](${post.canonicalUrl})`;
    }

    // Add author credit
    if (post.author?.name) {
      content += `\n\nBy ${post.author.name}`;
    }

    return { content, warnings };
  }

  // Reddit-specific methods
  async getSubreddits(): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return [];
    }

    try {
      const response = await fetch(
        'https://oauth.reddit.com/subreddits/mine/subscriber',
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'User-Agent': 'UniversalBlogPlatform/1.0'
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data?.children?.map(child => child.data) || [];
    } catch (error) {
      console.error('Reddit subreddits error:', error);
      return [];
    }
  }

  async searchSubreddits(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: {
            'User-Agent': 'UniversalBlogPlatform/1.0'
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data?.children?.map(child => child.data) || [];
    } catch (error) {
      console.error('Reddit search error:', error);
      return [];
    }
  }

  async getSubredditRules(subreddit: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/about/rules.json`,
        {
          headers: {
            'User-Agent': 'UniversalBlogPlatform/1.0'
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.rules || [];
    } catch (error) {
      console.error('Reddit rules error:', error);
      return [];
    }
  }

  async checkSubredditPermissions(subreddit: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/about`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'User-Agent': 'UniversalBlogPlatform/1.0'
          }
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return !data.data?.user_is_banned && data.data?.can_assign_user_flair !== false;
    } catch (error) {
      console.error('Reddit permissions error:', error);
      return false;
    }
  }
}
