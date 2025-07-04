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

export class HashnodeAdapter extends BasePlatformAdapter {
  platform = 'hashnode';
  displayName = 'Hashnode';
  category = 'blogging' as const;
  
  private apiBaseUrl = 'https://gql.hashnode.com';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Hashnode access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate the token by getting user info
      const query = `
        query {
          me {
            id
            username
            name
          }
        }
      `;

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': credentials.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Hashnode authentication failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`Hashnode authentication failed: ${data.errors[0].message}`);
      }
      
      console.log(`Hashnode authenticated for user: ${data.data.me.username}`);
      
      return true;
    } catch (error) {
      console.error('Hashnode authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken || !this.credentials?.publicationId) {
        throw new Error('Hashnode not authenticated or publication ID missing');
      }

      const mutation = `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post {
              id
              slug
              url
              publishedAt
              title
            }
          }
        }
      `;

      const variables = {
        input: {
          title: content.title,
          contentMarkdown: this.formatContentForHashnode(content),
          tags: content.hashtags?.map(tag => ({ slug: this.slugify(tag), name: tag })) || [],
          publicationId: this.credentials.publicationId,
          subtitle: content.excerpt,
          coverImageOptions: content.images?.[0] ? {
            coverImageURL: content.images[0]
          } : undefined,
          originalArticleURL: content.metadata?.originalUrl,
          disableComments: false,
          publishedAt: new Date().toISOString()
        }
      };

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.credentials.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation, variables })
      });

      if (!response.ok) {
        throw new Error(`Hashnode publish failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`Hashnode publish failed: ${data.errors[0].message}`);
      }

      const post = data.data.publishPost.post;

      return {
        success: true,
        platformPostId: post.id,
        platformUrl: post.url,
        publishedAt: new Date(post.publishedAt),
        metadata: {
          postId: post.id,
          slug: post.slug,
          publicationId: this.credentials.publicationId
        }
      };
    } catch (error) {
      console.error('Hashnode publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updatePost(platformPostId: string, content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Hashnode not authenticated');
      }

      const mutation = `
        mutation UpdatePost($input: UpdatePostInput!) {
          updatePost(input: $input) {
            post {
              id
              slug
              url
              publishedAt
              title
            }
          }
        }
      `;

      const variables = {
        input: {
          id: platformPostId,
          title: content.title,
          contentMarkdown: this.formatContentForHashnode(content),
          tags: content.hashtags?.map(tag => ({ slug: this.slugify(tag), name: tag })) || [],
          subtitle: content.excerpt,
          coverImageOptions: content.images?.[0] ? {
            coverImageURL: content.images[0]
          } : undefined,
          originalArticleURL: content.metadata?.originalUrl
        }
      };

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.credentials.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation, variables })
      });

      if (!response.ok) {
        throw new Error(`Hashnode update failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`Hashnode update failed: ${data.errors[0].message}`);
      }

      const post = data.data.updatePost.post;

      return {
        success: true,
        platformPostId: post.id,
        platformUrl: post.url,
        publishedAt: new Date(post.publishedAt),
        metadata: {
          postId: post.id,
          slug: post.slug
        }
      };
    } catch (error) {
      console.error('Hashnode update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Hashnode not authenticated');
      }

      const mutation = `
        mutation RemovePost($input: RemovePostInput!) {
          removePost(input: $input) {
            post {
              id
            }
          }
        }
      `;

      const variables = {
        input: {
          id: platformPostId
        }
      };

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.credentials.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation, variables })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return !data.errors;
    } catch (error) {
      console.error('Hashnode delete error:', error);
      return false;
    }
  }

  async getPostMetrics(platformPostId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Hashnode not authenticated');
      }

      const query = `
        query GetPost($id: ObjectId!) {
          post(id: $id) {
            id
            views
            reactionCount
            responseCount
            readTimeInMinutes
            tags {
              name
              slug
            }
          }
        }
      `;

      const variables = {
        id: platformPostId
      };

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.credentials.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post metrics: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`Failed to fetch post metrics: ${data.errors[0].message}`);
      }

      const post = data.data.post;

      return {
        views: post.views || 0,
        likes: post.reactionCount || 0,
        comments: post.responseCount || 0,
        shares: 0, // Hashnode doesn't provide share counts
        followers: 0,
        impressions: post.views || 0,
        engagementRate: this.calculateEngagementRate(
          post.reactionCount || 0,
          post.responseCount || 0,
          post.views || 0
        ),
        clickThroughRate: 0,
        platformSpecific: {
          readTimeInMinutes: post.readTimeInMinutes,
          tags: post.tags?.map((tag: any) => tag.name) || []
        }
      };
    } catch (error) {
      console.error('Hashnode metrics error:', error);
      return this.getDefaultMetrics();
    }
  }

  async getStatus(): Promise<PlatformStatus> {
    try {
      const query = `
        query {
          me {
            id
          }
        }
      `;

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      return {
        isOperational: response.ok,
        lastChecked: new Date(),
        issues: response.ok ? [] : ['GraphQL API not responding']
      };
    } catch (error) {
      return {
        isOperational: false,
        lastChecked: new Date(),
        issues: ['Unable to reach Hashnode API']
      };
    }
  }

  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 100000, // Hashnode has generous content limits
      supportsImages: true,
      supportsVideo: false,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      supportsMarkdown: true,
      supportsHTMLTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      videoFormats: [],
      maxImageSize: 25 * 1024 * 1024, // 25MB
      maxVideoSize: 0,
      maxImagesPerPost: 20,
      maxVideosPerPost: 0
    };
  }

  private formatContentForHashnode(content: AdaptedContent): string {
    let formattedContent = content.content;
    
    // Hashnode uses markdown
    if (content.excerpt && !formattedContent.includes(content.excerpt)) {
      formattedContent = `${content.excerpt}\n\n${formattedContent}`;
    }
    
    // Add original URL if this is a cross-post
    if (content.metadata?.originalUrl) {
      formattedContent += `\n\n---\n\n*Originally published at [${content.metadata.originalUrl}](${content.metadata.originalUrl})*`;
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

  private calculateEngagementRate(likes: number, comments: number, views: number): number {
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  }
}
