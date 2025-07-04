import { marked } from 'marked'
import { JSDOM } from 'jsdom'

export interface PlatformContent {
  platform: string
  content: string
  title?: string
  metadata: Record<string, any>
  originalData: any
}

export interface NormalizedContent {
  title: string
  content: string
  excerpt: string
  htmlContent: string
  plainTextContent: string
  wordCount: number
  readingTime: number
  language: string
  tags: string[]
  topics: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  media: MediaItem[]
  links: LinkItem[]
  mentions: MentionItem[]
  hashtags: string[]
  publishedAt?: Date
  author?: AuthorInfo
  engagement?: EngagementMetrics
}

export interface MediaItem {
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  duration?: number
  size?: number
}

export interface LinkItem {
  url: string
  title?: string
  description?: string
  domain: string
  isInternal: boolean
}

export interface MentionItem {
  username: string
  displayName?: string
  platform: string
  url?: string
}

export interface AuthorInfo {
  name: string
  username?: string
  avatar?: string
  bio?: string
  url?: string
}

export interface EngagementMetrics {
  likes?: number
  shares?: number
  comments?: number
  views?: number
  reactions?: Record<string, number>
}

export class ContentNormalizer {
  async normalizeContent(platformContent: PlatformContent): Promise<NormalizedContent> {
    const { platform, content, title, metadata, originalData } = platformContent

    // Extract basic content information
    const normalizedTitle = this.extractTitle(title, content, platform)
    const cleanContent = this.cleanContent(content, platform)
    const htmlContent = await this.convertToHtml(cleanContent, platform)
    const plainTextContent = this.extractPlainText(htmlContent)
    
    // Calculate content metrics
    const wordCount = this.calculateWordCount(plainTextContent)
    const readingTime = this.calculateReadingTime(wordCount)
    const excerpt = this.generateExcerpt(plainTextContent)
    
    // Extract content elements
    const media = this.extractMedia(originalData, platform)
    const links = this.extractLinks(content, htmlContent)
    const mentions = this.extractMentions(content, platform)
    const hashtags = this.extractHashtags(content, platform)
    const tags = this.generateTags(content, hashtags, platform)
    const topics = this.extractTopics(content, platform)
    
    // Extract metadata
    const language = this.detectLanguage(plainTextContent)
    const publishedAt = this.extractPublishedDate(metadata, originalData)
    const author = this.extractAuthor(originalData, platform)
    const engagement = this.extractEngagement(originalData, platform)

    return {
      title: normalizedTitle,
      content: cleanContent,
      excerpt,
      htmlContent,
      plainTextContent,
      wordCount,
      readingTime,
      language,
      tags,
      topics,
      media,
      links,
      mentions,
      hashtags,
      publishedAt,
      author,
      engagement,
    }
  }

  private extractTitle(title: string | undefined, content: string, platform: string): string {
    if (title && title.trim()) {
      return title.trim()
    }

    // Extract title from content based on platform
    switch (platform) {
      case 'twitter':
        // For tweets, use first line or truncated content as title
        const firstLine = content.split('\n')[0]
        return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine
      
      case 'linkedin':
        // For LinkedIn, look for bold text or first sentence
        const boldMatch = content.match(/\*\*(.*?)\*\*/)
        if (boldMatch) return boldMatch[1]
        
        const firstSentence = content.split('.')[0]
        return firstSentence.length > 60 ? firstSentence.substring(0, 57) + '...' : firstSentence
      
      case 'medium':
      case 'devto':
      case 'hashnode':
        // For blog platforms, extract H1 or first paragraph
        const h1Match = content.match(/^#\s+(.+)$/m)
        if (h1Match) return h1Match[1]
        
        const firstParagraph = content.split('\n\n')[0]
        return firstParagraph.length > 80 ? firstParagraph.substring(0, 77) + '...' : firstParagraph
      
      default:
        // Generic title extraction
        const truncated = content.substring(0, 60).trim()
        return truncated.length < content.length ? truncated + '...' : truncated
    }
  }

  private cleanContent(content: string, platform: string): string {
    let cleaned = content

    // Platform-specific cleaning
    switch (platform) {
      case 'twitter':
        // Remove Twitter-specific elements
        cleaned = cleaned.replace(/RT @\w+:/g, '') // Remove retweet prefix
        cleaned = cleaned.replace(/https:\/\/t\.co\/\w+/g, '') // Remove t.co links
        break
      
      case 'linkedin':
        // Clean LinkedIn formatting
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        break
      
      case 'medium':
        // Clean Medium-specific elements
        cleaned = cleaned.replace(/^\*\*\*$/gm, '') // Remove dividers
        break
    }

    // General cleaning
    cleaned = cleaned.trim()
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
    cleaned = cleaned.replace(/\s{2,}/g, ' ') // Normalize multiple spaces

    return cleaned
  }

  private async convertToHtml(content: string, platform: string): Promise<string> {
    // Convert platform-specific formatting to HTML
    switch (platform) {
      case 'medium':
      case 'devto':
      case 'hashnode':
        // These platforms often use Markdown
        return marked(content)
      
      case 'twitter':
      case 'linkedin':
        // Convert plain text with basic formatting
        let html = content
        html = html.replace(/\n/g, '<br>')
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
        return html
      
      default:
        // Basic HTML conversion
        return content.replace(/\n/g, '<br>')
    }
  }

  private extractPlainText(htmlContent: string): string {
    const dom = new JSDOM(htmlContent)
    return dom.window.document.body.textContent || ''
  }

  private calculateWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  private calculateReadingTime(wordCount: number): number {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200)
  }

  private generateExcerpt(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text
    
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  private extractMedia(originalData: any, platform: string): MediaItem[] {
    const media: MediaItem[] = []

    switch (platform) {
      case 'twitter':
        if (originalData.entities?.media) {
          originalData.entities.media.forEach((item: any) => {
            media.push({
              type: item.type === 'photo' ? 'image' : 'video',
              url: item.media_url_https || item.media_url,
              alt: item.alt_text,
              width: item.sizes?.large?.w,
              height: item.sizes?.large?.h,
            })
          })
        }
        break
      
      case 'linkedin':
        if (originalData.content?.media) {
          originalData.content.media.forEach((item: any) => {
            media.push({
              type: item.type,
              url: item.url,
              caption: item.title,
            })
          })
        }
        break
      
      case 'medium':
        // Extract images from content
        const imgRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g
        let match
        while ((match = imgRegex.exec(originalData.content || '')) !== null) {
          media.push({
            type: 'image',
            url: match[1],
            alt: match[2],
          })
        }
        break
    }

    return media
  }

  private extractLinks(content: string, htmlContent: string): LinkItem[] {
    const links: LinkItem[] = []
    const urlRegex = /(https?:\/\/[^\s]+)/g
    let match

    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[1]
      const domain = new URL(url).hostname
      
      links.push({
        url,
        domain,
        isInternal: domain.includes('universalblogplatform.com'), // Adjust for your domain
      })
    }

    return links
  }

  private extractMentions(content: string, platform: string): MentionItem[] {
    const mentions: MentionItem[] = []
    
    // Platform-specific mention patterns
    const patterns = {
      twitter: /@(\w+)/g,
      linkedin: /@(\w+)/g,
      github: /@(\w+)/g,
      medium: /@(\w+)/g,
    }

    const pattern = patterns[platform as keyof typeof patterns]
    if (!pattern) return mentions

    let match
    while ((match = pattern.exec(content)) !== null) {
      mentions.push({
        username: match[1],
        platform,
        url: this.buildMentionUrl(match[1], platform),
      })
    }

    return mentions
  }

  private extractHashtags(content: string, platform: string): string[] {
    const hashtags: string[] = []
    const hashtagRegex = /#(\w+)/g
    let match

    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1].toLowerCase())
    }

    return [...new Set(hashtags)] // Remove duplicates
  }

  private generateTags(content: string, hashtags: string[], platform: string): string[] {
    const tags = [...hashtags]
    
    // Add platform as a tag
    tags.push(platform)
    
    // Add content-based tags (this could be enhanced with AI)
    if (content.toLowerCase().includes('ai') || content.toLowerCase().includes('artificial intelligence')) {
      tags.push('ai')
    }
    if (content.toLowerCase().includes('tech') || content.toLowerCase().includes('technology')) {
      tags.push('technology')
    }
    
    return [...new Set(tags)]
  }

  private extractTopics(content: string, platform: string): string[] {
    // Basic topic extraction (could be enhanced with AI/NLP)
    const topics: string[] = []
    const lowercaseContent = content.toLowerCase()
    
    const topicKeywords = {
      'technology': ['tech', 'software', 'programming', 'code', 'development'],
      'business': ['business', 'startup', 'entrepreneur', 'marketing', 'sales'],
      'design': ['design', 'ui', 'ux', 'creative', 'visual'],
      'productivity': ['productivity', 'workflow', 'efficiency', 'tips'],
      'career': ['career', 'job', 'work', 'professional', 'skills'],
    }

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowercaseContent.includes(keyword))) {
        topics.push(topic)
      }
    }

    return topics
  }

  private detectLanguage(text: string): string {
    // Basic language detection (could be enhanced with a proper library)
    // For now, default to English
    return 'en'
  }

  private extractPublishedDate(metadata: any, originalData: any): Date | undefined {
    const dateFields = [
      metadata.createdAt,
      metadata.publishedAt,
      metadata.created_at,
      metadata.published_at,
      originalData.created_at,
      originalData.published_at,
      originalData.createdAt,
      originalData.publishedAt,
    ]

    for (const dateField of dateFields) {
      if (dateField) {
        const date = new Date(dateField)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }

    return undefined
  }

  private extractAuthor(originalData: any, platform: string): AuthorInfo | undefined {
    switch (platform) {
      case 'twitter':
        if (originalData.user) {
          return {
            name: originalData.user.name,
            username: originalData.user.screen_name,
            avatar: originalData.user.profile_image_url_https,
            bio: originalData.user.description,
            url: `https://twitter.com/${originalData.user.screen_name}`,
          }
        }
        break
      
      case 'medium':
        if (originalData.author) {
          return {
            name: originalData.author.name,
            username: originalData.author.username,
            avatar: originalData.author.imageUrl,
            bio: originalData.author.bio,
            url: `https://medium.com/@${originalData.author.username}`,
          }
        }
        break
    }

    return undefined
  }

  private extractEngagement(originalData: any, platform: string): EngagementMetrics | undefined {
    switch (platform) {
      case 'twitter':
        return {
          likes: originalData.favorite_count,
          shares: originalData.retweet_count,
          comments: originalData.reply_count,
        }
      
      case 'linkedin':
        return {
          likes: originalData.numLikes,
          shares: originalData.numShares,
          comments: originalData.numComments,
        }
      
      case 'medium':
        return {
          likes: originalData.virtuals?.totalClapCount,
          views: originalData.virtuals?.readingTime,
        }
    }

    return undefined
  }

  private buildMentionUrl(username: string, platform: string): string {
    const urlMap = {
      twitter: `https://twitter.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      medium: `https://medium.com/@${username}`,
    }

    return urlMap[platform as keyof typeof urlMap] || ''
  }
}

// Export singleton instance
export const contentNormalizer = new ContentNormalizer()
