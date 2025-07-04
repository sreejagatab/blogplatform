import { BasePlatformAdapter } from '../base-adapter';
import {
  BlogPost,
  PostResult,
  PlatformCapabilities,
  PlatformCredentials
} from '../types';

export class DiscordAdapter extends BasePlatformAdapter {
  platform = 'discord';
  displayName = 'Discord';
  category: 'community' = 'community';
  
  private apiBaseUrl = 'https://discord.com/api/v10';
  
  getCapabilities(): PlatformCapabilities {
    return {
      maxContentLength: 2000, // Discord message limit
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: false, // Discord doesn't use hashtags
      supportsMentions: true, // @username format
      supportsScheduling: false, // Discord doesn't support scheduling
      supportsMarkdown: true,
      supportsHTMLTags: [],
      imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videoFormats: ['mp4', 'mov', 'webm'],
      maxImageSize: 25 * 1024 * 1024, // 25MB for Nitro, 8MB for regular
      maxVideoSize: 25 * 1024 * 1024, // 25MB for Nitro, 8MB for regular
      maxImagesPerPost: 10, // Multiple attachments
      maxVideosPerPost: 1
    };
  }

  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.botToken && !credentials.webhookUrl) {
        throw new Error('Discord bot token or webhook URL is required');
      }

      if (credentials.botToken) {
        // Verify bot token by getting bot user info
        const response = await fetch(
          `${this.apiBaseUrl}/users/@me`,
          {
            headers: {
              'Authorization': `Bot ${credentials.botToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Invalid Discord bot token');
        }

        const botData = await response.json();
        console.log(`Discord authenticated for bot: ${botData.username}`);
      } else if (credentials.webhookUrl) {
        // Verify webhook URL by making a test request
        const response = await fetch(credentials.webhookUrl);
        if (!response.ok) {
          throw new Error('Invalid Discord webhook URL');
        }
      }

      this.isAuthenticated = true;
      this.credentials = credentials;
      
      return true;
    } catch (error) {
      console.error('Discord authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async publishPost(post: BlogPost): Promise<PostResult> {
    if (!this.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated with Discord'
      };
    }

    try {
      const adaptedContent = await this.adaptContent(post);
      
      if (this.credentials?.webhookUrl) {
        return await this.publishViaWebhook(post, adaptedContent);
      } else if (this.credentials?.botToken && this.credentials?.channelId) {
        return await this.publishViaBot(post, adaptedContent);
      } else {
        return {
          success: false,
          error: 'No valid Discord publishing method configured'
        };
      }
    } catch (error) {
      console.error('Discord publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async publishViaWebhook(post: BlogPost, adaptedContent: { content: string; warnings: string[] }): Promise<PublishResult> {
    try {
      const embed = {
        title: post.title,
        description: adaptedContent.content,
        url: post.canonicalUrl,
        color: 0x5865F2, // Discord blurple
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Universal Blog Platform'
        }
      };

      // Add image if present
      if (post.featuredImage) {
        embed.image = { url: post.featuredImage };
      }

      // Add author info
      if (post.author) {
        embed.author = {
          name: post.author.name,
          icon_url: post.author.avatar
        };
      }

      const webhookData = {
        embeds: [embed],
        username: 'Blog Platform',
        avatar_url: 'https://your-platform-icon.png' // Replace with actual icon
      };

      const response = await fetch(this.credentials!.webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send Discord webhook');
      }

      // Discord webhooks don't return message ID in response
      // We'll generate a pseudo-ID for tracking
      const messageId = `webhook_${Date.now()}`;
      
      return {
        success: true,
        platformPostId: messageId,
        url: this.credentials!.webhookUrl!,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      throw error;
    }
  }

  private async publishViaBot(post: BlogPost, adaptedContent: { content: string; warnings: string[] }): Promise<PublishResult> {
    try {
      const embed = {
        title: post.title,
        description: adaptedContent.content,
        url: post.canonicalUrl,
        color: 0x5865F2,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Universal Blog Platform'
        }
      };

      if (post.featuredImage) {
        embed.image = { url: post.featuredImage };
      }

      if (post.author) {
        embed.author = {
          name: post.author.name,
          icon_url: post.author.avatar
        };
      }

      const messageData = {
        embeds: [embed]
      };

      const response = await fetch(
        `${this.apiBaseUrl}/channels/${this.credentials!.channelId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${this.credentials!.botToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send Discord message');
      }

      const result = await response.json();
      
      return {
        success: true,
        platformPostId: result.id,
        url: `https://discord.com/channels/${result.guild_id}/${result.channel_id}/${result.id}`,
        warnings: adaptedContent.warnings
      };
    } catch (error) {
      throw error;
    }
  }

  async schedulePost(post: BlogPost, publishAt: Date): Promise<PublishResult> {
    return {
      success: false,
      error: 'Discord does not support message scheduling'
    };
  }

  async deletePost(platformPostId: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.credentials?.botToken || !this.credentials?.channelId) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/channels/${this.credentials.channelId}/messages/${platformPostId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bot ${this.credentials.botToken}`
          }
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Discord delete error:', error);
      return false;
    }
  }

  async getAnalytics(platformPostId: string): Promise<any> {
    if (!this.isAuthenticated || !this.credentials?.botToken || !this.credentials?.channelId) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/channels/${this.credentials.channelId}/messages/${platformPostId}`,
        {
          headers: {
            'Authorization': `Bot ${this.credentials.botToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Discord message');
      }

      const messageData = await response.json();
      
      // Discord doesn't provide detailed analytics, but we can get basic info
      return {
        reactions: messageData.reactions?.length || 0,
        mentions: messageData.mentions?.length || 0,
        attachments: messageData.attachments?.length || 0,
        embeds: messageData.embeds?.length || 0,
        platform: 'discord',
        postId: platformPostId,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Discord analytics error:', error);
      return null;
    }
  }

  private async adaptContent(post: BlogPost): Promise<{
    content: string;
    warnings: string[];
  }> {
    const warnings: string[] = [];
    let content = post.excerpt || post.content;

    // Discord supports limited Markdown
    content = content
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
      .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags

    // Truncate if too long (Discord embeds can be longer, but message content is limited)
    const maxLength = 1000; // Conservative limit for embed description
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
      warnings.push(`Content truncated to ${maxLength} characters for Discord`);
    }

    return { content, warnings };
  }

  // Discord-specific methods
  async getGuilds(): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.botToken) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/users/@me/guilds`,
        {
          headers: {
            'Authorization': `Bot ${this.credentials.botToken}`
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const guilds = await response.json();
      return guilds;
    } catch (error) {
      console.error('Discord guilds error:', error);
      return [];
    }
  }

  async getChannels(guildId: string): Promise<any[]> {
    if (!this.isAuthenticated || !this.credentials?.botToken) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/guilds/${guildId}/channels`,
        {
          headers: {
            'Authorization': `Bot ${this.credentials.botToken}`
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const channels = await response.json();
      // Filter for text channels only
      return channels.filter(channel => channel.type === 0);
    } catch (error) {
      console.error('Discord channels error:', error);
      return [];
    }
  }

  async createWebhook(channelId: string, name: string): Promise<{ success: boolean; webhookUrl?: string }> {
    if (!this.isAuthenticated || !this.credentials?.botToken) {
      return { success: false };
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/channels/${channelId}/webhooks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${this.credentials.botToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name
          })
        }
      );

      if (!response.ok) {
        return { success: false };
      }

      const webhook = await response.json();
      return { 
        success: true, 
        webhookUrl: `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`
      };
    } catch (error) {
      console.error('Discord webhook creation error:', error);
      return { success: false };
    }
  }

  async checkHealth(): Promise<PlatformStatus> {
    try {
      if (!this.isAuthenticated) {
        return {
          platform: this.platform,
          isConnected: false,
          lastChecked: new Date(),
          status: 'disconnected',
          error: 'Not authenticated'
        }
      }

      // Test Discord API connectivity
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bot ${this.credentials?.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        return {
          platform: this.platform,
          isConnected: true,
          lastChecked: new Date(),
          status: 'connected'
        }
      } else {
        return {
          platform: this.platform,
          isConnected: false,
          lastChecked: new Date(),
          status: 'error',
          error: `Discord API error: ${response.status}`
        }
      }
    } catch (error) {
      return {
        platform: this.platform,
        isConnected: false,
        lastChecked: new Date(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
