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

export class GitHubAdapter extends BasePlatformAdapter {
  platform = 'github';
  displayName = 'GitHub';
  category = 'developer' as const;
  
  private apiBaseUrl = 'https://api.github.com';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('GitHub access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate the token by getting user info
      const response = await fetch(`${this.apiBaseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BlogPlatform/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`GitHub authenticated for user: ${userData.login}`);
      
      return true;
    } catch (error) {
      console.error('GitHub authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('GitHub not authenticated');
      }

      // For GitHub, we'll create a gist or repository issue/discussion
      // This example creates a gist
      const gistData = {
        description: content.title,
        public: true,
        files: {
          [`${this.slugify(content.title)}.md`]: {
            content: this.formatContentForGitHub(content)
          }
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/gists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'BlogPlatform/1.0'
        },
        body: JSON.stringify(gistData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub publish failed: ${errorData.message || response.status}`);
      }

      const gistResult = await response.json();

      return {
        success: true,
        platformPostId: gistResult.id,
        platformUrl: gistResult.html_url,
        publishedAt: new Date(gistResult.created_at),
        metadata: {
          gistId: gistResult.id,
          nodeId: gistResult.node_id,
          gitPullUrl: gistResult.git_pull_url,
          gitPushUrl: gistResult.git_push_url
        }
      };
    } catch (error) {
      console.error('GitHub publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updatePost(platformPostId: string, content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('GitHub not authenticated');
      }

      const gistData = {
        description: content.title,
        files: {
          [`${this.slugify(content.title)}.md`]: {
            content: this.formatContentForGitHub(content)
          }
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/gists/${platformPostId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'BlogPlatform/1.0'
        },
        body: JSON.stringify(gistData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub update failed: ${errorData.message || response.status}`);
      }

      const gistResult = await response.json();

      return {
        success: true,
        platformPostId: gistResult.id,
        platformUrl: gistResult.html_url,
        publishedAt: new Date(gistResult.updated_at),
        metadata: {
          gistId: gistResult.id,
          nodeId: gistResult.node_id
        }
      };
    } catch (error) {
      console.error('GitHub update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('GitHub not authenticated');
      }

      const response = await fetch(`${this.apiBaseUrl}/gists/${platformPostId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BlogPlatform/1.0'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('GitHub delete error:', error);
      return false;
    }
  }

  async getPostMetrics(platformPostId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('GitHub not authenticated');
      }

      const response = await fetch(`${this.apiBaseUrl}/gists/${platformPostId}`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BlogPlatform/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch gist metrics: ${response.status}`);
      }

      const gist = await response.json();

      // Get comments for the gist
      const commentsResponse = await fetch(`${this.apiBaseUrl}/gists/${platformPostId}/comments`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BlogPlatform/1.0'
        }
      });

      const comments = commentsResponse.ok ? await commentsResponse.json() : [];

      return {
        views: 0, // GitHub doesn't provide view counts for gists
        likes: 0, // GitHub doesn't have likes for gists
        comments: comments.length,
        shares: 0, // GitHub doesn't track shares
        followers: 0,
        impressions: 0,
        engagementRate: 0,
        clickThroughRate: 0,
        platformSpecific: {
          forks: Object.keys(gist.forks || {}).length,
          stars: 0, // Gists don't have stars
          watchers: 0
        }
      };
    } catch (error) {
      console.error('GitHub metrics error:', error);
      return this.getDefaultMetrics();
    }
  }

  async getStatus(): Promise<PlatformStatus> {
    try {
      const response = await fetch('https://www.githubstatus.com/api/v2/status.json');
      const statusData = await response.json();
      
      return {
        isOperational: statusData.status.indicator === 'none',
        lastChecked: new Date(),
        issues: statusData.status.indicator !== 'none' ? [statusData.status.description] : []
      };
    } catch (error) {
      return {
        isOperational: true,
        lastChecked: new Date(),
        issues: []
      };
    }
  }

  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 1000000, // GitHub gists can be quite large
      supportsImages: false, // Gists don't support embedded images
      supportsVideo: false,
      supportsHashtags: false,
      supportsMentions: false,
      supportsScheduling: false,
      supportsMarkdown: true,
      supportsHTMLTags: [],
      imageFormats: [],
      videoFormats: [],
      maxImageSize: 0,
      maxVideoSize: 0,
      maxImagesPerPost: 0,
      maxVideosPerPost: 0
    };
  }

  private formatContentForGitHub(content: AdaptedContent): string {
    let formattedContent = `# ${content.title}\n\n`;
    
    if (content.excerpt) {
      formattedContent += `${content.excerpt}\n\n`;
    }
    
    formattedContent += content.content;
    
    if (content.hashtags && content.hashtags.length > 0) {
      formattedContent += `\n\n---\n\n**Tags:** ${content.hashtags.map(tag => `\`${tag}\``).join(', ')}`;
    }
    
    if (content.metadata?.originalUrl) {
      formattedContent += `\n\n**Original Post:** ${content.metadata.originalUrl}`;
    }
    
    return formattedContent;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
