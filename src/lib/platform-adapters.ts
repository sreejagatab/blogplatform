// Base Platform Adapter Interface
export interface PlatformAdapter {
  name: string
  authenticate(credentials: any): Promise<boolean>
  publishPost(post: PostData): Promise<PublishResult>
  getAnalytics(postId: string): Promise<AnalyticsData>
  validatePost(post: PostData): ValidationResult
  formatPost(post: PostData): any
}

export interface PostData {
  title: string
  content: string
  excerpt?: string
  tags?: string[]
  images?: string[]
  publishAt?: Date
  customFields?: Record<string, any>
}

export interface PublishResult {
  success: boolean
  platformPostId?: string
  url?: string
  error?: string
  warnings?: string[]
}

export interface AnalyticsData {
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  clickThroughRate?: number
  impressions?: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// LinkedIn Platform Adapter
class LinkedInAdapter implements PlatformAdapter {
  name = 'LinkedIn'
  private accessToken?: string

  async authenticate(credentials: { accessToken: string }): Promise<boolean> {
    this.accessToken = credentials.accessToken
    
    try {
      // Verify token with LinkedIn API
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })
      return response.ok
    } catch (error) {
      console.error('LinkedIn authentication error:', error)
      return false
    }
  }

  validatePost(post: PostData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!post.title && !post.content) {
      errors.push('Post must have either title or content')
    }

    if (post.content && post.content.length > 3000) {
      warnings.push('LinkedIn posts over 3000 characters may be truncated')
    }

    if (post.tags && post.tags.length > 3) {
      warnings.push('LinkedIn works best with 1-3 hashtags')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  formatPost(post: PostData): any {
    let text = ''
    
    if (post.title) {
      text += `${post.title}\n\n`
    }
    
    text += post.content

    if (post.tags && post.tags.length > 0) {
      text += '\n\n' + post.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')
    }

    return {
      author: 'urn:li:person:YOUR_PERSON_ID', // Would be dynamic
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }
  }

  async publishPost(post: PostData): Promise<PublishResult> {
    if (!this.accessToken) {
      return { success: false, error: 'Not authenticated' }
    }

    const validation = this.validatePost(post)
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') }
    }

    try {
      const formattedPost = this.formatPost(post)
      
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(formattedPost)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platformPostId: result.id,
          warnings: validation.warnings
        }
      } else {
        const error = await response.text()
        return { success: false, error: `LinkedIn API error: ${error}` }
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error}` }
    }
  }

  async getAnalytics(postId: string): Promise<AnalyticsData> {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    try {
      // LinkedIn analytics API call would go here
      // This is a mock implementation
      return {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        engagement: Math.random() * 10,
        impressions: Math.floor(Math.random() * 20000),
        clickThroughRate: Math.random() * 5
      }
    } catch (error) {
      console.error('LinkedIn analytics error:', error)
      throw error
    }
  }
}

// Medium Platform Adapter
class MediumAdapter implements PlatformAdapter {
  name = 'Medium'
  private accessToken?: string

  async authenticate(credentials: { accessToken: string }): Promise<boolean> {
    this.accessToken = credentials.accessToken
    
    try {
      const response = await fetch('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })
      return response.ok
    } catch (error) {
      console.error('Medium authentication error:', error)
      return false
    }
  }

  validatePost(post: PostData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!post.title) {
      errors.push('Medium posts require a title')
    }

    if (!post.content) {
      errors.push('Medium posts require content')
    }

    if (post.title && post.title.length > 100) {
      warnings.push('Medium titles over 100 characters may be truncated in feeds')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  formatPost(post: PostData): any {
    return {
      title: post.title,
      contentFormat: 'html',
      content: post.content,
      tags: post.tags || [],
      publishStatus: 'public',
      license: 'all-rights-reserved',
      notifyFollowers: true
    }
  }

  async publishPost(post: PostData): Promise<PublishResult> {
    if (!this.accessToken) {
      return { success: false, error: 'Not authenticated' }
    }

    const validation = this.validatePost(post)
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') }
    }

    try {
      // First get user ID
      const userResponse = await fetch('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      })

      if (!userResponse.ok) {
        return { success: false, error: 'Failed to get user information' }
      }

      const userData = await userResponse.json()
      const userId = userData.data.id

      // Publish post
      const formattedPost = this.formatPost(post)
      
      const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedPost)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platformPostId: result.data.id,
          url: result.data.url,
          warnings: validation.warnings
        }
      } else {
        const error = await response.text()
        return { success: false, error: `Medium API error: ${error}` }
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error}` }
    }
  }

  async getAnalytics(postId: string): Promise<AnalyticsData> {
    // Medium doesn't provide detailed analytics via API for most users
    // This would typically require scraping or premium access
    return {
      views: Math.floor(Math.random() * 5000),
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 25),
      engagement: Math.random() * 8
    }
  }
}

// Twitter/X Platform Adapter
class TwitterAdapter implements PlatformAdapter {
  name = 'Twitter'
  private accessToken?: string
  private accessTokenSecret?: string

  async authenticate(credentials: { accessToken: string, accessTokenSecret: string }): Promise<boolean> {
    this.accessToken = credentials.accessToken
    this.accessTokenSecret = credentials.accessTokenSecret
    
    // Twitter authentication would be more complex with OAuth 1.0a or OAuth 2.0
    // This is a simplified version
    return true
  }

  validatePost(post: PostData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!post.content && !post.title) {
      errors.push('Tweet must have content')
    }

    const tweetText = post.title ? `${post.title}\n\n${post.content}` : post.content
    
    if (tweetText.length > 280) {
      errors.push('Tweet exceeds 280 character limit')
    }

    if (post.tags && post.tags.length > 2) {
      warnings.push('Twitter works best with 1-2 hashtags per tweet')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  formatPost(post: PostData): any {
    let text = post.title ? `${post.title}\n\n${post.content}` : post.content
    
    if (post.tags && post.tags.length > 0) {
      text += ' ' + post.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')
    }

    return {
      text: text.substring(0, 280) // Ensure we don't exceed limit
    }
  }

  async publishPost(post: PostData): Promise<PublishResult> {
    const validation = this.validatePost(post)
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') }
    }

    try {
      const formattedPost = this.formatPost(post)
      
      // Twitter API v2 post creation would go here
      // This is a mock implementation
      return {
        success: true,
        platformPostId: `tweet_${Date.now()}`,
        warnings: validation.warnings
      }
    } catch (error) {
      return { success: false, error: `Twitter API error: ${error}` }
    }
  }

  async getAnalytics(postId: string): Promise<AnalyticsData> {
    return {
      views: Math.floor(Math.random() * 15000),
      likes: Math.floor(Math.random() * 800),
      comments: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 150),
      engagement: Math.random() * 15,
      impressions: Math.floor(Math.random() * 25000)
    }
  }
}

// Platform Adapter Factory
class PlatformAdapterFactory {
  private static adapters = new Map<string, () => PlatformAdapter>()

  static {
    this.adapters.set('linkedin', () => new LinkedInAdapter())
    this.adapters.set('medium', () => new MediumAdapter())
    this.adapters.set('twitter', () => new TwitterAdapter())
  }

  static createAdapter(platformName: string): PlatformAdapter | null {
    const adapterFactory = this.adapters.get(platformName.toLowerCase())
    return adapterFactory ? adapterFactory() : null
  }

  static getSupportedPlatforms(): string[] {
    return Array.from(this.adapters.keys())
  }

  static registerAdapter(platformName: string, adapterFactory: () => PlatformAdapter): void {
    this.adapters.set(platformName.toLowerCase(), adapterFactory)
  }
}

// Export all adapters and factory
export { LinkedInAdapter, MediumAdapter, TwitterAdapter, PlatformAdapterFactory }
