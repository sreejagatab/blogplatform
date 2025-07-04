import Parser from 'rss-parser'
import { JSDOM } from 'jsdom'
import { prisma } from '@/lib/prisma'
import { getContentIngestionQueue } from './content-ingestion-queue'

export interface FeedItem {
  guid: string
  title: string
  link: string
  description?: string
  content?: string
  contentSnippet?: string
  pubDate?: string
  author?: string
  categories?: string[]
  enclosure?: {
    url: string
    type: string
    length?: string
  }
  itunes?: {
    image?: string
    duration?: string
    episode?: string
    season?: string
  }
}

export interface ParsedFeed {
  title: string
  description?: string
  link: string
  language?: string
  lastBuildDate?: string
  items: FeedItem[]
  feedUrl: string
  feedType: 'rss' | 'atom' | 'json'
}

export interface FeedDiscoveryResult {
  url: string
  title?: string
  type: 'rss' | 'atom' | 'json'
  confidence: number
}

export class RSSFeedProcessor {
  private parser: Parser
  private readonly maxItemsPerFeed = 50
  private readonly feedTimeout = 30000 // 30 seconds

  constructor() {
    this.parser = new Parser({
      timeout: this.feedTimeout,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Universal Blog Platform Feed Reader 1.0',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'
      },
      customFields: {
        feed: ['language', 'generator', 'webMaster'],
        item: [
          ['media:content', 'mediaContent'],
          ['media:thumbnail', 'mediaThumbnail'],
          ['content:encoded', 'contentEncoded'],
          ['dc:creator', 'creator'],
          ['dc:date', 'dcDate']
        ]
      }
    })
  }

  /**
   * Discover RSS/Atom feeds from a website URL
   */
  async discoverFeeds(websiteUrl: string): Promise<FeedDiscoveryResult[]> {
    const feeds: FeedDiscoveryResult[] = []

    try {
      // Normalize URL
      const url = new URL(websiteUrl)
      const baseUrl = `${url.protocol}//${url.host}`

      // Common feed URL patterns to check
      const commonPaths = [
        '/feed',
        '/rss',
        '/atom.xml',
        '/rss.xml',
        '/feed.xml',
        '/index.xml',
        '/feeds/all.atom.xml',
        '/blog/feed',
        '/blog/rss',
        '/news/feed',
        '/api/feed',
        '/.well-known/feed'
      ]

      // Check HTML page for feed links
      try {
        const response = await fetch(websiteUrl, {
          headers: { 'User-Agent': 'Universal Blog Platform Feed Discovery 1.0' },
          signal: AbortSignal.timeout(10000)
        })

        if (response.ok) {
          const html = await response.text()
          const discoveredFeeds = this.extractFeedLinksFromHTML(html, baseUrl)
          feeds.push(...discoveredFeeds)
        }
      } catch (error) {
        console.warn('Failed to fetch HTML for feed discovery:', error)
      }

      // Check common feed paths
      for (const path of commonPaths) {
        const feedUrl = baseUrl + path
        try {
          const isValid = await this.validateFeedUrl(feedUrl)
          if (isValid) {
            feeds.push({
              url: feedUrl,
              type: this.detectFeedType(feedUrl),
              confidence: 0.8
            })
          }
        } catch (error) {
          // Silently continue to next path
        }
      }

      // Remove duplicates and sort by confidence
      const uniqueFeeds = feeds.filter((feed, index, self) => 
        index === self.findIndex(f => f.url === feed.url)
      )

      return uniqueFeeds.sort((a, b) => b.confidence - a.confidence)
    } catch (error) {
      console.error('Feed discovery failed:', error)
      return []
    }
  }

  /**
   * Parse RSS/Atom feed from URL
   */
  async parseFeed(feedUrl: string): Promise<ParsedFeed> {
    try {
      const feed = await this.parser.parseURL(feedUrl)
      
      return {
        title: feed.title || 'Unknown Feed',
        description: feed.description,
        link: feed.link || feedUrl,
        language: feed.language,
        lastBuildDate: feed.lastBuildDate,
        feedUrl,
        feedType: this.detectFeedType(feedUrl),
        items: feed.items.slice(0, this.maxItemsPerFeed).map(item => ({
          guid: item.guid || item.link || `${feedUrl}-${Date.now()}`,
          title: item.title || 'Untitled',
          link: item.link || '',
          description: item.description || item.contentSnippet,
          content: (item as any).contentEncoded || item.content,
          contentSnippet: item.contentSnippet,
          pubDate: item.pubDate || item.isoDate,
          author: item.creator || (item as any).creator || item.author,
          categories: item.categories || [],
          enclosure: item.enclosure,
          itunes: item.itunes
        }))
      }
    } catch (error) {
      console.error(`Failed to parse feed ${feedUrl}:`, error)
      throw new Error(`Feed parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Process feed items and add to ingestion queue
   */
  async processFeedItems(
    parsedFeed: ParsedFeed, 
    userId: string, 
    lastProcessedDate?: Date
  ): Promise<{ processedCount: number; skippedCount: number }> {
    let processedCount = 0
    let skippedCount = 0

    for (const item of parsedFeed.items) {
      try {
        // Skip items older than last processed date
        if (lastProcessedDate && item.pubDate) {
          const itemDate = new Date(item.pubDate)
          if (itemDate <= lastProcessedDate) {
            skippedCount++
            continue
          }
        }

        // Check if item already exists
        const existingContent = await prisma.inboundContent.findFirst({
          where: {
            platformPostId: item.guid,
            platform: 'rss',
            userId
          }
        })

        if (existingContent) {
          skippedCount++
          continue
        }

        // Add to ingestion queue
        await getContentIngestionQueue().add('ingest-content', {
          platform: 'rss',
          platformPostId: item.guid,
          platformUserId: parsedFeed.feedUrl,
          content: this.extractContent(item),
          title: item.title,
          metadata: {
            feedTitle: parsedFeed.title,
            feedUrl: parsedFeed.feedUrl,
            publishedDate: item.pubDate,
            link: item.link,
            author: item.author,
            categories: item.categories,
            description: item.description,
            enclosure: item.enclosure,
            itunes: item.itunes
          },
          originalData: item,
          userId
        })

        processedCount++
      } catch (error) {
        console.error(`Failed to process feed item: ${item.title}`, error)
        skippedCount++
      }
    }

    return { processedCount, skippedCount }
  }

  /**
   * Subscribe user to RSS feed
   */
  async subscribeFeed(
    userId: string, 
    feedUrl: string, 
    customTitle?: string
  ): Promise<{ success: boolean; feedId?: string; error?: string }> {
    try {
      // Validate feed URL
      const isValid = await this.validateFeedUrl(feedUrl)
      if (!isValid) {
        return { success: false, error: 'Invalid or inaccessible feed URL' }
      }

      // Parse feed to get metadata
      const parsedFeed = await this.parseFeed(feedUrl)

      // Create or update feed subscription
      const subscription = await prisma.feedSubscription.upsert({
        where: {
          userId_feedUrl: {
            userId,
            feedUrl
          }
        },
        update: {
          feedTitle: customTitle || parsedFeed.title,
          feedDescription: parsedFeed.description,
          isActive: true,
          lastError: null,
          updatedAt: new Date()
        },
        create: {
          userId,
          feedUrl,
          feedTitle: customTitle || parsedFeed.title,
          feedDescription: parsedFeed.description,
          isActive: true
        }
      })

      // Process initial feed items
      await this.processFeedItems(parsedFeed, userId)

      return { success: true, feedId: subscription.id }
    } catch (error) {
      console.error('Feed subscription failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Process all active feed subscriptions
   */
  async processAllFeeds(): Promise<{ processedFeeds: number; totalItems: number }> {
    const activeSubscriptions = await prisma.feedSubscription.findMany({
      where: { isActive: true },
      include: { user: true }
    })

    let processedFeeds = 0
    let totalItems = 0

    for (const subscription of activeSubscriptions) {
      try {
        const parsedFeed = await this.parseFeed(subscription.feedUrl)
        const result = await this.processFeedItems(
          parsedFeed, 
          subscription.userId, 
          subscription.lastProcessedAt || undefined
        )

        totalItems += result.processedCount

        // Update last processed time
        await prisma.feedSubscription.update({
          where: { id: subscription.id },
          data: { 
            lastProcessedAt: new Date(),
            lastError: null
          }
        })

        processedFeeds++
      } catch (error) {
        console.error(`Failed to process feed ${subscription.feedUrl}:`, error)
        
        // Update error status
        await prisma.feedSubscription.update({
          where: { id: subscription.id },
          data: { 
            lastError: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      }
    }

    return { processedFeeds, totalItems }
  }

  private extractFeedLinksFromHTML(html: string, baseUrl: string): FeedDiscoveryResult[] {
    const feeds: FeedDiscoveryResult[] = []
    
    try {
      const dom = new JSDOM(html)
      const document = dom.window.document
      
      // Look for feed link elements
      const linkElements = document.querySelectorAll('link[rel="alternate"]')
      
      linkElements.forEach(link => {
        const type = link.getAttribute('type')
        const href = link.getAttribute('href')
        const title = link.getAttribute('title')
        
        if (href && (
          type?.includes('rss') || 
          type?.includes('atom') || 
          type?.includes('xml')
        )) {
          const feedUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString()
          
          feeds.push({
            url: feedUrl,
            title,
            type: type.includes('atom') ? 'atom' : 'rss',
            confidence: 0.9
          })
        }
      })
    } catch (error) {
      console.warn('Failed to parse HTML for feed links:', error)
    }
    
    return feeds
  }

  private async validateFeedUrl(feedUrl: string): Promise<boolean> {
    try {
      const response = await fetch(feedUrl, {
        method: 'HEAD',
        headers: { 'User-Agent': 'Universal Blog Platform Feed Validator 1.0' },
        signal: AbortSignal.timeout(5000)
      })
      
      return response.ok
    } catch (error) {
      return false
    }
  }

  private detectFeedType(feedUrl: string): 'rss' | 'atom' | 'json' {
    const url = feedUrl.toLowerCase()
    if (url.includes('atom')) return 'atom'
    if (url.includes('json')) return 'json'
    return 'rss'
  }

  private extractContent(item: FeedItem): string {
    // Prefer full content over description
    if (item.content) return item.content
    if (item.description) return item.description
    if (item.contentSnippet) return item.contentSnippet
    return item.title
  }
}

// Export singleton instance
export const rssFeedProcessor = new RSSFeedProcessor()
