/**
 * Real-time Analytics Service
 * Handles analytics data collection, processing, and real-time updates
 */

export interface AnalyticsEvent {
  id: string
  type: 'view' | 'like' | 'comment' | 'share' | 'click' | 'engagement'
  postId?: string
  platform?: string
  userId?: string
  sessionId: string
  timestamp: Date
  metadata?: Record<string, any>
  location?: {
    country: string
    city: string
    region: string
  }
  device?: {
    type: 'desktop' | 'mobile' | 'tablet'
    os: string
    browser: string
  }
}

export interface AnalyticsMetrics {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPosts: Array<{
    id: string
    title: string
    views: number
    engagement: number
  }>
  platformBreakdown: Array<{
    platform: string
    views: number
    percentage: number
  }>
  timeSeriesData: Array<{
    timestamp: Date
    views: number
    likes: number
    comments: number
    shares: number
  }>
  realTimeActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
    platform?: string
  }>
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date
    end: Date
  }
  platforms?: string[]
  postIds?: string[]
  eventTypes?: string[]
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private subscribers: Array<(metrics: AnalyticsMetrics) => void> = []
  private realTimeSubscribers: Array<(event: AnalyticsEvent) => void> = []

  constructor() {
    // Initialize with mock data
    this.initializeMockData()
    
    // Start real-time simulation
    this.startRealTimeSimulation()
  }

  /**
   * Track an analytics event
   */
  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    }

    this.events.push(fullEvent)
    
    // Notify real-time subscribers
    this.realTimeSubscribers.forEach(callback => callback(fullEvent))
    
    // Update metrics and notify subscribers
    const metrics = await this.getMetrics()
    this.subscribers.forEach(callback => callback(metrics))

    // In a real app, this would send to your analytics backend
    console.log('Analytics event tracked:', fullEvent)
  }

  /**
   * Get analytics metrics with optional filtering
   */
  async getMetrics(filter?: AnalyticsFilter): Promise<AnalyticsMetrics> {
    let filteredEvents = this.events

    if (filter) {
      filteredEvents = this.events.filter(event => {
        const inDateRange = event.timestamp >= filter.dateRange.start && 
                           event.timestamp <= filter.dateRange.end
        const matchesPlatform = !filter.platforms || 
                               filter.platforms.includes(event.platform || '')
        const matchesPost = !filter.postIds || 
                           filter.postIds.includes(event.postId || '')
        const matchesType = !filter.eventTypes || 
                           filter.eventTypes.includes(event.type)

        return inDateRange && matchesPlatform && matchesPost && matchesType
      })
    }

    return this.calculateMetrics(filteredEvents)
  }

  /**
   * Subscribe to real-time metrics updates
   */
  subscribe(callback: (metrics: AnalyticsMetrics) => void): () => void {
    this.subscribers.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  /**
   * Subscribe to real-time events
   */
  subscribeToEvents(callback: (event: AnalyticsEvent) => void): () => void {
    this.realTimeSubscribers.push(callback)
    
    return () => {
      const index = this.realTimeSubscribers.indexOf(callback)
      if (index > -1) {
        this.realTimeSubscribers.splice(index, 1)
      }
    }
  }

  /**
   * Get real-time activity feed
   */
  async getRealTimeActivity(limit: number = 10): Promise<AnalyticsEvent[]> {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get platform performance comparison
   */
  async getPlatformComparison(): Promise<Array<{
    platform: string
    metrics: {
      views: number
      engagement: number
      conversionRate: number
    }
  }>> {
    const platforms = ['LinkedIn', 'Twitter', 'Medium', 'Dev.to', 'Facebook']
    
    return platforms.map(platform => {
      const platformEvents = this.events.filter(e => e.platform === platform)
      const views = platformEvents.filter(e => e.type === 'view').length
      const engagements = platformEvents.filter(e => 
        ['like', 'comment', 'share'].includes(e.type)
      ).length
      
      return {
        platform,
        metrics: {
          views,
          engagement: engagements,
          conversionRate: views > 0 ? (engagements / views) * 100 : 0
        }
      }
    })
  }

  /**
   * Get trending content
   */
  async getTrendingContent(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<Array<{
    postId: string
    title: string
    score: number
    growth: number
  }>> {
    const now = new Date()
    const timeframeMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[timeframe]

    const cutoff = new Date(now.getTime() - timeframeMs)
    const recentEvents = this.events.filter(e => e.timestamp >= cutoff)

    // Group by post and calculate trending score
    const postScores = new Map<string, { score: number; title: string }>()
    
    recentEvents.forEach(event => {
      if (!event.postId) return
      
      const current = postScores.get(event.postId) || { score: 0, title: `Post ${event.postId}` }
      const weight = {
        view: 1,
        like: 3,
        comment: 5,
        share: 7,
        click: 2,
        engagement: 4
      }[event.type] || 1

      current.score += weight
      postScores.set(event.postId, current)
    })

    return Array.from(postScores.entries())
      .map(([postId, data]) => ({
        postId,
        title: data.title,
        score: data.score,
        growth: Math.random() * 100 // Mock growth percentage
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  private calculateMetrics(events: AnalyticsEvent[]): AnalyticsMetrics {
    const totalViews = events.filter(e => e.type === 'view').length
    const totalLikes = events.filter(e => e.type === 'like').length
    const totalComments = events.filter(e => e.type === 'comment').length
    const totalShares = events.filter(e => e.type === 'share').length
    
    const uniqueVisitors = new Set(events.map(e => e.sessionId)).size
    const bounceRate = Math.random() * 40 + 20 // Mock bounce rate
    const avgSessionDuration = Math.random() * 300 + 120 // Mock session duration

    // Calculate top posts
    const postViews = new Map<string, number>()
    const postEngagements = new Map<string, number>()
    
    events.forEach(event => {
      if (!event.postId) return
      
      if (event.type === 'view') {
        postViews.set(event.postId, (postViews.get(event.postId) || 0) + 1)
      } else if (['like', 'comment', 'share'].includes(event.type)) {
        postEngagements.set(event.postId, (postEngagements.get(event.postId) || 0) + 1)
      }
    })

    const topPosts = Array.from(postViews.entries())
      .map(([id, views]) => ({
        id,
        title: `Post ${id}`,
        views,
        engagement: postEngagements.get(id) || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Calculate platform breakdown
    const platformViews = new Map<string, number>()
    events.filter(e => e.type === 'view' && e.platform).forEach(event => {
      platformViews.set(event.platform!, (platformViews.get(event.platform!) || 0) + 1)
    })

    const platformBreakdown = Array.from(platformViews.entries())
      .map(([platform, views]) => ({
        platform,
        views,
        percentage: totalViews > 0 ? (views / totalViews) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)

    // Generate time series data (last 7 days)
    const timeSeriesData = this.generateTimeSeriesData(events)

    // Get recent activity
    const realTimeActivity = events
      .slice(-10)
      .map(event => ({
        id: event.id,
        type: event.type,
        description: this.getEventDescription(event),
        timestamp: event.timestamp,
        platform: event.platform
      }))
      .reverse()

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      uniqueVisitors,
      bounceRate,
      avgSessionDuration,
      topPosts,
      platformBreakdown,
      timeSeriesData,
      realTimeActivity
    }
  }

  private generateTimeSeriesData(events: AnalyticsEvent[]) {
    const days = 7
    const data = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd)

      data.push({
        timestamp: dayStart,
        views: dayEvents.filter(e => e.type === 'view').length,
        likes: dayEvents.filter(e => e.type === 'like').length,
        comments: dayEvents.filter(e => e.type === 'comment').length,
        shares: dayEvents.filter(e => e.type === 'share').length
      })
    }

    return data
  }

  private getEventDescription(event: AnalyticsEvent): string {
    const descriptions = {
      view: `New view on ${event.platform || 'platform'}`,
      like: `Post liked on ${event.platform || 'platform'}`,
      comment: `New comment on ${event.platform || 'platform'}`,
      share: `Post shared on ${event.platform || 'platform'}`,
      click: `Link clicked on ${event.platform || 'platform'}`,
      engagement: `User engaged on ${event.platform || 'platform'}`
    }

    return descriptions[event.type] || 'Unknown activity'
  }

  private initializeMockData() {
    const platforms = ['LinkedIn', 'Twitter', 'Medium', 'Dev.to', 'Facebook']
    const eventTypes: AnalyticsEvent['type'][] = ['view', 'like', 'comment', 'share', 'click']
    const postIds = ['1', '2', '3', '4', '5']

    // Generate historical data for the last 30 days
    for (let i = 0; i < 1000; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      this.events.push({
        id: this.generateId(),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        postId: postIds[Math.floor(Math.random() * postIds.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        sessionId: `session_${Math.floor(Math.random() * 100)}`,
        timestamp,
        metadata: {},
        location: {
          country: 'US',
          city: 'New York',
          region: 'NY'
        },
        device: {
          type: Math.random() > 0.5 ? 'desktop' : 'mobile',
          os: Math.random() > 0.5 ? 'Windows' : 'macOS',
          browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox'
        }
      })
    }
  }

  private startRealTimeSimulation() {
    // Simulate real-time events every 5-15 seconds
    setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of generating an event
        const platforms = ['LinkedIn', 'Twitter', 'Medium', 'Dev.to', 'Facebook']
        const eventTypes: AnalyticsEvent['type'][] = ['view', 'like', 'comment', 'share']
        const postIds = ['1', '2', '3', '4', '5']

        this.trackEvent({
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          postId: postIds[Math.floor(Math.random() * postIds.length)],
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          sessionId: `session_${Math.floor(Math.random() * 1000)}`,
          metadata: {},
          location: {
            country: 'US',
            city: 'New York',
            region: 'NY'
          },
          device: {
            type: Math.random() > 0.5 ? 'desktop' : 'mobile',
            os: Math.random() > 0.5 ? 'Windows' : 'macOS',
            browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox'
          }
        })
      }
    }, Math.random() * 10000 + 5000) // 5-15 seconds
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()

// Export utility functions
export const trackPageView = (postId?: string, platform?: string) => {
  analyticsService.trackEvent({
    type: 'view',
    postId,
    platform,
    sessionId: getSessionId()
  })
}

export const trackEngagement = (type: 'like' | 'comment' | 'share', postId?: string, platform?: string) => {
  analyticsService.trackEvent({
    type,
    postId,
    platform,
    sessionId: getSessionId()
  })
}

function getSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }
  return 'server_session'
}
