import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getContentIngestionQueue } from './content-ingestion-queue'

export interface WebhookPayload {
  platform: string
  event: string
  data: any
  timestamp: string
  signature?: string
}

export interface ProcessedWebhook {
  success: boolean
  contentId?: string
  error?: string
  shouldRetry?: boolean
}

export class UniversalWebhookProcessor {
  private platformProcessors: Map<string, PlatformWebhookProcessor> = new Map()

  constructor() {
    this.initializePlatformProcessors()
  }

  private initializePlatformProcessors() {
    // Register platform-specific webhook processors
    this.platformProcessors.set('twitter', new TwitterWebhookProcessor())
    this.platformProcessors.set('linkedin', new LinkedInWebhookProcessor())
    this.platformProcessors.set('medium', new MediumWebhookProcessor())
    this.platformProcessors.set('devto', new DevToWebhookProcessor())
    this.platformProcessors.set('hashnode', new HashnodeWebhookProcessor())
    this.platformProcessors.set('github', new GitHubWebhookProcessor())
    this.platformProcessors.set('youtube', new YouTubeWebhookProcessor())
    this.platformProcessors.set('facebook', new FacebookWebhookProcessor())
    this.platformProcessors.set('instagram', new InstagramWebhookProcessor())
    this.platformProcessors.set('discord', new DiscordWebhookProcessor())
  }

  async processWebhook(request: NextRequest, platform: string): Promise<ProcessedWebhook> {
    try {
      // Extract webhook payload
      const payload = await this.extractPayload(request, platform)
      
      // Verify webhook signature
      const isValid = await this.verifySignature(request, platform, payload)
      if (!isValid) {
        return { success: false, error: 'Invalid webhook signature' }
      }

      // Get platform-specific processor
      const processor = this.platformProcessors.get(platform)
      if (!processor) {
        return { success: false, error: `No processor found for platform: ${platform}` }
      }

      // Process the webhook
      const result = await processor.process(payload)
      
      // Log webhook processing
      await this.logWebhookEvent(platform, payload, result)

      return result
    } catch (error) {
      console.error(`Webhook processing error for ${platform}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        shouldRetry: true
      }
    }
  }

  private async extractPayload(request: NextRequest, platform: string): Promise<any> {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      return await request.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      const payload: any = {}
      formData.forEach((value, key) => {
        payload[key] = value
      })
      return payload
    } else {
      return await request.text()
    }
  }

  private async verifySignature(request: NextRequest, platform: string, payload: any): Promise<boolean> {
    const signature = request.headers.get('x-hub-signature-256') || 
                     request.headers.get('x-signature') ||
                     request.headers.get('signature')

    if (!signature) {
      console.warn(`No signature found for ${platform} webhook`)
      return false
    }

    // Get platform-specific webhook secret
    const secret = await this.getWebhookSecret(platform)
    if (!secret) {
      console.warn(`No webhook secret configured for ${platform}`)
      return false
    }

    // Verify signature based on platform
    return this.verifyPlatformSignature(platform, payload, signature, secret)
  }

  private verifyPlatformSignature(platform: string, payload: any, signature: string, secret: string): boolean {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
    
    switch (platform) {
      case 'github':
        const expectedGitHub = `sha256=${crypto.createHmac('sha256', secret).update(payloadString).digest('hex')}`
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedGitHub))
      
      case 'twitter':
        // Twitter uses different signature format
        const expectedTwitter = crypto.createHmac('sha256', secret).update(payloadString).digest('base64')
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedTwitter))
      
      default:
        // Generic HMAC SHA256 verification
        const expected = crypto.createHmac('sha256', secret).update(payloadString).digest('hex')
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    }
  }

  private async getWebhookSecret(platform: string): Promise<string | null> {
    // Get webhook secret from environment or database
    const envKey = `WEBHOOK_SECRET_${platform.toUpperCase()}`
    return process.env[envKey] || process.env.WEBHOOK_SECRET || null
  }

  private async logWebhookEvent(platform: string, payload: any, result: ProcessedWebhook): Promise<void> {
    try {
      await prisma.webhookLog.create({
        data: {
          platform,
          event: payload.event || 'unknown',
          payload: JSON.stringify(payload),
          success: result.success,
          error: result.error,
          contentId: result.contentId,
          processedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log webhook event:', error)
    }
  }
}

// Base class for platform-specific webhook processors
export abstract class PlatformWebhookProcessor {
  abstract process(payload: any): Promise<ProcessedWebhook>
  
  protected async ingestContent(content: IngestedContent): Promise<string> {
    // Add content to ingestion queue for processing
    const job = await getContentIngestionQueue().add('ingest-content', content)
    return job.id
  }
}

// Platform-specific processors
export class TwitterWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    try {
      if (payload.tweet_create_events) {
        // Process new tweets
        for (const tweet of payload.tweet_create_events) {
          const content: IngestedContent = {
            platform: 'twitter',
            platformPostId: tweet.id_str,
            platformUserId: tweet.user.id_str,
            content: tweet.text,
            metadata: {
              createdAt: tweet.created_at,
              retweets: tweet.retweet_count,
              likes: tweet.favorite_count,
              hashtags: tweet.entities?.hashtags || [],
              mentions: tweet.entities?.user_mentions || [],
              urls: tweet.entities?.urls || []
            },
            originalData: tweet
          }
          
          const contentId = await this.ingestContent(content)
          return { success: true, contentId }
        }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

export class LinkedInWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    try {
      if (payload.eventType === 'SHARE') {
        const content: IngestedContent = {
          platform: 'linkedin',
          platformPostId: payload.objectUrn,
          platformUserId: payload.actor,
          content: payload.object?.commentary || '',
          metadata: {
            createdAt: new Date(payload.created?.time || Date.now()).toISOString(),
            visibility: payload.object?.visibility?.code,
            contentType: payload.object?.content?.contentType
          },
          originalData: payload
        }
        
        const contentId = await this.ingestContent(content)
        return { success: true, contentId }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

export class MediumWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    try {
      if (payload.event === 'post.published') {
        const content: IngestedContent = {
          platform: 'medium',
          platformPostId: payload.data.id,
          platformUserId: payload.data.authorId,
          content: payload.data.content,
          title: payload.data.title,
          metadata: {
            createdAt: payload.data.createdAt,
            publishedAt: payload.data.publishedAt,
            tags: payload.data.tags || [],
            claps: payload.data.virtuals?.totalClapCount || 0,
            url: payload.data.url
          },
          originalData: payload.data
        }
        
        const contentId = await this.ingestContent(content)
        return { success: true, contentId }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Additional platform processors would be implemented similarly...
export class DevToWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for Dev.to webhooks
    return { success: true }
  }
}

export class HashnodeWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for Hashnode webhooks
    return { success: true }
  }
}

export class GitHubWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for GitHub webhooks
    return { success: true }
  }
}

export class YouTubeWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for YouTube webhooks
    return { success: true }
  }
}

export class FacebookWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for Facebook webhooks
    return { success: true }
  }
}

export class InstagramWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for Instagram webhooks
    return { success: true }
  }
}

export class DiscordWebhookProcessor extends PlatformWebhookProcessor {
  async process(payload: any): Promise<ProcessedWebhook> {
    // Implementation for Discord webhooks
    return { success: true }
  }
}

// Types
export interface IngestedContent {
  platform: string
  platformPostId: string
  platformUserId: string
  content: string
  title?: string
  metadata: Record<string, any>
  originalData: any
}

// Export singleton instance
export const webhookProcessor = new UniversalWebhookProcessor()
