'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  analyticsService, 
  AnalyticsMetrics, 
  AnalyticsEvent, 
  AnalyticsFilter 
} from '@/lib/analytics-service'

export interface UseAnalyticsOptions {
  filter?: AnalyticsFilter
  realTime?: boolean
  refreshInterval?: number
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { filter, realTime = true, refreshInterval = 30000 } = options

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getMetrics(filter)
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchMetrics()

    if (realTime) {
      // Subscribe to real-time updates
      const unsubscribe = analyticsService.subscribe((newMetrics) => {
        setMetrics(newMetrics)
      })

      return unsubscribe
    } else if (refreshInterval > 0) {
      // Set up periodic refresh
      const interval = setInterval(fetchMetrics, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchMetrics, realTime, refreshInterval])

  const refresh = useCallback(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    loading,
    error,
    refresh
  }
}

export function useRealTimeEvents(limit: number = 10) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    analyticsService.getRealTimeActivity(limit).then(initialEvents => {
      setEvents(initialEvents)
      setLoading(false)
    })

    // Subscribe to new events
    const unsubscribe = analyticsService.subscribeToEvents((newEvent) => {
      setEvents(prevEvents => [newEvent, ...prevEvents.slice(0, limit - 1)])
    })

    return unsubscribe
  }, [limit])

  return { events, loading }
}

export function usePlatformComparison() {
  const [comparison, setComparison] = useState<Array<{
    platform: string
    metrics: {
      views: number
      engagement: number
      conversionRate: number
    }
  }> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getPlatformComparison().then(data => {
      setComparison(data)
      setLoading(false)
    })

    // Refresh every 5 minutes
    const interval = setInterval(async () => {
      const data = await analyticsService.getPlatformComparison()
      setComparison(data)
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { comparison, loading }
}

export function useTrendingContent(timeframe: 'hour' | 'day' | 'week' = 'day') {
  const [trending, setTrending] = useState<Array<{
    postId: string
    title: string
    score: number
    growth: number
  }> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getTrendingContent(timeframe).then(data => {
      setTrending(data)
      setLoading(false)
    })

    // Refresh every 10 minutes
    const interval = setInterval(async () => {
      const data = await analyticsService.getTrendingContent(timeframe)
      setTrending(data)
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [timeframe])

  return { trending, loading }
}

// Hook for tracking events from components
export function useAnalyticsTracking() {
  const trackPageView = useCallback((postId?: string, platform?: string) => {
    analyticsService.trackEvent({
      type: 'view',
      postId,
      platform,
      sessionId: getSessionId()
    })
  }, [])

  const trackEngagement = useCallback((
    type: 'like' | 'comment' | 'share' | 'click', 
    postId?: string, 
    platform?: string
  ) => {
    analyticsService.trackEvent({
      type,
      postId,
      platform,
      sessionId: getSessionId()
    })
  }, [])

  const trackCustomEvent = useCallback((event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    analyticsService.trackEvent(event)
  }, [])

  return {
    trackPageView,
    trackEngagement,
    trackCustomEvent
  }
}

// Utility function to get session ID
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

// Hook for analytics dashboard with advanced features
export function useAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date()
  })
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments' | 'shares'>('views')

  const filter: AnalyticsFilter = {
    dateRange,
    platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined
  }

  const { metrics, loading, error, refresh } = useAnalytics({ filter, realTime: true })
  const { events: realTimeEvents } = useRealTimeEvents(20)
  const { comparison: platformComparison } = usePlatformComparison()
  const { trending: trendingContent } = useTrendingContent('day')

  const updateDateRange = useCallback((start: Date, end: Date) => {
    setDateRange({ start, end })
  }, [])

  const togglePlatform = useCallback((platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedPlatforms([])
    setDateRange({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    })
  }, [])

  return {
    // Data
    metrics,
    realTimeEvents,
    platformComparison,
    trendingContent,
    
    // State
    loading,
    error,
    dateRange,
    selectedPlatforms,
    selectedMetric,
    
    // Actions
    refresh,
    updateDateRange,
    togglePlatform,
    clearFilters,
    setSelectedMetric
  }
}

// Hook for real-time notifications
export function useAnalyticsNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'milestone' | 'spike' | 'alert'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>>([])

  useEffect(() => {
    // Subscribe to analytics events and generate notifications
    const unsubscribe = analyticsService.subscribeToEvents((event) => {
      // Example: Generate milestone notifications
      if (event.type === 'view' && Math.random() < 0.01) { // 1% chance
        const notification = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'milestone' as const,
          title: 'Milestone Reached!',
          message: `Your content just reached ${Math.floor(Math.random() * 1000 + 1000)} views!`,
          timestamp: new Date(),
          read: false
        }
        
        setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10
      }
    })

    return unsubscribe
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }
}
