import { BasePlatformAdapter } from '../base-adapter';
import { 
  PlatformCredentials, 
  AdaptedContent, 
  PostResult, 
  PlatformCapabilities, 
  PlatformStatus,
  BlogPost 
} from '../types';

export class ThreadsAdapter extends BasePlatformAdapter {
  platform = 'threads';
  displayName = 'Threads';
  category = 'social' as const;
  
  private apiBaseUrl = 'https://graph.threads.net/v1.0';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 500, // Threads character limit
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false, // Not available yet
      supportsMarkdown: false,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov'],
      maxImageSize: 8 * 1024 * 1024, // 8MB
      maxVideoSize: 100 * 1024 * 1024, // 100MB
      maxImagesPerPost: 10,
      maxVideosPerPost: 1,
      supportsThreads: true // Unique to Threads
    };
  }

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      if (!credentials.accessToken) {
        throw new Error('Threads access token is required');
      }
      
      this.credentials = credentials;
      
      // Validate token by getting user info
      const response = await fetch(`${this.apiBaseUrl}/me?fields=id,username,name`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Threads authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log(`Threads authenticated for user: ${userData.username}`);
      
      return true;
    } catch (error) {
      console.error('Threads authentication error:', error);
      return false;
    }
  }

  async publishPost(content: AdaptedContent): Promise<PostResult> {
    try {
      if (!this.credentials?.accessToken) {
        throw new Error('Threads not authenticated');
      }

      // Check if content should be published as a thread
      const shouldCreateThread = content.content.length > this.getCapabilities().maxContentLength;
      
      if (shouldCreateThread) {
        return await this.publishThread(content);
      } else {
        return await this.publishSinglePost(content);
      }
    } catch (error) {
      console.error('Threads publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async publishSinglePost(content: AdaptedContent): Promise<PostResult> {
    const postData: any = {
      media_type: 'TEXT',
      text: content.content
    };

    // Add image if available
    if (content.images && content.images.length > 0) {
      postData.media_type = 'IMAGE';
      postData.image_url = content.images[0];
    }

    // Add video if available
    if (content.videos && content.videos.length > 0) {
      postData.media_type = 'VIDEO';
      postData.video_url = content.videos[0];
    }

    // Create media container
    const containerResponse = await fetch(`${this.apiBaseUrl}/me/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials!.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const containerResult = await containerResponse.json();
    
    if (!containerResponse.ok) {
      throw new Error(containerResult.error?.message || 'Failed to create Threads container');
    }

    // Publish the container
    const publishResponse = await fetch(`${this.apiBaseUrl}/me/threads_publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials!.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creation_id: containerResult.id
      })
    });

    const publishResult = await publishResponse.json();
    
    if (!publishResponse.ok) {
      throw new Error(publishResult.error?.message || 'Failed to publish to Threads');
    }

    return {
      success: true,
      platformPostId: publishResult.id,
      url: `https://threads.net/@username/post/${publishResult.id}`, // Placeholder URL
      metadata: {
        containerId: containerResult.id
      }
    };
  }

  private async publishThread(content: AdaptedContent): Promise<PostResult> {
    // Split content into thread parts
    const threadParts = this.splitContentIntoThreads(content.content);
    const threadIds: string[] = [];

    try {
      // Create containers for each thread part
      for (let i = 0; i < threadParts.length; i++) {
        const isFirst = i === 0;
        const postData: any = {
          media_type: 'TEXT',
          text: threadParts[i]
        };

        // Add image to first post if available
        if (isFirst && content.images && content.images.length > 0) {
          postData.media_type = 'IMAGE';
          postData.image_url = content.images[0];
        }

        // Reply to previous post if not first
        if (!isFirst && threadIds.length > 0) {
          postData.reply_to_id = threadIds[threadIds.length - 1];
        }

        const containerResponse = await fetch(`${this.apiBaseUrl}/me/threads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials!.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        const containerResult = await containerResponse.json();
        
        if (!containerResponse.ok) {
          throw new Error(`Failed to create thread container ${i + 1}: ${containerResult.error?.message}`);
        }

        // Publish the container
        const publishResponse = await fetch(`${this.apiBaseUrl}/me/threads_publish`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials!.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            creation_id: containerResult.id
          })
        });

        const publishResult = await publishResponse.json();
        
        if (!publishResponse.ok) {
          throw new Error(`Failed to publish thread part ${i + 1}: ${publishResult.error?.message}`);
        }

        threadIds.push(publishResult.id);
        
        // Add delay between posts to avoid rate limiting
        if (i < threadParts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        success: true,
        platformPostId: threadIds[0], // Return first post ID
        url: `https://threads.net/@username/post/${threadIds[0]}`,
        metadata: {
          threadIds,
          threadLength: threadParts.length
        }
      };
    } catch (error) {
      // If thread creation fails partway through, we have partial success
      if (threadIds.length > 0) {
        return {
          success: true,
          platformPostId: threadIds[0],
          url: `https://threads.net/@username/post/${threadIds[0]}`,
          warnings: [`Thread was partially published. ${threadIds.length} of ${threadParts.length} parts were posted.`],
          metadata: {
            threadIds,
            threadLength: threadParts.length,
            partialSuccess: true
          }
        };
      }
      throw error;
    }
  }

  private splitContentIntoThreads(content: string): string[] {
    const maxLength = this.getCapabilities().maxContentLength - 20; // Leave room for thread numbering
    const parts: string[] = [];
    
    // Split by paragraphs first
    const paragraphs = content.split('\n\n');
    let currentPart = '';
    
    for (const paragraph of paragraphs) {
      if (currentPart.length + paragraph.length + 2 <= maxLength) {
        currentPart += (currentPart ? '\n\n' : '') + paragraph;
      } else {
        if (currentPart) {
          parts.push(currentPart);
          currentPart = paragraph;
        } else {
          // Paragraph is too long, split by sentences
          const sentences = paragraph.split('. ');
          for (const sentence of sentences) {
            if (currentPart.length + sentence.length + 2 <= maxLength) {
              currentPart += (currentPart ? '. ' : '') + sentence;
            } else {
              if (currentPart) {
                parts.push(currentPart);
                currentPart = sentence;
              } else {
                // Sentence is too long, force split
                parts.push(sentence.substring(0, maxLength));
                currentPart = sentence.substring(maxLength);
              }
            }
          }
        }
      }
    }
    
    if (currentPart) {
      parts.push(currentPart);
    }

    // Add thread numbering
    return parts.map((part, index) => {
      if (parts.length > 1) {
        return `${index + 1}/${parts.length}\n\n${part}`;
      }
      return part;
    });
  }

  async adaptContent(originalContent: BlogPost): Promise<AdaptedContent> {
    const capabilities = this.getCapabilities();
    let content = originalContent.excerpt || originalContent.content.substring(0, 1000);
    const warnings: string[] = [];

    // Extract hashtags
    const hashtags = this.extractHashtags(originalContent);
    
    // Add hashtags if they fit
    const hashtagString = hashtags.slice(0, 5).join(' '); // Limit hashtags
    if (content.length + hashtagString.length + 2 <= capabilities.maxContentLength) {
      content += '\n\n' + hashtagString;
    }

    // Check if content will need to be threaded
    if (content.length > capabilities.maxContentLength) {
      warnings.push('Content will be published as a thread due to length');
    }

    // Add call-to-action
    if (originalContent.canonicalUrl && content.length + 50 < capabilities.maxContentLength) {
      content += `\n\nRead more: ${originalContent.canonicalUrl}`;
    }

    return {
      title: originalContent.title,
      content,
      hashtags,
      images: originalContent.featuredImage ? [originalContent.featuredImage] : [],
      metadata: { 
        warnings,
        willBeThreaded: content.length > capabilities.maxContentLength
      }
    };
  }

  private extractHashtags(content: BlogPost): string[] {
    const hashtags: string[] = [];
    
    // Add tags as hashtags
    if (content.tags) {
      hashtags.push(...content.tags.map(tag => `#${tag.replace(/\s+/g, '').toLowerCase()}`));
    }
    
    // Add some general engagement hashtags
    hashtags.push('#threads', '#content');
    
    return hashtags.slice(0, 10); // Limit to 10 hashtags
  }

  async checkHealth(): Promise<PlatformStatus> {
    try {
      const response = await fetch('https://graph.threads.net/v1.0/', {
        method: 'GET'
      });

      return {
        isOnline: response.ok,
        responseTime: response.ok ? 120 : undefined,
        lastChecked: new Date(),
        errorMessage: response.ok ? undefined : 'Threads API not accessible'
      };
    } catch (error) {
      return {
        isOnline: false,
        lastChecked: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getRateLimit(): { remainingRequests: number; resetTime: Date } {
    return {
      remainingRequests: this.rateLimitRemaining || 50,
      resetTime: this.rateLimitResetTime
    };
  }
}
