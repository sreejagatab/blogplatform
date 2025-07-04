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
  PostAnalytics
} from '../marketplace/platform-adapter-registry'

/**
 * Ghost Platform Adapter
 * 
 * Supports Ghost CMS via Admin API for publishing and Content API for reading
 * Provides full bidirectional content sync with advanced features
 */
export default class GhostAdapter extends BasePlatformAdapter {
  readonly id = 'ghost'
  readonly name = 'Ghost'
  readonly description = 'Publish to Ghost CMS and sync content via Ghost APIs'
  readonly version = '1.0.0'
  readonly author = 'Universal Blog Platform'
  readonly category = PlatformCategory.BLOGGING

  readonly capabilities: PlatformCapabilities = createCapabilities({
    publishing: {
      text: true,
      images: true,
      videos: true,
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
      engagement: false,
      demographics: false,
      performance: true
    },
    authentication: {
      oauth1: false,
      oauth2: false,
      apiKey: true,
      custom: false
    }
  })

  readonly configuration: PlatformConfiguration = {
    fields: [
      createConfigField('ghostUrl', 'Ghost Site URL', 'url', true, {
        description: 'Your Ghost site URL (e.g., https://yoursite.com)',
        placeholder: 'https://yoursite.com'
      }),
      createConfigField('adminApiKey', 'Admin API Key', 'password', true, {
        description: 'Ghost Admin API Key for publishing content'
      }),
      createConfigField('contentApiKey', 'Content API Key', 'password', false, {
        description: 'Ghost Content API Key for reading content (optional)'
      }),
      createConfigField('defaultAuthor', 'Default Author ID', 'text', false, {
        description: 'Default author ID for published posts',
        placeholder: 'author-id'
      }),
      createConfigField('defaultStatus', 'Default Post Status', 'select', false, {
        description: 'Default status for published posts',
        options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' }
        ]
      }),
      createConfigField('defaultTags', 'Default Tags', 'text', false, {
        description: 'Comma-separated default tags for all posts',
        placeholder: 'blog,automation'
      })
    ],
    validation: createConfigurationSchema({
      ghostUrl: z.string().url('Invalid Ghost site URL'),
      adminApiKey: z.string().min(1, 'Admin API Key is required'),
      contentApiKey: z.string().optional(),
      defaultAuthor: z.string().optional(),
      defaultStatus: z.enum(['published', 'draft', 'scheduled']).optional().default('published'),
      defaultTags: z.string().optional()
    }),
    instructions: `
      To set up Ghost integration:
      1. Go to your Ghost Admin panel
      2. Navigate to Settings → Integrations
      3. Click "Add custom integration"
      4. Copy the Admin API Key and Content API Key
      5. Get your author ID from Settings → Staff
      
      The Admin API Key is required for publishing content.
      The Content API Key is optional but recommended for content sync.
    `,
    helpUrl: 'https://ghost.org/docs/admin-api/'
  }

  protected async customValidation(config: Record<string, any>) {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Test Admin API
      const adminResponse = await fetch(`${config.ghostUrl}/ghost/api/admin/site/`, {
        headers: {
          'Authorization': `Ghost ${this.generateJWT(config.adminApiKey)}`,
          'Content-Type': 'application/json'
        }
      })

      if (!adminResponse.ok) {
        if (adminResponse.status === 401) {
          errors.push('Invalid Admin API Key')
        } else {
          errors.push(`Ghost Admin API error: ${adminResponse.status}`)
        }
      }

      // Test Content API if provided
      if (config.contentApiKey) {
        const contentResponse = await fetch(
          `${config.ghostUrl}/ghost/api/content/posts/?key=${config.contentApiKey}&limit=1`
        )

        if (!contentResponse.ok) {
          warnings.push('Content API Key may be invalid - content sync may not work')
        }
      } else {
        warnings.push('Content API Key not provided - content sync will be limited')
      }

      // Validate author ID if provided
      if (config.defaultAuthor) {
        try {
          const authorResponse = await fetch(
            `${config.ghostUrl}/ghost/api/admin/users/${config.defaultAuthor}/`,
            {
              headers: {
                'Authorization': `Ghost ${this.generateJWT(config.adminApiKey)}`
              }
            }
          )

          if (!authorResponse.ok) {
            warnings.push(`Default author ID "${config.defaultAuthor}" not found`)
          }
        } catch (error) {
          warnings.push('Unable to verify default author ID')
        }
      }

    } catch (error) {
      errors.push('Unable to connect to Ghost site - please check the URL and API keys')
    }

    return { valid: errors.length === 0, errors, warnings }
  }

  async publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult> {
    try {
      this.ensureInitialized()
      await this.rateLimitDelay(this.id)

      const adaptedContent = this.adaptContentForPlatform(content)

      // Prepare Ghost post data
      const postData: any = {
        title: adaptedContent.title || 'Untitled Post',
        html: this.formatContentForGhost(adaptedContent.content),
        status: config.defaultStatus || 'published',
        excerpt: adaptedContent.metadata?.excerpt || this.generateExcerpt(adaptedContent.content),
        meta_title: adaptedContent.title,
        meta_description: adaptedContent.metadata?.description || this.generateExcerpt(adaptedContent.content)
      }

      // Add author if specified
      if (config.defaultAuthor) {
        postData.authors = [config.defaultAuthor]
      }

      // Add tags
      const tags = this.prepareTags(adaptedContent.tags, config)
      if (tags.length > 0) {
        postData.tags = tags
      }

      // Handle featured image
      if (adaptedContent.media && adaptedContent.media.length > 0) {
        const featuredImage = adaptedContent.media.find(m => m.type === 'image')
        if (featuredImage) {
          postData.feature_image = featuredImage.url
          postData.feature_image_alt = featuredImage.alt
          postData.feature_image_caption = featuredImage.caption
        }
      }

      // Create the post
      const response = await this.makeRequest(
        `${config.ghostUrl}/ghost/api/admin/posts/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ posts: [postData] })
        },
        config
      )

      const result = await response.json()
      const post = result.posts[0]

      return {
        success: true,
        platformPostId: post.id,
        url: post.url,
        metadata: {
          status: post.status,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          slug: post.slug,
          uuid: post.uuid
        }
      }
    } catch (error) {
      return this.handleError(error, 'publishContent')
    }
  }

  async fetchContent(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    try {
      this.ensureInitialized()

      if (!config.contentApiKey) {
        console.warn('Content API Key not configured - using RSS fallback')
        return this.fetchContentViaRSS(config, since)
      }

      const params = new URLSearchParams({
        key: config.contentApiKey,
        limit: '50',
        include: 'authors,tags',
        formats: 'html,plaintext'
      })

      if (since) {
        params.append('filter', `published_at:>'${since.toISOString()}'`)
      }

      const response = await fetch(
        `${config.ghostUrl}/ghost/api/content/posts/?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`Ghost Content API error: ${response.status}`)
      }

      const data = await response.json()

      return data.posts.map((post: any) => ({
        platformPostId: post.id,
        title: post.title,
        content: post.plaintext || this.stripHTML(post.html),
        author: post.authors?.[0]?.name,
        publishedAt: new Date(post.published_at),
        metadata: {
          slug: post.slug,
          excerpt: post.excerpt,
          status: post.status,
          tags: post.tags?.map((tag: any) => tag.name) || [],
          url: post.url,
          uuid: post.uuid,
          featureImage: post.feature_image,
          updatedAt: post.updated_at,
          readingTime: post.reading_time
        },
        media: post.feature_image ? [{
          type: 'image' as const,
          url: post.feature_image,
          alt: post.feature_image_alt,
          caption: post.feature_image_caption
        }] : []
      }))
    } catch (error) {
      console.error('Failed to fetch Ghost content via API, trying RSS:', error)
      return this.fetchContentViaRSS(config, since)
    }
  }

  async getAnalytics(postId: string, config: Record<string, any>): Promise<PostAnalytics> {
    try {
      // Ghost doesn't provide built-in analytics via API
      // This would require Ghost Pro or custom analytics integration
      return {}
    } catch (error) {
      console.error('Failed to get Ghost analytics:', error)
      return {}
    }
  }

  protected async performHealthCheck(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(`${config.ghostUrl}/ghost/api/admin/site/`, {
        headers: {
          'Authorization': `Ghost ${this.generateJWT(config.adminApiKey)}`
        }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  protected async addAuthHeaders(headers: Headers, config: Record<string, any>): Promise<void> {
    headers.set('Authorization', `Ghost ${this.generateJWT(config.adminApiKey)}`)
  }

  // Helper methods

  private generateJWT(apiKey: string): string {
    // Ghost Admin API requires JWT authentication
    // This is a simplified version - in production, use a proper JWT library
    const [id, secret] = apiKey.split(':')
    
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      kid: id
    }

    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutes
      aud: '/admin/'
    }

    // In a real implementation, use a proper JWT library like 'jsonwebtoken'
    // This is a placeholder that would need proper JWT signing
    return `${Buffer.from(JSON.stringify(header)).toString('base64')}.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`
  }

  private formatContentForGhost(content: string): string {
    // Convert content to HTML format for Ghost
    let formatted = content

    // Convert markdown-style formatting to HTML
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
    formatted = formatted.replace(/\n\n/g, '</p><p>')
    formatted = `<p>${formatted}</p>`

    // Clean up empty paragraphs
    formatted = formatted.replace(/<p><\/p>/g, '')

    return formatted
  }

  private stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  private generateExcerpt(content: string): string {
    const plainText = this.stripHTML(content)
    return plainText.length > 160 
      ? plainText.substring(0, 157) + '...'
      : plainText
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

  private async fetchContentViaRSS(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    try {
      const rssUrl = `${config.ghostUrl}/rss/`
      
      const { rssFeedProcessor } = await import('../../inbound/rss-feed-processor')
      const parsedFeed = await rssFeedProcessor.parseFeed(rssUrl)

      let items = parsedFeed.items
      if (since) {
        items = items.filter(item => {
          if (!item.pubDate) return true
          return new Date(item.pubDate) > since
        })
      }

      return items.map(item => ({
        platformPostId: item.guid || item.link || `ghost-${Date.now()}`,
        title: item.title || 'Untitled',
        content: this.stripHTML(item.content || item.description || ''),
        author: item.author,
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
        metadata: {
          url: item.link,
          categories: item.categories || [],
          feedTitle: parsedFeed.title,
          feedUrl: rssUrl
        }
      }))
    } catch (error) {
      console.error('Failed to fetch Ghost content via RSS:', error)
      return []
    }
  }
}
