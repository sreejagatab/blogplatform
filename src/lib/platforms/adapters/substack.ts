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
  IngestedContent
} from '../marketplace/platform-adapter-registry'

/**
 * Substack Platform Adapter
 * 
 * Supports content ingestion via RSS feeds and publishing via email drafts
 * Note: Substack doesn't have a public API for publishing, so this adapter
 * focuses on content ingestion and provides draft creation via email
 */
export default class SubstackAdapter extends BasePlatformAdapter {
  readonly id = 'substack'
  readonly name = 'Substack'
  readonly description = 'Sync content from Substack newsletters via RSS feeds'
  readonly version = '1.0.0'
  readonly author = 'Universal Blog Platform'
  readonly category = PlatformCategory.BLOGGING

  readonly capabilities: PlatformCapabilities = createCapabilities({
    publishing: {
      text: true,
      images: false,
      videos: false,
      links: true,
      polls: false,
      scheduling: false,
      drafts: true
    },
    ingestion: {
      webhooks: false,
      rss: true,
      api: false,
      realtime: false
    },
    analytics: {
      views: false,
      engagement: false,
      demographics: false,
      performance: false
    },
    authentication: {
      oauth1: false,
      oauth2: false,
      apiKey: false,
      custom: true
    }
  })

  readonly configuration: PlatformConfiguration = {
    fields: [
      createConfigField('substackUrl', 'Substack Publication URL', 'url', true, {
        description: 'Your Substack publication URL (e.g., https://yourname.substack.com)',
        placeholder: 'https://yourname.substack.com'
      }),
      createConfigField('authorEmail', 'Author Email', 'text', false, {
        description: 'Email address for draft creation (optional)',
        placeholder: 'your-email@example.com'
      }),
      createConfigField('enableRSSSync', 'Enable RSS Sync', 'boolean', true, {
        description: 'Enable automatic content ingestion via RSS feed'
      }),
      createConfigField('syncFrequency', 'Sync Frequency (hours)', 'number', false, {
        description: 'How often to check for new content (in hours)',
        placeholder: '6'
      })
    ],
    validation: createConfigurationSchema({
      substackUrl: z.string().url('Invalid Substack URL').refine(
        url => url.includes('substack.com'),
        'Must be a valid Substack URL'
      ),
      authorEmail: z.string().email('Invalid email address').optional(),
      enableRSSSync: z.boolean().default(true),
      syncFrequency: z.number().min(1).max(168).optional().default(6)
    }),
    instructions: `
      To set up Substack integration:
      1. Enter your Substack publication URL (e.g., https://yourname.substack.com)
      2. Optionally provide your email for draft creation features
      3. Enable RSS sync to automatically import your Substack posts
      
      Note: Substack doesn't provide a public API for publishing, so this adapter
      focuses on content ingestion. Publishing features create email drafts.
    `,
    helpUrl: 'https://support.substack.com/hc/en-us/articles/360037466012-RSS-feeds'
  }

  protected async customValidation(config: Record<string, any>) {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Test RSS feed accessibility
      const rssUrl = `${config.substackUrl}/feed`
      const response = await fetch(rssUrl, { method: 'HEAD' })

      if (!response.ok) {
        if (response.status === 404) {
          errors.push('Substack RSS feed not found - please check your publication URL')
        } else {
          warnings.push(`RSS feed returned status ${response.status} - content sync may not work properly`)
        }
      }

      // Validate Substack URL format
      if (!config.substackUrl.match(/^https:\/\/[\w-]+\.substack\.com\/?$/)) {
        warnings.push('URL format may not be correct - expected format: https://yourname.substack.com')
      }

    } catch (error) {
      warnings.push('Unable to verify RSS feed accessibility - please check your network connection')
    }

    return { valid: errors.length === 0, errors, warnings }
  }

  async publishContent(content: AdaptedContent, config: Record<string, any>): Promise<PublishResult> {
    try {
      this.ensureInitialized()

      // Since Substack doesn't have a public API, we'll create an email draft
      if (!config.authorEmail) {
        return {
          success: false,
          error: 'Author email is required for Substack publishing. Please configure your email address.'
        }
      }

      const adaptedContent = this.adaptContentForPlatform(content)
      
      // Create email draft content
      const emailSubject = `[DRAFT] ${adaptedContent.title || 'New Post'}`
      const emailBody = this.formatContentForEmail(adaptedContent)

      // In a real implementation, this would integrate with an email service
      // For now, we'll return instructions for manual publishing
      return {
        success: true,
        platformPostId: `draft-${Date.now()}`,
        metadata: {
          draftInstructions: `
            To publish this content to Substack:
            1. Go to your Substack dashboard
            2. Click "New post"
            3. Copy the title: ${adaptedContent.title}
            4. Copy the content below:
            
            ${emailBody}
            
            5. Publish or schedule as desired
          `,
          emailSubject,
          emailBody
        }
      }
    } catch (error) {
      return this.handleError(error, 'publishContent')
    }
  }

  async fetchContent(config: Record<string, any>, since?: Date): Promise<IngestedContent[]> {
    try {
      this.ensureInitialized()

      if (!config.enableRSSSync) {
        return []
      }

      const rssUrl = `${config.substackUrl}/feed`
      
      // Use the RSS feed processor
      const { rssFeedProcessor } = await import('../../inbound/rss-feed-processor')
      const parsedFeed = await rssFeedProcessor.parseFeed(rssUrl)

      // Filter by date if specified
      let items = parsedFeed.items
      if (since) {
        items = items.filter(item => {
          if (!item.pubDate) return true
          return new Date(item.pubDate) > since
        })
      }

      return items.map(item => ({
        platformPostId: item.guid || item.link || `substack-${Date.now()}`,
        title: item.title || 'Untitled',
        content: this.cleanSubstackContent(item.content || item.description || ''),
        author: item.author || this.extractAuthorFromFeed(parsedFeed),
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
        metadata: {
          url: item.link,
          categories: item.categories || [],
          feedTitle: parsedFeed.title,
          feedUrl: rssUrl,
          excerpt: this.extractExcerpt(item.description || ''),
          substackSpecific: {
            isNewsletter: true,
            publicationName: this.extractPublicationName(config.substackUrl)
          }
        }
      }))
    } catch (error) {
      console.error('Failed to fetch Substack content:', error)
      return []
    }
  }

  protected async performHealthCheck(config: Record<string, any>): Promise<boolean> {
    try {
      const rssUrl = `${config.substackUrl}/feed`
      const response = await fetch(rssUrl, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      return false
    }
  }

  protected async addAuthHeaders(headers: Headers, config: Record<string, any>): Promise<void> {
    // Substack RSS feeds are public, no authentication needed
    headers.set('User-Agent', 'Universal Blog Platform RSS Reader/1.0')
  }

  // Helper methods

  private formatContentForEmail(content: AdaptedContent): string {
    let formatted = content.content

    // Add title if available
    if (content.title) {
      formatted = `# ${content.title}\n\n${formatted}`
    }

    // Add tags if available
    if (content.tags && content.tags.length > 0) {
      formatted += `\n\nTags: ${content.tags.join(', ')}`
    }

    // Add source attribution
    formatted += '\n\n---\n*This content was created using Universal Blog Platform*'

    return formatted
  }

  private cleanSubstackContent(content: string): string {
    // Remove Substack-specific HTML and formatting
    let cleaned = content

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '')

    // Decode HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    // Remove Substack footer content
    cleaned = cleaned.replace(/Thanks for reading.*?Subscribe to get full access to the newsletter and website\./gs, '')
    cleaned = cleaned.replace(/Leave a comment/g, '')

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()

    return cleaned
  }

  private extractAuthorFromFeed(feed: any): string {
    // Try to extract author from feed metadata
    if (feed.title) {
      // Substack feeds often have format "Publication Name by Author Name"
      const match = feed.title.match(/by\s+(.+)$/i)
      if (match) {
        return match[1].trim()
      }
    }

    return 'Unknown Author'
  }

  private extractExcerpt(description: string): string {
    const cleaned = this.cleanSubstackContent(description)
    
    // Return first 160 characters as excerpt
    if (cleaned.length <= 160) {
      return cleaned
    }

    const truncated = cleaned.substring(0, 160)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  private extractPublicationName(substackUrl: string): string {
    // Extract publication name from URL
    const match = substackUrl.match(/https:\/\/([\w-]+)\.substack\.com/)
    return match ? match[1] : 'Unknown Publication'
  }

  protected adaptContentForPlatform(content: AdaptedContent): AdaptedContent {
    // Substack-specific content adaptation
    let adaptedContent = { ...content }

    // Substack supports markdown, so preserve formatting
    // Add newsletter-style formatting
    if (adaptedContent.content) {
      // Add greeting if it's a newsletter-style post
      if (!adaptedContent.content.startsWith('Hello') && !adaptedContent.content.startsWith('Hi')) {
        adaptedContent.content = `Hello readers,\n\n${adaptedContent.content}`
      }

      // Add call-to-action at the end
      if (!adaptedContent.content.includes('subscribe') && !adaptedContent.content.includes('share')) {
        adaptedContent.content += '\n\n---\n\nIf you enjoyed this post, please consider sharing it with others who might find it interesting!'
      }
    }

    return adaptedContent
  }
}
