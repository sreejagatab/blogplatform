import { 
  PlatformAdapter, 
  PlatformManager as IPlatformManager, 
  PlatformStatus 
} from './types';

// Import all platform adapters
import { LinkedInAdapter } from './adapters/linkedin';
import { TwitterAdapter } from './adapters/twitter';
import { MediumAdapter } from './adapters/medium';
import { FacebookAdapter } from './adapters/facebook';
import { InstagramAdapter } from './adapters/instagram';
import { YouTubeAdapter } from './adapters/youtube';
import { PinterestAdapter } from './adapters/pinterest';
import { RedditAdapter } from './adapters/reddit';
import { DiscordAdapter } from './adapters/discord';
import { TikTokAdapter } from './adapters/tiktok';
import { ThreadsAdapter } from './adapters/threads';
import { MastodonAdapter } from './adapters/mastodon';
import { GitHubAdapter } from './adapters/github';
import { DevToAdapter } from './adapters/devto';
import { HashnodeAdapter } from './adapters/hashnode';

export class PlatformManager implements IPlatformManager {
  private adapters: Map<string, PlatformAdapter> = new Map();
  private initialized: boolean = false;
  
  constructor() {
    this.initializeAdapters();
  }
  
  private initializeAdapters(): void {
    if (this.initialized) return;
    
    // Register all available platform adapters
    const adapters = [
      new LinkedInAdapter(),
      new TwitterAdapter(),
      new MediumAdapter(),
      new FacebookAdapter(),
      new InstagramAdapter(),
      new YouTubeAdapter(),
      new PinterestAdapter(),
      new RedditAdapter(),
      new DiscordAdapter(),
      new TikTokAdapter(),
      new ThreadsAdapter(),
      new MastodonAdapter(),
      new GitHubAdapter(),
      new DevToAdapter(),
      new HashnodeAdapter()
    ];
    
    adapters.forEach(adapter => {
      this.registerAdapter(adapter);
    });
    
    this.initialized = true;
    console.log(`Platform Manager initialized with ${this.adapters.size} platforms`);
  }
  
  registerAdapter(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.platform, adapter);
    console.log(`Registered platform adapter: ${adapter.displayName}`);
  }
  
  getAdapter(platform: string): PlatformAdapter | null {
    return this.adapters.get(platform) || null;
  }
  
  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  getAvailablePlatforms(): string[] {
    return Array.from(this.adapters.keys());
  }
  
  getPlatformsByCategory(category: string): PlatformAdapter[] {
    return this.getAllAdapters().filter(adapter => adapter.category === category);
  }
  
  async validateAllConnections(userId: string): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    // In a real implementation, you would fetch user's platform connections from database
    // and validate each one. For now, we'll return a mock validation
    
    for (const [platform, adapter] of this.adapters) {
      try {
        // This would normally use the user's stored credentials
        const isValid = await adapter.validateConnection();
        results[platform] = isValid;
      } catch (error) {
        console.error(`Failed to validate ${platform} connection:`, error);
        results[platform] = false;
      }
    }
    
    return results;
  }
  
  async getHealthStatus(): Promise<Record<string, PlatformStatus>> {
    const healthResults: Record<string, PlatformStatus> = {};
    
    // Check health of all platforms concurrently
    const healthChecks = Array.from(this.adapters.entries()).map(async ([platform, adapter]) => {
      try {
        const status = await adapter.checkHealth();
        return { platform, status };
      } catch (error) {
        return {
          platform,
          status: {
            isOnline: false,
            lastChecked: new Date(),
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      }
    });
    
    const results = await Promise.allSettled(healthChecks);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        healthResults[result.value.platform] = result.value.status;
      }
    });
    
    return healthResults;
  }
  
  // Helper methods for platform management
  getPlatformInfo(platform: string): {
    name: string;
    displayName: string;
    category: string;
    capabilities: any;
  } | null {
    const adapter = this.getAdapter(platform);
    if (!adapter) return null;
    
    return {
      name: adapter.platform,
      displayName: adapter.displayName,
      category: adapter.category,
      capabilities: adapter.getCapabilities()
    };
  }
  
  getAllPlatformInfo(): Array<{
    name: string;
    displayName: string;
    category: string;
    capabilities: any;
  }> {
    return this.getAllAdapters().map(adapter => ({
      name: adapter.platform,
      displayName: adapter.displayName,
      category: adapter.category,
      capabilities: adapter.getCapabilities()
    }));
  }
  
  // Get platforms that support specific features
  getPlatformsWithFeature(feature: keyof PlatformAdapter): string[] {
    return this.getAllAdapters()
      .filter(adapter => typeof adapter[feature] === 'function')
      .map(adapter => adapter.platform);
  }
  
  getPlatformsSupportingScheduling(): string[] {
    return this.getAllAdapters()
      .filter(adapter => adapter.getCapabilities().supportsScheduling)
      .map(adapter => adapter.platform);
  }
  
  getPlatformsSupportingImages(): string[] {
    return this.getAllAdapters()
      .filter(adapter => adapter.getCapabilities().supportsImages)
      .map(adapter => adapter.platform);
  }
  
  getPlatformsSupportingVideo(): string[] {
    return this.getAllAdapters()
      .filter(adapter => adapter.getCapabilities().supportsVideo)
      .map(adapter => adapter.platform);
  }
  
  // Rate limit management
  async checkRateLimits(): Promise<Record<string, { remaining: number; resetTime: Date }>> {
    const rateLimits: Record<string, { remaining: number; resetTime: Date }> = {};
    
    this.getAllAdapters().forEach(adapter => {
      const rateLimit = adapter.getRateLimit();
      rateLimits[adapter.platform] = {
        remaining: rateLimit.remainingRequests,
        resetTime: rateLimit.resetTime
      };
    });
    
    return rateLimits;
  }
  
  // Batch operations
  async batchHealthCheck(platforms?: string[]): Promise<Record<string, PlatformStatus>> {
    const platformsToCheck = platforms || this.getAvailablePlatforms();
    const results: Record<string, PlatformStatus> = {};
    
    const healthChecks = platformsToCheck.map(async (platform) => {
      const adapter = this.getAdapter(platform);
      if (!adapter) return null;
      
      try {
        const status = await adapter.checkHealth();
        return { platform, status };
      } catch (error) {
        return {
          platform,
          status: {
            isOnline: false,
            lastChecked: new Date(),
            errorMessage: error instanceof Error ? error.message : 'Health check failed'
          }
        };
      }
    });
    
    const healthResults = await Promise.allSettled(healthChecks);
    
    healthResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        results[result.value.platform] = result.value.status;
      }
    });
    
    return results;
  }
  
  // Platform statistics
  getStatistics(): {
    totalPlatforms: number;
    platformsByCategory: Record<string, number>;
    supportedFeatures: Record<string, number>;
  } {
    const adapters = this.getAllAdapters();
    const platformsByCategory: Record<string, number> = {};
    const supportedFeatures = {
      scheduling: 0,
      images: 0,
      videos: 0,
      hashtags: 0,
      mentions: 0
    };
    
    adapters.forEach(adapter => {
      // Count by category
      platformsByCategory[adapter.category] = (platformsByCategory[adapter.category] || 0) + 1;
      
      // Count supported features
      const capabilities = adapter.getCapabilities();
      if (capabilities.supportsScheduling) supportedFeatures.scheduling++;
      if (capabilities.supportsImages) supportedFeatures.images++;
      if (capabilities.supportsVideo) supportedFeatures.videos++;
      if (capabilities.supportsHashtags) supportedFeatures.hashtags++;
      if (capabilities.supportsMentions) supportedFeatures.mentions++;
    });
    
    return {
      totalPlatforms: adapters.length,
      platformsByCategory,
      supportedFeatures
    };
  }
}

// Singleton instance
export const platformManager = new PlatformManager();
