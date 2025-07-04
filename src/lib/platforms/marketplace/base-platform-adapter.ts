import { z } from 'zod'
import {
  PlatformAdapter,
  PlatformCategory,
  PlatformCapabilities,
  PlatformConfiguration,
  ValidationResult,
  PublishResult,
  ScheduleResult,
  WebhookSetupResult,
  IngestedContent,
  PostAnalytics,
  HealthCheckResult,
  AdaptedContent
} from './platform-adapter-registry'

/**
 * Base class for platform adapters that provides common functionality
 * and enforces the adapter interface
 */
export abstract class BasePlatformAdapter implements PlatformAdapter {
  // Abstract properties that must be implemented by subclasses
  abstract readonly id: string
  abstract readonly name: string
  abstract readonly description: string
  abstract readonly version: string
  abstract readonly author: string
  abstract readonly category: PlatformCategory
  abstract readonly capabilities: PlatformCapabilities
  abstract readonly configuration: PlatformConfiguration

  // Common configuration storage
  protected config: Record<string, any> = {}
  protected initialized = false

  /**
   * Initialize the adapter with configuration
   */
  async initialize(config: Record<string, any>): Promise<void> {
    // Validate configuration
    const validation = await this.validateConfiguration(config)
    if (!validation.valid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`)
    }

    this.config = config
    this.initialized = true

    // Perform adapter-specific initialization
    await this.onInitialize(config)
  }

  /**
   * Validate configuration against the schema
   */
  async validateConfiguration(config: Record<string, any>): Promise<ValidationResult> {
    try {
      this.configuration.validation.parse(config)
      
      // Perform additional custom validation
      const customValidation = await this.customValidation(config)
      
      return {
        valid: customValidation.valid,
        errors: customValidation.errors,
        warnings: customValidation.warnings
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }
      }
      
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Unknown validation error']
      }
    }
  }

  /**
   * Publish content to the platform
   */
  abstract publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult>

  /**
   * Schedule content for future publishing
   */
  async scheduleContent(content: AdaptedContent, scheduleTime: Date, config: Record<string, any>): Promise<ScheduleResult> {
    // Default implementation - can be overridden by subclasses
    return {
      success: false,
      error: 'Scheduling not supported by this platform'
    }
  }

  /**
   * Set up webhook for content ingestion
   */
  async setupWebhook?(webhookUrl: string, config: Record<string, any>): Promise<WebhookSetupResult> {
    // Default implementation - can be overridden by subclasses
    return {
      success: false,
      error: 'Webhooks not supported by this platform'
    }
  }

  /**
   * Process incoming webhook payload
   */
  async processWebhook?(payload: any): Promise<IngestedContent | null> {
    // Default implementation - can be overridden by subclasses
    return null
  }

  /**
   * Fetch content from the platform
   */
  async fetchContent?(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    // Default implementation - can be overridden by subclasses
    return []
  }

  /**
   * Get analytics for a published post
   */
  async getAnalytics?(postId: string, config: Record<string, any>): Promise<PostAnalytics> {
    // Default implementation - can be overridden by subclasses
    return {}
  }

  /**
   * Perform health check
   */
  async healthCheck(config: Record<string, any>): Promise<HealthCheckResult> {
    const startTime = Date.now()
    
    try {
      // Perform platform-specific health check
      const isHealthy = await this.performHealthCheck(config)
      const latency = Date.now() - startTime
      
      return {
        healthy: isHealthy,
        status: isHealthy ? 'online' : 'offline',
        latency,
        lastChecked: new Date()
      }
    } catch (error) {
      return {
        healthy: false,
        status: 'offline',
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      }
    }
  }

  // Protected methods for subclasses to implement

  /**
   * Adapter-specific initialization logic
   */
  protected async onInitialize(config: Record<string, any>): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Custom validation logic beyond schema validation
   */
  protected async customValidation(config: Record<string, any>): Promise<ValidationResult> {
    // Override in subclasses for custom validation
    return { valid: true, errors: [] }
  }

  /**
   * Platform-specific health check logic
   */
  protected abstract performHealthCheck(config: Record<string, any>): Promise<boolean>

  // Utility methods for subclasses

  /**
   * Make authenticated HTTP request
   */
  protected async makeRequest(
    url: string,
    options: RequestInit = {},
    config: Record<string, any> = this.config
  ): Promise<Response> {
    const headers = new Headers(options.headers)
    
    // Add authentication headers based on platform configuration
    await this.addAuthHeaders(headers, config)
    
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  }

  /**
   * Add authentication headers to request
   */
  protected async addAuthHeaders(headers: Headers, config: Record<string, any>): Promise<void> {
    // Override in subclasses to add platform-specific auth headers
  }

  /**
   * Rate limiting helper
   */
  protected async rateLimitDelay(platform: string): Promise<void> {
    // Implement rate limiting logic
    // This could be enhanced with Redis-based rate limiting
    const delay = this.getRateLimitDelay(platform)
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  /**
   * Get rate limit delay for platform
   */
  protected getRateLimitDelay(platform: string): number {
    // Platform-specific rate limiting
    const rateLimits: Record<string, number> = {
      twitter: 1000,    // 1 second
      linkedin: 2000,   // 2 seconds
      facebook: 1500,   // 1.5 seconds
      instagram: 2000,  // 2 seconds
      default: 1000     // 1 second default
    }
    
    return rateLimits[platform] || rateLimits.default
  }

  /**
   * Content adaptation helper
   */
  protected adaptContentForPlatform(content: AdaptedContent): AdaptedContent {
    // Platform-specific content adaptation
    // Override in subclasses for platform-specific formatting
    return content
  }

  /**
   * Error handling helper
   */
  protected handleError(error: any, context: string): PublishResult {
    console.error(`${this.name} adapter error in ${context}:`, error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }

  /**
   * Validate required configuration fields
   */
  protected validateRequiredFields(config: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !config[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`)
    }
  }

  /**
   * Get configuration value with fallback
   */
  protected getConfigValue(key: string, defaultValue?: any): any {
    return this.config[key] ?? defaultValue
  }

  /**
   * Check if adapter is properly initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(`${this.name} adapter is not initialized`)
    }
  }
}

/**
 * Helper function to create configuration schema
 */
export function createConfigurationSchema(fields: Record<string, z.ZodTypeAny>): z.ZodSchema {
  return z.object(fields)
}

/**
 * Helper function to create configuration field
 */
export function createConfigField(
  key: string,
  label: string,
  type: 'text' | 'password' | 'url' | 'select' | 'boolean' | 'number',
  required: boolean = true,
  options?: { description?: string; placeholder?: string; options?: { value: string; label: string }[] }
) {
  return {
    key,
    label,
    type,
    required,
    ...options
  }
}

/**
 * Helper function to create platform capabilities
 */
export function createCapabilities(overrides: Partial<PlatformCapabilities> = {}): PlatformCapabilities {
  return {
    publishing: {
      text: true,
      images: false,
      videos: false,
      links: true,
      polls: false,
      scheduling: false,
      drafts: false,
      ...overrides.publishing
    },
    ingestion: {
      webhooks: false,
      rss: false,
      api: false,
      realtime: false,
      ...overrides.ingestion
    },
    analytics: {
      views: false,
      engagement: false,
      demographics: false,
      performance: false,
      ...overrides.analytics
    },
    authentication: {
      oauth1: false,
      oauth2: false,
      apiKey: false,
      custom: false,
      ...overrides.authentication
    }
  }
}
