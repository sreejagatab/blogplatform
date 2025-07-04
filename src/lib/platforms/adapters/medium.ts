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

export class MediumAdapter extends BasePlatformAdapter {
  platform = 'medium';
  displayName = 'Medium';
  category = 'blogging' as const;
  
  private apiBaseUrl = 'https://api.medium.com/v1';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Medium access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate token by getting user info
      const response = await fetch(`${this.apiBaseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Medium authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`Medium authenticated for user: ${userData.data.name}`);
      
      return true;
    } catch (error) {
      console.error('Medium authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Medium not authenticated');
      }
      
      await this.waitForRateLimit();
      
      // Get user ID first
      const userResponse = await fetch(`${this.apiBaseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get Medium user info');
      }
      
      const userData = await userResponse.json();
      const userId = userData.data.id;
      
      // Prepare post data
      const postData = {
        title: content.title,
        contentFormat: 'html',
        content: this.convertToMediumHTML(content),
        tags: content.hashtags || [],
        publishStatus: 'public', // or 'draft'
        license: 'all-rights-reserved',
        notifyFollowers: true
      };
      
      // Publish to Medium
      const response = await fetch(`${this.apiBaseUrl}/users/${userId}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      // Update rate limits
      const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      const resetTime = new Date(Date.now() + 60 * 60 * 1000); // Medium resets hourly
      this.updateRateLimit(remaining, resetTime);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Medium API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const result = await response.json();
      const postData_result = result.data;
      
      return {
        success: true,
        platformPostId: postData_result.id,
        platformUrl: postData_result.url,
        metadata: {
          title: postData_result.title,
          publishStatus: postData_result.publishStatus,
          authorId: postData_result.authorId,
          tags: postData_result.tags
        }
      };
      
    } catch (error) {
      return this.handleApiError(error, 'publish post');
    }
  }
  
  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    // Medium supports rich HTML content, so we can preserve most formatting
    let adaptedContent = originalContent.content;
    
    // Add author byline
    if (originalContent.author.name) {
      adaptedContent = `<p><em>By ${originalContent.author.name}</em></p>\n\n${adaptedContent}`;
    }
    
    // Add featured image if available
    if (originalContent.featuredImage) {
      adaptedContent = `<figure><img src="${originalContent.featuredImage}" alt="${originalContent.title}"><figcaption>${originalContent.title}</figcaption></figure>\n\n${adaptedContent}`;
    }
    
    // Add canonical URL reference
    if (originalContent.canonicalUrl) {
      adaptedContent += `\n\n<hr>\n<p><em>Originally published at <a href="${originalContent.canonicalUrl}">${originalContent.canonicalUrl}</a></em></p>`;
    }
    
    // Generate tags for Medium
    const tags = this.generateMediumTags(originalContent);
    
    return {
      title: originalContent.title,
      content: adaptedContent,
      hashtags: tags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: {
        originalUrl: originalContent.canonicalUrl,
        excerpt: originalContent.excerpt,
        category: originalContent.category?.name,
        wordCount: this.countWords(adaptedContent)
      }
    };
  }
  
  private convertToMediumHTML(content: AdaptedContent): string {
    let html = content.content;
    
    // Ensure proper HTML structure
    if (!html.includes('<p>') && !html.includes('<h1>')) {
      // Convert plain text to paragraphs
      html = html.split('\n\n').map(paragraph => 
        paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
      ).join('\n');
    }
    
    // Add featured image if not already present
    if (content.images && content.images.length > 0 && !html.includes('<img')) {
      const featuredImage = `<figure><img src="${content.images[0]}" alt="${content.title}"></figure>`;
      html = featuredImage + '\n\n' + html;
    }
    
    // Clean up HTML
    html = html.replace(/\n{3,}/g, '\n\n');
    
    return html;
  }
  
  private generateMediumTags(post: BlogPost): string[] {
    const tags: string[] = [];
    
    // Add category
    if (post.category?.name) {
      tags.push(post.category.name);
    }
    
    // Add original tags (Medium allows up to 5 tags)
    post.tags.forEach(tag => {
      const cleanTag = tag.trim();
      if (cleanTag.length > 0 && !tags.includes(cleanTag)) {
        tags.push(cleanTag);
      }
    });
    
    // Add some popular Medium tags based on content
    const popularTags = ['Writing', 'Technology', 'Startup', 'Programming', 'Design', 'Business'];
    popularTags.forEach(tag => {
      if (tags.length < 5 && !tags.includes(tag)) {
        const content = (post.title + ' ' + post.content).toLowerCase();
        if (content.includes(tag.toLowerCase())) {
          tags.push(tag);
        }
      }
    });
    
    return tags.slice(0, 5); // Medium allows maximum 5 tags
  }
  
  private countWords(text: string): number {
    return this.extractPlainText(text).split(/\s+/).filter(word => word.length > 0).length;
  }
  
  async getPostMetrics(postId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Medium not authenticated');
      }
      
      // Note: Medium API has limited metrics access
      // This is a placeholder implementation
      const response = await fetch(`${this.apiBaseUrl}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get Medium post metrics');
      }
      
      const data = await response.json();
      
      // Medium API doesn't provide detailed metrics, so we return basic info
      return {
        views: 0, // Not available through public API
        likes: 0, // Not available through public API
        comments: 0, // Not available through public API
        shares: 0 // Not available through public API
      };
      
    } catch (error) {
      console.error('Error fetching Medium metrics:', error);
      return {};
    }
  }
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 100000, // Very generous limit
      supportsImages: true,
      supportsVideo: false, // Medium doesn't support video uploads via API
      supportsHashtags: true, // Medium uses tags
      supportsMentions: false, // No direct mention support
      supportsScheduling: false, // No scheduling in Medium API
      supportsMarkdown: false, // Medium uses HTML
      supportsHTMLTags: [
        'p', 'br', 'strong', 'em', 'u', 'strike', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote',
        'img', 'figure', 'figcaption',
        'a', 'hr'
      ],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif'],
      videoFormats: [], // No video support
      maxImageSize: 25 * 1024 * 1024, // 25MB
      maxVideoSize: 0,
      maxImagesPerPost: 20, // Reasonable limit
      maxVideosPerPost: 0
    };
  }
  
  async checkHealth(): Promise<PlatformStatus> {
    try {
      const startTime = Date.now();
      
      // Check Medium API status
      const response = await fetch(`${this.apiBaseUrl}/me`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.credentials?.accessToken || 'test'}`
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        isOnline: response.status !== 503,
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
  
  async updatePost(postId: string, content: AdaptedContent): Promise<PostResult> {
    // Medium doesn't support post updates via API
    return {
      success: false,
      errorMessage: 'Medium does not support post updates via API'
    };
  }
  
  async deletePost(postId: string): Promise<boolean> {
    // Medium doesn't support post deletion via API
    return false;
  }
}
