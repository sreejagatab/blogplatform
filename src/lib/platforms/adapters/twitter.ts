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

export class TwitterAdapter extends BasePlatformAdapter {
  platform = 'twitter';
  displayName = 'Twitter/X';
  category = 'social' as const;
  
  private apiBaseUrl = 'https://api.twitter.com/2';
  
  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Twitter access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate the token by getting user info
      const response = await fetch(`${this.apiBaseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Twitter authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`Twitter authenticated for user: @${userData.data.username}`);
      
      return true;
    } catch (error) {
      console.error('Twitter authentication error:', error);
      return false;
    }
  }
  
  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Twitter not authenticated');
      }
      
      await this.waitForRateLimit();
      
      // Prepare tweet data
      const tweetData: any = {
        text: content.content
      };
      
      // Add media if present
      if (content.images && content.images.length > 0) {
        // For simplicity, we'll include the first image URL in the text
        // In a real implementation, you'd upload media first and get media IDs
        tweetData.text += `\n\n📸 ${content.images[0]}`;
      }
      
      // Post tweet
      const response = await fetch(`${this.apiBaseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweetData)
      });
      
      // Update rate limits
      const remaining = parseInt(response.headers.get('x-rate-limit-remaining') || '0');
      const resetTime = new Date(parseInt(response.headers.get('x-rate-limit-reset') || '0') * 1000);
      this.updateRateLimit(remaining, resetTime);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const result = await response.json();
      const tweetId = result.data.id;
      
      return {
        success: true,
        platformPostId: tweetId,
        platformUrl: `https://twitter.com/i/status/${tweetId}`,
        metadata: {
          text: tweetData.text,
          hasMedia: content.images && content.images.length > 0
        }
      };
      
    } catch (error) {
      return this.handleApiError(error, 'publish tweet');
    }
  }
  
  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const capabilities = this.getCapabilities();
    
    // Create thread if content is too long
    const threads = this.createTwitterThread(originalContent);
    
    // For the main tweet, use the first thread item
    const mainTweet = threads[0];
    
    // Generate hashtags
    const hashtags = await this.generateTwitterHashtags(originalContent);
    
    return {
      title: originalContent.title,
      content: mainTweet,
      hashtags: hashtags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: {
        threads: threads,
        originalUrl: originalContent.canonicalUrl,
        threadCount: threads.length
      }
    };
  }
  
  private createTwitterThread(post: BlogPost): string[] {
    const maxLength = 280;
    const thread: string[] = [];
    
    // Start with an engaging hook
    const hook = `📝 ${post.title}`;
    thread.push(hook);
    
    // Add excerpt or key points
    if (post.excerpt) {
      const excerptTweet = `🧵 ${post.excerpt}`;
      if (excerptTweet.length <= maxLength) {
        thread.push(excerptTweet);
      }
    }
    
    // Extract key points from content
    const keyPoints = this.extractKeyPoints(post.content);
    keyPoints.forEach((point, index) => {
      const tweet = `${index + 2}/ ${point}`;
      if (tweet.length <= maxLength) {
        thread.push(tweet);
      }
    });
    
    // Add call-to-action with link
    if (post.canonicalUrl) {
      const ctaTweet = `🔗 Read the full article: ${post.canonicalUrl}`;
      thread.push(ctaTweet);
    }
    
    // Add hashtags to the last tweet
    const hashtags = this.generateSimpleHashtags(post);
    if (hashtags.length > 0 && thread.length > 0) {
      const lastTweetIndex = thread.length - 1;
      const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
      
      if (thread[lastTweetIndex].length + hashtagString.length + 2 <= maxLength) {
        thread[lastTweetIndex] += `\n\n${hashtagString}`;
      } else {
        thread.push(hashtagString);
      }
    }
    
    return thread;
  }
  
  private extractKeyPoints(content: string, maxPoints: number = 3): string[] {
    const plainText = this.extractPlainText(content);
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Simple extraction - take first few meaningful sentences
    return sentences
      .slice(0, maxPoints)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 20 && sentence.length < 200);
  }
  
  private async generateTwitterHashtags(post: BlogPost): Promise<string[]> {
    const hashtags: string[] = [];
    
    // Add trending/popular hashtags based on category
    const trendingTags: Record<string, string[]> = {
      'Technology': ['Tech', 'Innovation', 'Digital'],
      'Business': ['Business', 'Entrepreneur', 'Growth'],
      'Marketing': ['Marketing', 'SocialMedia', 'Content'],
      'Development': ['Coding', 'WebDev', 'Programming'],
      'Design': ['Design', 'UX', 'UI']
    };
    
    if (post.category?.name && trendingTags[post.category.name]) {
      hashtags.push(...trendingTags[post.category.name]);
    }
    
    // Add clean version of post tags
    post.tags.forEach(tag => {
      const cleanTag = tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      if (cleanTag.length > 2 && cleanTag.length < 20) {
        hashtags.push(cleanTag);
      }
    });
    
    return hashtags.slice(0, 3); // Twitter works best with 1-3 hashtags
  }
  
  private generateSimpleHashtags(post: BlogPost): string[] {
    const hashtags: string[] = [];
    
    if (post.category?.name) {
      hashtags.push(post.category.name.replace(/\s+/g, ''));
    }
    
    // Add first 2 tags
    post.tags.slice(0, 2).forEach(tag => {
      const cleanTag = tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      if (cleanTag.length > 2) {
        hashtags.push(cleanTag);
      }
    });
    
    return hashtags.slice(0, 3);
  }
  
  async getPostMetrics(postId: string): Promise<PlatformMetrics> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Twitter not authenticated');
      }
      
      // Get tweet metrics
      const response = await fetch(`${this.apiBaseUrl}/tweets/${postId}?tweet.fields=public_metrics`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get Twitter metrics');
      }
      
      const data = await response.json();
      const metrics = data.data.public_metrics;
      
      return {
        views: metrics.impression_count || 0,
        likes: metrics.like_count || 0,
        shares: metrics.retweet_count || 0,
        comments: metrics.reply_count || 0,
        reactions: {
          likes: metrics.like_count || 0,
          retweets: metrics.retweet_count || 0,
          quotes: metrics.quote_count || 0
        }
      };
      
    } catch (error) {
      console.error('Error fetching Twitter metrics:', error);
      return {};
    }
  }
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 280,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false, // Would need premium API access
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov'],
      maxImageSize: 5 * 1024 * 1024, // 5MB
      maxVideoSize: 512 * 1024 * 1024, // 512MB
      maxImagesPerPost: 4,
      maxVideosPerPost: 1
    };
  }
  
  async checkHealth(): Promise<PlatformStatus> {
    try {
      const startTime = Date.now();
      
      // Check Twitter API status
      const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=twitter', {
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
  
  // Twitter-specific method for publishing threads
  async publishThread(threads: string[]): Promise<PostResult[]> {
    const results: PostResult[] = [];
    let replyToId: string | undefined;
    
    for (let i = 0; i < threads.length; i++) {
      const tweetData: any = {
        text: threads[i]
      };
      
      // If this is a reply in the thread
      if (replyToId) {
        tweetData.reply = {
          in_reply_to_tweet_id: replyToId
        };
      }
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/tweets`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials?.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tweetData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        const tweetId = result.data.id;
        replyToId = tweetId; // Set for next tweet in thread
        
        results.push({
          success: true,
          platformPostId: tweetId,
          platformUrl: `https://twitter.com/i/status/${tweetId}`,
          metadata: { threadIndex: i, text: threads[i] }
        });
        
        // Small delay between tweets to avoid rate limits
        if (i < threads.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        results.push(this.handleApiError(error, `publish thread item ${i + 1}`));
        break; // Stop thread on error
      }
    }
    
    return results;
  }
}
