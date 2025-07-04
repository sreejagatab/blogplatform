import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { rssFeedProcessor } from '@/lib/inbound/rss-feed-processor'
import { z } from 'zod'

// Validation schema
const discoverFeedsSchema = z.object({
  websiteUrl: z.string().url('Invalid website URL')
})

// POST /api/feeds/discover - Discover RSS/Atom feeds from a website
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = discoverFeedsSchema.parse(body)

    console.log(`Discovering feeds for: ${validatedData.websiteUrl}`)

    // Discover feeds from the website
    const discoveredFeeds = await rssFeedProcessor.discoverFeeds(validatedData.websiteUrl)

    if (discoveredFeeds.length === 0) {
      return NextResponse.json({
        success: true,
        feeds: [],
        message: 'No RSS/Atom feeds found on this website'
      })
    }

    // Validate and enrich discovered feeds
    const enrichedFeeds = await Promise.all(
      discoveredFeeds.map(async (feed) => {
        try {
          // Try to parse the feed to get more information
          const parsedFeed = await rssFeedProcessor.parseFeed(feed.url)
          
          return {
            url: feed.url,
            title: parsedFeed.title || feed.title,
            description: parsedFeed.description,
            type: feed.type,
            confidence: feed.confidence,
            language: parsedFeed.language,
            itemCount: parsedFeed.items.length,
            lastBuildDate: parsedFeed.lastBuildDate,
            isValid: true
          }
        } catch (error) {
          console.warn(`Failed to parse discovered feed ${feed.url}:`, error)
          return {
            url: feed.url,
            title: feed.title,
            type: feed.type,
            confidence: Math.max(0, feed.confidence - 0.3), // Reduce confidence for unparseable feeds
            isValid: false,
            error: 'Failed to parse feed'
          }
        }
      })
    )

    // Filter out invalid feeds and sort by confidence
    const validFeeds = enrichedFeeds
      .filter(feed => feed.isValid)
      .sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      success: true,
      feeds: validFeeds,
      totalFound: discoveredFeeds.length,
      validFeeds: validFeeds.length,
      message: `Found ${validFeeds.length} valid RSS/Atom feeds`
    })
  } catch (error) {
    console.error('Feed discovery failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Feed discovery failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/feeds/discover - Get popular feed sources for quick subscription
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Popular RSS feeds across different categories
    const popularFeeds = [
      // Technology
      {
        category: 'Technology',
        feeds: [
          { url: 'https://techcrunch.com/feed/', title: 'TechCrunch', description: 'Latest technology news' },
          { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', description: 'Technology, science, art, and culture' },
          { url: 'https://feeds.arstechnica.com/arstechnica/index', title: 'Ars Technica', description: 'Technology news and analysis' },
          { url: 'https://www.wired.com/feed/rss', title: 'WIRED', description: 'Technology, business, culture, and science' },
          { url: 'https://hacker-news.firebaseio.com/v0/topstories.json', title: 'Hacker News', description: 'Social news for hackers and entrepreneurs' }
        ]
      },
      // Development
      {
        category: 'Development',
        feeds: [
          { url: 'https://dev.to/feed', title: 'DEV Community', description: 'Programming articles and tutorials' },
          { url: 'https://stackoverflow.blog/feed/', title: 'Stack Overflow Blog', description: 'Programming insights and news' },
          { url: 'https://github.blog/feed/', title: 'GitHub Blog', description: 'Updates from GitHub' },
          { url: 'https://css-tricks.com/feed/', title: 'CSS-Tricks', description: 'Web development tips and tricks' },
          { url: 'https://www.smashingmagazine.com/feed/', title: 'Smashing Magazine', description: 'Web design and development' }
        ]
      },
      // Business
      {
        category: 'Business',
        feeds: [
          { url: 'https://feeds.feedburner.com/entrepreneur/latest', title: 'Entrepreneur', description: 'Business and entrepreneurship' },
          { url: 'https://hbr.org/feed', title: 'Harvard Business Review', description: 'Business strategy and management' },
          { url: 'https://www.inc.com/rss.xml', title: 'Inc.com', description: 'Small business advice and news' },
          { url: 'https://www.fastcompany.com/rss.xml', title: 'Fast Company', description: 'Innovation and business' }
        ]
      },
      // Design
      {
        category: 'Design',
        feeds: [
          { url: 'https://www.designboom.com/feed/', title: 'Designboom', description: 'Architecture and design' },
          { url: 'https://www.creativebloq.com/feed', title: 'Creative Bloq', description: 'Art and design inspiration' },
          { url: 'https://www.behance.net/feeds/projects', title: 'Behance', description: 'Creative portfolios' },
          { url: 'https://dribbble.com/shots/popular.rss', title: 'Dribbble', description: 'Design inspiration' }
        ]
      },
      // News
      {
        category: 'News',
        feeds: [
          { url: 'https://rss.cnn.com/rss/edition.rss', title: 'CNN', description: 'Breaking news and analysis' },
          { url: 'https://feeds.bbci.co.uk/news/rss.xml', title: 'BBC News', description: 'World news' },
          { url: 'https://www.reuters.com/rssFeed/topNews', title: 'Reuters', description: 'International news' },
          { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', title: 'New York Times', description: 'News and analysis' }
        ]
      }
    ]

    return NextResponse.json({
      success: true,
      categories: popularFeeds,
      message: 'Popular RSS feeds by category'
    })
  } catch (error) {
    console.error('Failed to get popular feeds:', error)
    return NextResponse.json(
      { error: 'Failed to get popular feeds' },
      { status: 500 }
    )
  }
}
