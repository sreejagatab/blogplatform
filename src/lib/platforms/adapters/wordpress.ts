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
 * WordPress Platform Adapter
 * 
 * Supports both WordPress.com and self-hosted WordPress sites via REST API
 * Provides bidirectional content sync with RSS feeds and REST API
 */
export default class WordPressAdapter extends BasePlatformAdapter {
  readonly id = 'wordpress'
  readonly name = 'WordPress'
  readonly description = 'Publish to WordPress.com or self-hosted WordPress sites via REST API'
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
      webhooks: false,
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

  readonly configuration: PlatformConfiguration = {
    fields: [
      createConfigField('siteUrl', 'WordPress Site URL', 'url', true, {
        description: 'Your WordPress site URL (e.g., https://yoursite.com or https://yoursite.wordpress.com)',
        placeholder: 'https://yoursite.com'
      }),
      createConfigField('username', 'Username', 'text', true, {
        description: 'Your WordPress username'
      }),
      createConfigField('applicationPassword', 'Application Password', 'password', true, {
        description: 'WordPress Application Password (not your regular password)',
        placeholder: 'xxxx xxxx xxxx xxxx xxxx xxxx'
      }),
      createConfigField('defaultStatus', 'Default Post Status', 'select', false, {
        description: 'Default status for published posts',
        options: [
          { value: 'publish', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'private', label: 'Private' }
        ]
      }),
      createConfigField('defaultCategory', 'Default Category ID', 'number', false, {
        description: 'Default category ID for posts (optional)',
        placeholder: '1'
      }),
      createConfigField('enableRSSSync', 'Enable RSS Sync', 'boolean', false, {
        description: 'Enable automatic content ingestion via RSS feed'
      })
    ],
    validation: createConfigurationSchema({
      siteUrl: z.string().url('Invalid site URL'),
      username: z.string().min(1, 'Username is required'),
      applicationPassword: z.string().min(1, 'Application password is required'),
      defaultStatus: z.enum(['publish', 'draft', 'private']).optional().default('publish'),
      defaultCategory: z.number().optional(),
      enableRSSSync: z.boolean().optional().default(false)
    }),
    instructions: `
      To set up WordPress integration:
      1. Go to your WordPress admin dashboard
      2. Navigate to Users → Profile
      3. Scroll down to "Application Passwords"
      4. Create a new application password
      5. Copy the generated password (it will look like: xxxx xxxx xxxx xxxx xxxx xxxx)
      6. Use this password in the "Application Password" field above
      
      For WordPress.com sites, you may need to enable the REST API in your site settings.
    `,
    helpUrl: 'https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/'
  }

  protected async customValidation(config: Record<string, any>) {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Test authentication
      const response = await fetch(`${config.siteUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.username}:${config.applicationPassword}`).toString('base64')}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          errors.push('Authentication failed - please check your username and application password')
        } else if (response.status === 404) {
          errors.push('WordPress REST API not found - please check your site URL')
        } else {
          errors.push(`WordPress API error: ${response.status} ${response.statusText}`)
        }
      } else {
        const userData = await response.json()
        if (!userData.capabilities?.edit_posts) {
          warnings.push('User may not have permission to create posts')
        }
      }

      // Test categories endpoint if default category is specified
      if (config.defaultCategory) {
        const categoryResponse = await fetch(`${config.siteUrl}/wp-json/wp/v2/categories/${config.defaultCategory}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${config.username}:${config.applicationPassword}`).toString('base64')}`
          }
        })

        if (!categoryResponse.ok) {
          warnings.push(`Default category ID ${config.defaultCategory} not found`)
        }
      }

    } catch (error) {
      errors.push('Unable to connect to WordPress site - please check the URL and network connection')
    }

    return { valid: errors.length === 0, errors, warnings }
  }

  async publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult> {
    try {
      this.ensureInitialized()
      await this.rateLimitDelay(this.id)

      const adaptedContent = this.adaptContentForPlatform(content)

      // Prepare WordPress post data
      const postData: any = {
        title: adaptedContent.title || 'Untitled Post',
        content: this.formatContentForWordPress(adaptedContent.content),
        status: config.defaultStatus || 'publish',
        excerpt: adaptedContent.metadata?.excerpt || '',
        format: 'standard'
      }

      // Add category if specified
      if (config.defaultCategory) {
        postData.categories = [config.defaultCategory]
      }

      // Add tags if available
      if (adaptedContent.tags && adaptedContent.tags.length > 0) {
        // First, get or create tags
        const tagIds = await this.getOrCreateTags(adaptedContent.tags, config)
        if (tagIds.length > 0) {
          postData.tags = tagIds
        }
      }

      // Handle featured image if available
      if (adaptedContent.media && adaptedContent.media.length > 0) {
        const featuredImage = adaptedContent.media.find(m => m.type === 'image')
        if (featuredImage) {
          try {
            const mediaId = await this.uploadMedia(featuredImage.url, config)
            if (mediaId) {
              postData.featured_media = mediaId
            }
          } catch (error) {
            console.warn('Failed to upload featured image:', error)
          }
        }
      }

      // Create the post
      const response = await this.makeRequest(
        `${config.siteUrl}/wp-json/wp/v2/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        },
        config
      )

      const result = await response.json()

      return {
        success: true,
        platformPostId: result.id.toString(),
        url: result.link,
        metadata: {
          status: result.status,
          publishedAt: result.date,
          modifiedAt: result.modified,
          slug: result.slug
        }
      }
    } catch (error) {
      return this.handleError(error, 'publishContent')
    }
  }

  async fetchContent(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    try {
      this.ensureInitialized()

      const params = new URLSearchParams({
        per_page: '50',
        status: 'publish',
        _embed: 'true'
      })

      if (since) {
        params.append('after', since.toISOString())
      }

      const response = await this.makeRequest(
        `${config.siteUrl}/wp-json/wp/v2/posts?${params.toString()}`,
        { method: 'GET' },
        config
      )

      const posts = await response.json()

      return posts.map((post: any) => ({
        platformPostId: post.id.toString(),
        title: post.title?.rendered || 'Untitled',
        content: this.stripWordPressHTML(post.content?.rendered || ''),
        author: post._embedded?.author?.[0]?.name,
        publishedAt: new Date(post.date),
        metadata: {
          slug: post.slug,
          status: post.status,
          excerpt: post.excerpt?.rendered,
          categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => cat.name) || [],
          tags: post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
          url: post.link,
          modifiedAt: post.modified
        },
        media: this.extractMediaFromPost(post)
      }))
    } catch (error) {
      console.error('Failed to fetch WordPress content:', error)
      return []
    }
  }

  async getAnalytics(postId: string, config: Record<string, any>): Promise<PostAnalytics> {
    try {
      // WordPress doesn't provide built-in analytics via REST API
      // This would require a plugin like Jetpack or Google Analytics integration
      return {
        views: 0 // Placeholder
      }
    } catch (error) {
      console.error('Failed to get WordPress analytics:', error)
      return {}
    }
  }

  protected async performHealthCheck(config: Record<string, any>): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `${config.siteUrl}/wp-json/wp/v2/users/me`,
        { method: 'GET' },
        config
      )
      return response.ok
    } catch (error) {
      return false
    }
  }

  protected async addAuthHeaders(headers: Headers, config: Record<string, any>): Promise<void> {
    const credentials = Buffer.from(`${config.username}:${config.applicationPassword}`).toString('base64')
    headers.set('Authorization', `Basic ${credentials}`)
  }

  // Helper methods

  private formatContentForWordPress(content: string): string {
    // Convert markdown-style formatting to HTML if needed
    let formatted = content

    // Convert line breaks to paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p>')
    formatted = `<p>${formatted}</p>`

    // Clean up empty paragraphs
    formatted = formatted.replace(/<p><\/p>/g, '')

    return formatted
  }

  private stripWordPressHTML(html: string): string {
    // Remove WordPress-specific HTML and convert to clean text
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Decode HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  private async getOrCreateTags(tags: string[], config: Record<string, any>): Promise<number[]> {
    const tagIds: number[] = []

    for (const tagName of tags) {
      try {
        // First, try to find existing tag
        const searchResponse = await this.makeRequest(
          `${config.siteUrl}/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`,
          { method: 'GET' },
          config
        )

        const existingTags = await searchResponse.json()
        const existingTag = existingTags.find((tag: any) => 
          tag.name.toLowerCase() === tagName.toLowerCase()
        )

        if (existingTag) {
          tagIds.push(existingTag.id)
        } else {
          // Create new tag
          const createResponse = await this.makeRequest(
            `${config.siteUrl}/wp-json/wp/v2/tags`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: tagName })
            },
            config
          )

          const newTag = await createResponse.json()
          tagIds.push(newTag.id)
        }
      } catch (error) {
        console.warn(`Failed to process tag "${tagName}":`, error)
      }
    }

    return tagIds
  }

  private async uploadMedia(mediaUrl: string, config: Record<string, any>): Promise<number | null> {
    try {
      // Download the media file
      const mediaResponse = await fetch(mediaUrl)
      if (!mediaResponse.ok) return null

      const mediaBlob = await mediaResponse.blob()
      const filename = mediaUrl.split('/').pop() || 'image.jpg'

      // Upload to WordPress
      const formData = new FormData()
      formData.append('file', mediaBlob, filename)

      const uploadResponse = await this.makeRequest(
        `${config.siteUrl}/wp-json/wp/v2/media`,
        {
          method: 'POST',
          body: formData
        },
        config
      )

      const result = await uploadResponse.json()
      return result.id
    } catch (error) {
      console.error('Failed to upload media to WordPress:', error)
      return null
    }
  }

  private extractMediaFromPost(post: any): any[] {
    const media: any[] = []

    // Extract featured image
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      const featuredMedia = post._embedded['wp:featuredmedia'][0]
      media.push({
        type: 'image',
        url: featuredMedia.source_url,
        alt: featuredMedia.alt_text,
        caption: featuredMedia.caption?.rendered
      })
    }

    return media
  }
}
