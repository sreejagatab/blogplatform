/**
 * Platform Registry
 * Central registry for all platform adapters
 */

import { BasePlatformAdapter } from './base-adapter';

// Import all platform adapters
import { TwitterAdapter } from './adapters/twitter';
import { LinkedInAdapter } from './adapters/linkedin';
import { MediumAdapter } from './adapters/medium';
import { FacebookAdapter } from './adapters/facebook';
import { InstagramAdapter } from './adapters/instagram';
import { YouTubeAdapter } from './adapters/youtube';
import { TikTokAdapter } from './adapters/tiktok';
import { PinterestAdapter } from './adapters/pinterest';
import { RedditAdapter } from './adapters/reddit';
import { DiscordAdapter } from './adapters/discord';
import { MastodonAdapter } from './adapters/mastodon';
import { ThreadsAdapter } from './adapters/threads';
import { GitHubAdapter } from './adapters/github';
import { DevToAdapter } from './adapters/devto';
import { HashnodeAdapter } from './adapters/hashnode';

export interface PlatformInfo {
  id: string;
  name: string;
  category: 'social' | 'blogging' | 'professional' | 'video' | 'community' | 'developer';
  description: string;
  icon: string;
  color: string;
  isPopular: boolean;
  requiresApproval: boolean;
  authType: 'oauth' | 'api_key' | 'token';
  features: string[];
  limitations: string[];
  pricing: 'free' | 'freemium' | 'paid';
  maxContentLength: number;
  supportsScheduling: boolean;
  supportsAnalytics: boolean;
}

class PlatformRegistry {
  private adapters: Map<string, () => BasePlatformAdapter> = new Map();
  private platformInfo: Map<string, PlatformInfo> = new Map();

  constructor() {
    this.registerPlatforms();
  }

  private registerPlatforms() {
    // Social Media Platforms
    this.registerPlatform('twitter', () => new TwitterAdapter(), {
      id: 'twitter',
      name: 'Twitter/X',
      category: 'social',
      description: 'Share thoughts, updates, and engage with a global audience',
      icon: '𝕏',
      color: '#000000',
      isPopular: true,
      requiresApproval: false,
      authType: 'oauth',
      features: ['Real-time posting', 'Thread support', 'Hashtags', 'Mentions', 'Media uploads'],
      limitations: ['280 character limit', 'Rate limiting', 'API costs'],
      pricing: 'freemium',
      maxContentLength: 280,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    this.registerPlatform('linkedin', () => new LinkedInAdapter(), {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'professional',
      description: 'Professional networking and business content sharing',
      icon: '💼',
      color: '#0077B5',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Professional audience', 'Long-form content', 'Company pages', 'Analytics'],
      limitations: ['Professional content only', 'Strict API approval'],
      pricing: 'freemium',
      maxContentLength: 3000,
      supportsScheduling: false,
      supportsAnalytics: true
    });

    this.registerPlatform('facebook', () => new FacebookAdapter(), {
      id: 'facebook',
      name: 'Facebook',
      category: 'social',
      description: 'Connect with friends, family, and communities worldwide',
      icon: '📘',
      color: '#1877F2',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Large audience', 'Rich media', 'Groups', 'Events', 'Detailed analytics'],
      limitations: ['Algorithm changes', 'Business verification required'],
      pricing: 'freemium',
      maxContentLength: 63206,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    this.registerPlatform('instagram', () => new InstagramAdapter(), {
      id: 'instagram',
      name: 'Instagram',
      category: 'social',
      description: 'Visual storytelling through photos and videos',
      icon: '📷',
      color: '#E4405F',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Visual content', 'Stories', 'Reels', 'IGTV', 'Shopping'],
      limitations: ['Visual content required', 'Limited link sharing'],
      pricing: 'freemium',
      maxContentLength: 2200,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    // Blogging Platforms
    this.registerPlatform('medium', () => new MediumAdapter(), {
      id: 'medium',
      name: 'Medium',
      category: 'blogging',
      description: 'Platform for writers and readers to share ideas',
      icon: '📝',
      color: '#00AB6C',
      isPopular: true,
      requiresApproval: false,
      authType: 'token',
      features: ['Built-in audience', 'Partner program', 'Publications', 'Rich formatting'],
      limitations: ['Limited customization', 'Platform dependency'],
      pricing: 'freemium',
      maxContentLength: 100000,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    this.registerPlatform('devto', () => new DevToAdapter(), {
      id: 'devto',
      name: 'Dev.to',
      category: 'developer',
      description: 'Community for software developers to share knowledge',
      icon: '👨‍💻',
      color: '#0A0A0A',
      isPopular: true,
      requiresApproval: false,
      authType: 'api_key',
      features: ['Developer community', 'Markdown support', 'Tags', 'Series'],
      limitations: ['Developer-focused content', 'Limited customization'],
      pricing: 'free',
      maxContentLength: 100000,
      supportsScheduling: false,
      supportsAnalytics: true
    });

    this.registerPlatform('hashnode', () => new HashnodeAdapter(), {
      id: 'hashnode',
      name: 'Hashnode',
      category: 'blogging',
      description: 'Blogging platform for developers and tech enthusiasts',
      icon: '🔗',
      color: '#2962FF',
      isPopular: true,
      requiresApproval: false,
      authType: 'token',
      features: ['Custom domain', 'GraphQL API', 'Developer tools', 'SEO optimization'],
      limitations: ['Tech-focused audience', 'Requires publication setup'],
      pricing: 'freemium',
      maxContentLength: 100000,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    // Developer Platforms
    this.registerPlatform('github', () => new GitHubAdapter(), {
      id: 'github',
      name: 'GitHub',
      category: 'developer',
      description: 'Share code snippets and technical content via Gists',
      icon: '🐙',
      color: '#181717',
      isPopular: true,
      requiresApproval: false,
      authType: 'token',
      features: ['Code sharing', 'Gists', 'Developer audience', 'Version control'],
      limitations: ['Technical content only', 'Limited formatting'],
      pricing: 'freemium',
      maxContentLength: 1000000,
      supportsScheduling: false,
      supportsAnalytics: false
    });

    // Video Platforms
    this.registerPlatform('youtube', () => new YouTubeAdapter(), {
      id: 'youtube',
      name: 'YouTube',
      category: 'video',
      description: 'Share video content with the world\'s largest video platform',
      icon: '📺',
      color: '#FF0000',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Video hosting', 'Monetization', 'Live streaming', 'Analytics'],
      limitations: ['Video content only', 'Copyright restrictions'],
      pricing: 'freemium',
      maxContentLength: 5000,
      supportsScheduling: true,
      supportsAnalytics: true
    });

    this.registerPlatform('tiktok', () => new TikTokAdapter(), {
      id: 'tiktok',
      name: 'TikTok',
      category: 'video',
      description: 'Short-form video content for younger audiences',
      icon: '🎵',
      color: '#000000',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Short videos', 'Viral potential', 'Young audience', 'Creative tools'],
      limitations: ['Video only', 'Short duration', 'Algorithm dependent'],
      pricing: 'free',
      maxContentLength: 2200,
      supportsScheduling: false,
      supportsAnalytics: true
    });

    // Community Platforms
    this.registerPlatform('reddit', () => new RedditAdapter(), {
      id: 'reddit',
      name: 'Reddit',
      category: 'community',
      description: 'Share content with niche communities and subreddits',
      icon: '🤖',
      color: '#FF4500',
      isPopular: true,
      requiresApproval: false,
      authType: 'oauth',
      features: ['Niche communities', 'Discussion threads', 'Voting system', 'AMAs'],
      limitations: ['Community rules', 'Moderation', 'Karma requirements'],
      pricing: 'free',
      maxContentLength: 40000,
      supportsScheduling: false,
      supportsAnalytics: false
    });

    this.registerPlatform('discord', () => new DiscordAdapter(), {
      id: 'discord',
      name: 'Discord',
      category: 'community',
      description: 'Share updates and engage with community servers',
      icon: '🎮',
      color: '#5865F2',
      isPopular: true,
      requiresApproval: false,
      authType: 'token',
      features: ['Real-time chat', 'Server communities', 'Voice channels', 'Bots'],
      limitations: ['Server-based', 'Gaming focus', 'Limited discovery'],
      pricing: 'freemium',
      maxContentLength: 2000,
      supportsScheduling: false,
      supportsAnalytics: false
    });

    // Alternative Social
    this.registerPlatform('mastodon', () => new MastodonAdapter(), {
      id: 'mastodon',
      name: 'Mastodon',
      category: 'social',
      description: 'Decentralized social networking with privacy focus',
      icon: '🐘',
      color: '#6364FF',
      isPopular: false,
      requiresApproval: false,
      authType: 'oauth',
      features: ['Decentralized', 'Privacy-focused', 'No ads', 'Open source'],
      limitations: ['Smaller audience', 'Instance-based', 'Technical setup'],
      pricing: 'free',
      maxContentLength: 500,
      supportsScheduling: true,
      supportsAnalytics: false
    });

    this.registerPlatform('threads', () => new ThreadsAdapter(), {
      id: 'threads',
      name: 'Threads',
      category: 'social',
      description: 'Meta\'s text-based conversation app',
      icon: '🧵',
      color: '#000000',
      isPopular: true,
      requiresApproval: true,
      authType: 'oauth',
      features: ['Instagram integration', 'Text conversations', 'Growing audience'],
      limitations: ['New platform', 'Limited features', 'Meta dependency'],
      pricing: 'free',
      maxContentLength: 500,
      supportsScheduling: false,
      supportsAnalytics: false
    });

    this.registerPlatform('pinterest', () => new PinterestAdapter(), {
      id: 'pinterest',
      name: 'Pinterest',
      category: 'social',
      description: 'Visual discovery and idea sharing platform',
      icon: '📌',
      color: '#BD081C',
      isPopular: true,
      requiresApproval: false,
      authType: 'oauth',
      features: ['Visual content', 'Shopping integration', 'Boards', 'Rich Pins'],
      limitations: ['Visual content required', 'Lifestyle focus'],
      pricing: 'freemium',
      maxContentLength: 500,
      supportsScheduling: true,
      supportsAnalytics: true
    });
  }

  private registerPlatform(
    id: string, 
    adapterFactory: () => BasePlatformAdapter, 
    info: PlatformInfo
  ) {
    this.adapters.set(id, adapterFactory);
    this.platformInfo.set(id, info);
  }

  /**
   * Get a platform adapter instance
   */
  getAdapter(platformId: string): BasePlatformAdapter | null {
    const factory = this.adapters.get(platformId);
    return factory ? factory() : null;
  }

  /**
   * Get platform information
   */
  getPlatformInfo(platformId: string): PlatformInfo | null {
    return this.platformInfo.get(platformId) || null;
  }

  /**
   * Get all available platforms
   */
  getAllPlatforms(): PlatformInfo[] {
    return Array.from(this.platformInfo.values());
  }

  /**
   * Get platforms by category
   */
  getPlatformsByCategory(category: PlatformInfo['category']): PlatformInfo[] {
    return this.getAllPlatforms().filter(platform => platform.category === category);
  }

  /**
   * Get popular platforms
   */
  getPopularPlatforms(): PlatformInfo[] {
    return this.getAllPlatforms().filter(platform => platform.isPopular);
  }

  /**
   * Search platforms by name or description
   */
  searchPlatforms(query: string): PlatformInfo[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllPlatforms().filter(platform => 
      platform.name.toLowerCase().includes(lowercaseQuery) ||
      platform.description.toLowerCase().includes(lowercaseQuery) ||
      platform.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Check if a platform is supported
   */
  isSupported(platformId: string): boolean {
    return this.adapters.has(platformId);
  }

  /**
   * Get platform categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAllPlatforms().forEach(platform => categories.add(platform.category));
    return Array.from(categories);
  }
}

// Export singleton instance
export const platformRegistry = new PlatformRegistry();

// Export utility functions
export const getSupportedPlatforms = () => platformRegistry.getAllPlatforms();
export const getPlatformAdapter = (platformId: string) => platformRegistry.getAdapter(platformId);
export const getPlatformInfo = (platformId: string) => platformRegistry.getPlatformInfo(platformId);
