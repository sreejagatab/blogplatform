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

export class LinkedInAdapter extends BasePlatformAdapter {
  platform = 'linkedin';
  displayName = 'LinkedIn';
  category = 'professional' as const;
  
  private apiBaseUrl = 'https://api.linkedin.com/v2';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('LinkedIn access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate the token by making a test API call
      const response = await fetch(`${this.apiBaseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`LinkedIn authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`LinkedIn authenticated for user: ${userData.localizedFirstName} ${userData.localizedLastName}`);
      
      return true;
    } catch (error) {
      console.error('LinkedIn authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('LinkedIn not authenticated');
      }
      
      await this.waitForRateLimit();
      
      // Get user profile ID first
      const profileResponse = await fetch(`${this.apiBaseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to get LinkedIn profile');
      }
      
      const profile = await profileResponse.json();
      const authorId = `urn:li:person:${profile.id}`;
      
      // Prepare post data
      const postData = {
        author: authorId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: this.formatContentForLinkedIn(content)
            },
            shareMediaCategory: content.images && content.images.length > 0 ? 'IMAGE' : 'NONE',
            ...(content.images && content.images.length > 0 && {
              media: content.images.slice(0, 1).map(imageUrl => ({
                status: 'READY',
                description: {
                  text: content.title
                },
                media: imageUrl,
                title: {
                  text: content.title
                }
              }))
            })
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };
      
      // Post to LinkedIn
      const response = await fetch(`${this.apiBaseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      });
      
      // Update rate limits from response headers
      const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      const resetTime = new Date(Date.now() + 60 * 60 * 1000); // Reset in 1 hour
      this.updateRateLimit(remaining, resetTime);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`LinkedIn API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const result = await response.json();
      const postId = result.id;
      
      return {
        success: true,
        platformPostId: postId,
        platformUrl: `https://www.linkedin.com/feed/update/${postId}`,
        metadata: {
          authorId,
          hasMedia: content.images && content.images.length > 0
        }
      };
      
    } catch (error) {
      return this.handleApiError(error, 'publish post');
    }
  }
  
  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const capabilities = this.getCapabilities();
    
    // Generate LinkedIn-optimized title and content
    let adaptedTitle = originalContent.title;
    let adaptedContent = `${adaptedTitle}\n\n`;
    
    // Add excerpt or first paragraph
    if (originalContent.excerpt) {
      adaptedContent += originalContent.excerpt;
    } else {
      const firstParagraph = this.extractPlainText(originalContent.content).split('\n')[0];
      adaptedContent += firstParagraph;
    }
    
    // Add call-to-action
    adaptedContent += '\n\nRead the full article: [Link in comments]';
    
    // Generate hashtags
    const hashtags = await this.generateLinkedInHashtags(originalContent);
    if (hashtags.length > 0) {
      adaptedContent += '\n\n' + hashtags.map(tag => `#${tag}`).join(' ');
    }
    
    // Truncate if necessary
    adaptedContent = this.truncateText(adaptedContent, capabilities.maxContentLength - 100);
    
    return {
      title: adaptedTitle,
      content: adaptedContent,
      hashtags: hashtags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: {
        originalUrl: originalContent.canonicalUrl,
        category: originalContent.category?.name,
        tags: originalContent.tags
      }
    };
  }
  
  private async generateLinkedInHashtags(post: BlogPost): Promise<string[]> {
    const hashtags: string[] = [];
    
    // Add category as hashtag
    if (post.category?.name) {
      hashtags.push(post.category.name.replace(/\s+/g, ''));
    }
    
    // Add relevant tags
    post.tags.forEach(tag => {
      const cleanTag = tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      if (cleanTag.length > 2) {
        hashtags.push(cleanTag);
      }
    });
    
    // Add professional hashtags
    const professionalTags = ['Leadership', 'Innovation', 'Technology', 'Business', 'Growth'];
    hashtags.push(...professionalTags.slice(0, 2));
    
    return hashtags.slice(0, 5); // LinkedIn recommends 3-5 hashtags
  }
  
  private formatContentForLinkedIn(content: AdaptedContent): string {
    let formatted = content.content;
    
    // Ensure proper line breaks
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Add LinkedIn-style formatting
    if (content.hashtags && content.hashtags.length > 0) {
      const hashtagString = content.hashtags.map(tag => `#${tag}`).join(' ');
      if (!formatted.includes(hashtagString)) {
        formatted += `\n\n${hashtagString}`;
      }
    }
    
    return formatted;
  }
  
  async getPostMetrics(postId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('LinkedIn not authenticated');
      }
      
      // Get post statistics
      const response = await fetch(`${this.apiBaseUrl}/socialActions/${postId}`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get LinkedIn metrics');
      }
      
      const metrics = await response.json();
      
      return {
        likes: metrics.numLikes || 0,
        comments: metrics.numComments || 0,
        shares: metrics.numShares || 0,
        views: metrics.numViews || 0
      };
      
    } catch (error) {
      console.error('Error fetching LinkedIn metrics:', error);
      return {};
    }
  }
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 3000,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false, // LinkedIn API doesn't support scheduling directly
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif'],
      videoFormats: ['mp4', 'mov', 'avi'],
      maxImageSize: 5 * 1024 * 1024, // 5MB
      maxVideoSize: 200 * 1024 * 1024, // 200MB
      maxImagesPerPost: 1,
      maxVideosPerPost: 1
    };
  }
  
  async checkHealth(): Promise<PlatformStatus> {
    try {
      const startTime = Date.now();
      
      const response = await fetch('https://api.linkedin.com/v2/me', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.credentials?.accessToken || 'test'}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        isOnline: response.status !== 503, // Service unavailable
        responseTime,
        lastChecked: new Date()
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
