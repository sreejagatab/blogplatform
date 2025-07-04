import { z } from 'zod'

// Platform adapter interface that all adapters must implement
export interface PlatformAdapter {
  // Metadata
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly category: PlatformCategory
  readonly capabilities: PlatformCapabilities
  readonly configuration: PlatformConfiguration
  
  // Core methods
  initialize(config: Record<string, any>): Promise<void>
  validateConfiguration(config: Record<string, any>): Promise<ValidationResult>
  
  // Publishing methods
  publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult>
  scheduleContent(content: AdaptedContent, scheduleTime: Date, config: Record<string, any>): Promise<ScheduleResult>
  
  // Content ingestion methods (for bidirectional platforms)
  setupWebhook?(webhookUrl: string, config: Record<string, any>): Promise<WebhookSetupResult>
  processWebhook?(payload: any): Promise<IngestedContent | null>
  fetchContent?(config: Record<string, any>, since?: Date): Promise<IngestedContent[]>
  
  // Analytics methods
  getAnalytics?(postId: string, config: Record<string, any>): Promise<PostAnalytics>
  
  // Health check
  healthCheck(config: Record<string, any>): Promise<HealthCheckResult>
}

// Platform categories for organization
export enum PlatformCategory {
  SOCIAL_MEDIA = 'social_media',
  BLOGGING = 'blogging',
  PROFESSIONAL = 'professional',
  VIDEO = 'video',
  AUDIO = 'audio',
  NEWS = 'news',
  COMMUNITY = 'community',
  MESSAGING = 'messaging',
  DOCUMENTATION = 'documentation',
  ECOMMERCE = 'ecommerce',
  REGIONAL = 'regional',
  NICHE = 'niche'
}

// Platform capabilities
export interface PlatformCapabilities {
  publishing: {
    text: boolean
    images: boolean
    videos: boolean
    links: boolean
    polls: boolean
    scheduling: boolean
    drafts: boolean
  }
  ingestion: {
    webhooks: boolean
    rss: boolean
    api: boolean
    realtime: boolean
  }
  analytics: {
    views: boolean
    engagement: boolean
    demographics: boolean
    performance: boolean
  }
  authentication: {
    oauth1: boolean
    oauth2: boolean
    apiKey: boolean
    custom: boolean
  }
}

// Platform configuration schema
export interface PlatformConfiguration {
  fields: ConfigurationField[]
  validation: z.ZodSchema
  instructions: string
  helpUrl?: string
}

export interface ConfigurationField {
  key: string
  label: string
  type: 'text' | 'password' | 'url' | 'select' | 'boolean' | 'number'
  required: boolean
  description?: string
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: z.ZodSchema
}

// Result types
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings?: string[]
}

export interface PublishResult {
  success: boolean
  platformPostId?: string
  url?: string
  error?: string
  metadata?: Record<string, any>
}

export interface ScheduleResult {
  success: boolean
  scheduleId?: string
  scheduledTime?: Date
  error?: string
}

export interface WebhookSetupResult {
  success: boolean
  webhookId?: string
  webhookUrl?: string
  error?: string
}

export interface IngestedContent {
  platformPostId: string
  title?: string
  content: string
  author?: string
  publishedAt?: Date
  metadata: Record<string, any>
  media?: MediaItem[]
}

export interface MediaItem {
  type: 'image' | 'video' | 'audio'
  url: string
  alt?: string
  caption?: string
}

export interface PostAnalytics {
  views?: number
  likes?: number
  shares?: number
  comments?: number
  clicks?: number
  impressions?: number
  engagement?: number
  demographics?: Record<string, any>
}

export interface HealthCheckResult {
  healthy: boolean
  status: 'online' | 'offline' | 'degraded'
  latency?: number
  error?: string
  lastChecked: Date
}

export interface AdaptedContent {
  title?: string
  content: string
  media?: MediaItem[]
  tags?: string[]
  metadata?: Record<string, any>
}

// Platform Adapter Registry
export class PlatformAdapterRegistry {
  private adapters = new Map<string, PlatformAdapter>()
  private categories = new Map<PlatformCategory, string[]>()

  /**
   * Register a platform adapter
   */
  register(adapter: PlatformAdapter): void {
    // Validate adapter implementation
    this.validateAdapter(adapter)
    
    // Register adapter
    this.adapters.set(adapter.id, adapter)
    
    // Update category index
    const categoryAdapters = this.categories.get(adapter.category) || []
    categoryAdapters.push(adapter.id)
    this.categories.set(adapter.category, categoryAdapters)
    
    console.log(`Registered platform adapter: ${adapter.name} (${adapter.id})`)
  }

  /**
   * Get adapter by ID
   */
  getAdapter(id: string): PlatformAdapter | undefined {
    return this.adapters.get(id)
  }

  /**
   * Get all adapters
   */
  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values())
  }

  /**
   * Get adapters by category
   */
  getAdaptersByCategory(category: PlatformCategory): PlatformAdapter[] {
    const adapterIds = this.categories.get(category) || []
    return adapterIds.map(id => this.adapters.get(id)!).filter(Boolean)
  }

  /**
   * Search adapters
   */
  searchAdapters(query: string): PlatformAdapter[] {
    const lowercaseQuery = query.toLowerCase()
    return this.getAllAdapters().filter(adapter =>
      adapter.name.toLowerCase().includes(lowercaseQuery) ||
      adapter.description.toLowerCase().includes(lowercaseQuery) ||
      adapter.id.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Get adapter metadata
   */
  getAdapterMetadata(id: string): Omit<PlatformAdapter, 'initialize' | 'publishContent' | 'validateConfiguration' | 'healthCheck'> | undefined {
    const adapter = this.adapters.get(id)
    if (!adapter) return undefined

    return {
      id: adapter.id,
      name: adapter.name,
      description: adapter.description,
      version: adapter.version,
      author: adapter.author,
      category: adapter.category,
      capabilities: adapter.capabilities,
      configuration: adapter.configuration
    }
  }

  /**
   * Validate adapter implementation
   */
  private validateAdapter(adapter: PlatformAdapter): void {
    const requiredMethods = ['initialize', 'validateConfiguration', 'publishContent', 'healthCheck']
    
    for (const method of requiredMethods) {
      if (typeof (adapter as any)[method] !== 'function') {
        throw new Error(`Platform adapter ${adapter.id} is missing required method: ${method}`)
      }
    }

    // Validate metadata
    if (!adapter.id || !adapter.name || !adapter.version) {
      throw new Error(`Platform adapter is missing required metadata`)
    }

    // Validate configuration schema
    if (!adapter.configuration || !adapter.configuration.validation) {
      throw new Error(`Platform adapter ${adapter.id} is missing configuration schema`)
    }
  }

  /**
   * Load adapters from marketplace
   */
  async loadMarketplaceAdapters(): Promise<void> {
    try {
      // Load built-in adapters
      await this.loadBuiltInAdapters()
      
      // Load community adapters from database
      await this.loadCommunityAdapters()
      
      console.log(`Loaded ${this.adapters.size} platform adapters`)
    } catch (error) {
      console.error('Failed to load marketplace adapters:', error)
    }
  }

  /**
   * Load built-in platform adapters
   */
  private async loadBuiltInAdapters(): Promise<void> {
    const builtInAdapters = [
      'twitter',
      'linkedin',
      'medium',
      'devto',
      'hashnode',
      'github',
      'youtube',
      'facebook',
      'instagram',
      'discord',
      'reddit',
      'pinterest',
      'tiktok',
      'mastodon',
      'threads'
    ]

    for (const adapterId of builtInAdapters) {
      try {
        const adapterModule = await import(`../adapters/${adapterId}`)
        const adapter = new adapterModule.default()
        this.register(adapter)
      } catch (error) {
        console.warn(`Failed to load built-in adapter ${adapterId}:`, error)
      }
    }
  }

  /**
   * Load community-contributed adapters from database
   */
  private async loadCommunityAdapters(): Promise<void> {
    try {
      // This would load adapters from the database
      // For now, we'll implement a basic structure
      console.log('Community adapters loading not yet implemented')
    } catch (error) {
      console.error('Failed to load community adapters:', error)
    }
  }
}

// Export singleton registry
export const platformRegistry = new PlatformAdapterRegistry()
