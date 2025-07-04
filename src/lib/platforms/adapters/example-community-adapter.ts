import { z } from 'zod'
import {
  BasePlatformAdapter,
  createConfigurationSchema,
  createConfigField,
  createCapabilities
} from '../marketplace/base-platform-adapter'
import {
  PlatformCategory,
  PlatformCapabilities,
  PlatformConfiguration,
  PublishResult,
  AdaptedContent,
  IngestedContent,
  WebhookSetupResult
} from '../marketplace/platform-adapter-registry'

/**
 * Example Community Platform Adapter
 * 
 * This serves as a template for community developers to create their own platform adapters.
 * It demonstrates how to extend the BasePlatformAdapter class and implement all required methods.
 * 
 * To create a new adapter:
 * 1. Copy this file and rename it to your platform name
 * 2. Update all the metadata properties
 * 3. Implement the platform-specific API calls
 * 4. Test thoroughly with the platform's API
 * 5. Submit to the community marketplace
 */
export default class ExampleCommunityAdapter extends BasePlatformAdapter {
  // Required metadata - update these for your platform
  readonly id = 'example-platform'
  readonly name = 'Example Platform'
  readonly description = 'A template adapter for community developers to build upon'
  readonly version = '1.0.0'
  readonly author = 'Community Developer'
  readonly category = PlatformCategory.COMMUNITY

  // Define platform capabilities
  readonly capabilities: PlatformCapabilities = createCapabilities({
    publishing: {
      text: true,
      images: true,
      videos: false,
      links: true,
      polls: false,
      scheduling: true,
      drafts: true
    },
    ingestion: {
      webhooks: true,
      rss: true,
      api: true,
      realtime: false
    },
    analytics: {
      views: true,
      engagement: true,
      demographics: false,
      performance: true
    },
    authentication: {
      oauth1: false,
      oauth2: true,
      apiKey: true,
      custom: false
    }
  })

  // Define configuration schema and fields
  readonly configuration: PlatformConfiguration = {
    fields: [
      createConfigField('apiKey', 'API Key', 'password', true, {
        description: 'Your platform API key from the developer dashboard',
        placeholder: 'sk_live_...'
      }),
      createConfigField('apiSecret', 'API Secret', 'password', true, {
        description: 'Your platform API secret'
      }),
      createConfigField('baseUrl', 'API Base URL', 'url', false, {
        description: 'Custom API base URL (optional)',
        placeholder: 'https://api.example-platform.com'
      }),
      createConfigField('enableWebhooks', 'Enable Webhooks', 'boolean', false, {
        description: 'Enable webhook-based content ingestion'
      }),
      createConfigField('defaultTags', 'Default Tags', 'text', false, {
        description: 'Comma-separated default tags to add to all posts',
        placeholder: 'blog,automation'
      })
    ],
    validation: createConfigurationSchema({
      apiKey: z.string().min(1, 'API Key is required'),
      apiSecret: z.string().min(1, 'API Secret is required'),
      baseUrl: z.string().url().optional(),
      enableWebhooks: z.boolean().optional(),
      defaultTags: z.string().optional()
    }),
    instructions: `
      To get your API credentials:
      1. Go to https://example-platform.com/developers
      2. Create a new application
      3. Copy the API Key and Secret
      4. Set the webhook URL to: {webhookUrl}
    `,
    helpUrl: 'https://docs.example-platform.com/api'
  }

  /**
   * Platform-specific initialization
   */
  protected async onInitialize(config: Record<string, any>): Promise<void> {
    // Validate API credentials by making a test request
    try {
      const response = await this.makeRequest(
        `${this.getBaseUrl()}/auth/verify`,
        { method: 'GET' },
        config
      )
      
      const data = await response.json()
      console.log(`${this.name} adapter initialized successfully for user: ${data.username}`)
    } catch (error) {
      throw new Error(`Failed to initialize ${this.name} adapter: ${error}`)
    }
  }

  /**
   * Custom validation beyond schema validation
   */
  protected async customValidation(config: Record<string, any>) {
    const errors: string[] = []
    const warnings: string[] = []

    // Test API connectivity
    try {
      const response = await fetch(`${this.getBaseUrl(config)}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-API-Secret': config.apiSecret
        }
      })

      if (!response.ok) {
        errors.push('Invalid API credentials - please check your API key and secret')
      }
    } catch (error) {
      errors.push('Unable to connect to platform API - please check your network connection')
    }

    // Validate webhook setup if enabled
    if (config.enableWebhooks) {
      try {
        const webhookResponse = await fetch(`${this.getBaseUrl(config)}/webhooks`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'X-API-Secret': config.apiSecret
          }
        })

        if (!webhookResponse.ok) {
          warnings.push('Webhook setup may not be available with current API credentials')
        }
      } catch (error) {
        warnings.push('Unable to verify webhook capabilities')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Publish content to the platform
   */
  async publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult> {
    try {
      this.ensureInitialized()
      await this.rateLimitDelay(this.id)

      // Adapt content for this platform
      const adaptedContent = this.adaptContentForPlatform(content)

      // Prepare the API payload
      const payload = {
        title: adaptedContent.title,
        content: adaptedContent.content,
        tags: this.prepareTags(adaptedContent.tags, config),
        media: adaptedContent.media?.map(media => ({
          type: media.type,
          url: media.url,
          alt: media.alt
        })),
        metadata: adaptedContent.metadata
      }

      // Make the API request
      const response = await this.makeRequest(
        `${this.getBaseUrl()}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        },
        config
      )

      const result = await response.json()

      return {
        success: true,
        platformPostId: result.id,
        url: result.url,
        metadata: {
          publishedAt: result.published_at,
          status: result.status
        }
      }
    } catch (error) {
      return this.handleError(error, 'publishContent')
    }
  }

  /**
   * Set up webhook for content ingestion
   */
  async setupWebhook(webhookUrl: string, config: Record<string, any>): Promise<WebhookSetupResult> {
    try {
      this.ensureInitialized()

      const payload = {
        url: webhookUrl,
        events: ['post.created', 'post.updated', 'post.deleted'],
        active: true
      }

      const response = await this.makeRequest(
        `${this.getBaseUrl()}/webhooks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        },
        config
      )

      const result = await response.json()

      return {
        success: true,
        webhookId: result.id,
        webhookUrl: result.url
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup webhook'
      }
    }
  }

  /**
   * Process incoming webhook payload
   */
  async processWebhook(payload: any): Promise<IngestedContent | null> {
    try {
      // Validate webhook payload
      if (!payload.event || !payload.data) {
        return null
      }

      // Only process post creation events
      if (payload.event !== 'post.created') {
        return null
      }

      const postData = payload.data

      return {
        platformPostId: postData.id,
        title: postData.title,
        content: postData.content,
        author: postData.author?.name,
        publishedAt: new Date(postData.published_at),
        metadata: {
          tags: postData.tags || [],
          category: postData.category,
          status: postData.status,
          url: postData.url
        },
        media: postData.media?.map((media: any) => ({
          type: media.type,
          url: media.url,
          alt: media.alt,
          caption: media.caption
        }))
      }
    } catch (error) {
      console.error(`Failed to process webhook for ${this.name}:`, error)
      return null
    }
  }

  /**
   * Fetch content from the platform
   */
  async fetchContent(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    try {
      this.ensureInitialized()

      const params = new URLSearchParams()
      if (since) {
        params.append('since', since.toISOString())
      }
      params.append('limit', '50')

      const response = await this.makeRequest(
        `${this.getBaseUrl()}/posts?${params.toString()}`,
        { method: 'GET' },
        config
      )

      const data = await response.json()

      return data.posts.map((post: any) => ({
        platformPostId: post.id,
        title: post.title,
        content: post.content,
        author: post.author?.name,
        publishedAt: new Date(post.published_at),
        metadata: {
          tags: post.tags || [],
          category: post.category,
          status: post.status,
          url: post.url
        },
        media: post.media?.map((media: any) => ({
          type: media.type,
          url: media.url,
          alt: media.alt,
          caption: media.caption
        }))
      }))
    } catch (error) {
      console.error(`Failed to fetch content from ${this.name}:`, error)
      return []
    }
  }

  /**
   * Platform-specific health check
   */
  protected async performHealthCheck(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `${this.getBaseUrl()}/health`,
        { method: 'GET' },
        config
      )

      const data = await response.json()
      return data.status === 'healthy'
    } catch (error) {
      return false
    }
  }

  /**
   * Add authentication headers
   */
  protected async addAuthHeaders(headers: Headers, config: Record<string, any>): Promise<void> {
    headers.set('Authorization', `Bearer ${config.apiKey}`)
    headers.set('X-API-Secret', config.apiSecret)
    headers.set('User-Agent', 'Universal Blog Platform/1.0')
  }

  /**
   * Adapt content for this platform
   */
  protected adaptContentForPlatform(content: AdaptedContent): AdaptedContent {
    // Platform-specific content adaptation
    let adaptedContent = { ...content }

    // Example: Limit content length for this platform
    if (adaptedContent.content.length > 5000) {
      adaptedContent.content = adaptedContent.content.substring(0, 4950) + '...'
    }

    // Example: Convert hashtags to platform format
    if (adaptedContent.content.includes('#')) {
      adaptedContent.content = adaptedContent.content.replace(/#(\w+)/g, '@$1')
    }

    return adaptedContent
  }

  // Helper methods

  private getBaseUrl(config: Record<string, any> = this.config): string {
    return config.baseUrl || 'https://api.example-platform.com/v1'
  }

  private prepareTags(tags: string[] = [], config: Record<string, any>): string[] {
    const allTags = [...tags]

    // Add default tags if configured
    if (config.defaultTags) {
      const defaultTags = config.defaultTags.split(',').map((tag: string) => tag.trim())
      allTags.push(...defaultTags)
    }

    // Remove duplicates and return
    return [...new Set(allTags)]
  }
}
