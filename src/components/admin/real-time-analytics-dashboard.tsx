"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Zap,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react'

interface LiveAnalytics {
  postId: string
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  realtimeViews: number
  engagementRate: number
  platformBreakdown: Record<string, {
    views: number
    likes: number
    comments: number
    shares: number
  }>
  lastUpdated: string
  isLive: boolean
}

interface RealTimeEngagement {
  viewsPerMinute: number
  likesPerMinute: number
  commentsPerMinute: number
  engagementVelocity: number
}

interface AnalyticsAlert {
  id: string
  type: 'viral_potential' | 'engagement_spike' | 'performance_drop' | 'milestone_reached'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  postId: string
  platform?: string
  currentValue?: number
  timestamp: string
  acknowledged: boolean
}

interface TrendingContent {
  postId: string
  title: string
  platform: string
  trendScore: number
  velocityScore: number
  currentViews: number
  projectedViews: number
  timeToTrend: number
  confidence: number
}

export function RealTimeAnalyticsDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [liveData, setLiveData] = useState<Record<string, LiveAnalytics>>({})
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>([])
  const [trending, setTrending] = useState<TrendingContent[]>([])
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [realTimeEngagement, setRealTimeEngagement] = useState<RealTimeEngagement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Subscribe to real-time analytics
  const subscribeToAnalytics = async (postIds: string[]) => {
    try {
      const response = await fetch('/api/analytics/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postIds,
          action: 'subscribe'
        })
      })

      if (response.ok) {
        setIsConnected(true)
        startPolling()
      }
    } catch (error) {
      console.error('Failed to subscribe to analytics:', error)
      setError('Failed to connect to real-time analytics')
    }
  }

  // Start polling for updates
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(async () => {
      await Promise.all([
        fetchOverview(),
        fetchAlerts(),
        fetchTrending()
      ])
    }, 5000) // Update every 5 seconds
  }

  // Fetch analytics overview
  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/analytics/realtime?type=overview')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const overview = data.data.overview.reduce((acc: Record<string, LiveAnalytics>, item: any) => {
            acc[item.postId] = item.liveAnalytics
            return acc
          }, {})
          setLiveData(overview)
        }
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error)
    }
  }

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/analytics/realtime?type=alerts&unacknowledged=true')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAlerts(data.data.alerts)
        }
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  // Fetch trending content
  const fetchTrending = async () => {
    try {
      const response = await fetch('/api/analytics/realtime?type=trending&limit=5')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTrending(data.data.trending)
        }
      }
    } catch (error) {
      console.error('Failed to fetch trending:', error)
    }
  }

  // Fetch detailed analytics for selected post
  const fetchPostDetails = async (postId: string) => {
    try {
      const response = await fetch(`/api/analytics/realtime?type=analytics&postId=${postId}&timeWindow=60`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRealTimeEngagement(data.data.realTimeEngagement)
        }
      }
    } catch (error) {
      console.error('Failed to fetch post details:', error)
    }
  }

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/analytics/realtime', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'acknowledge_alert',
          alertId
        })
      })

      if (response.ok) {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true)
      try {
        // Get user's recent posts to subscribe to
        const postsResponse = await fetch('/api/posts?limit=5')
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          const postIds = postsData.posts?.map((post: any) => post.id) || []
          
          if (postIds.length > 0) {
            await subscribeToAnalytics(postIds)
          }
        }
      } catch (error) {
        setError('Failed to initialize dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    initializeDashboard()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle post selection
  useEffect(() => {
    if (selectedPost) {
      fetchPostDetails(selectedPost)
    }
  }, [selectedPost])

  const getSeverityColor = (severity: AnalyticsAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const activePosts = Object.keys(liveData)
  const totalViews = Object.values(liveData).reduce((sum, data) => sum + data.totalViews, 0)
  const totalEngagement = Object.values(liveData).reduce((sum, data) => 
    sum + data.totalLikes + data.totalComments + data.totalShares, 0
  )
  const avgEngagementRate = Object.values(liveData).reduce((sum, data) => sum + data.engagementRate, 0) / 
    Math.max(Object.values(liveData).length, 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            Real-time Analytics
          </h1>
          <p className="text-muted-foreground">
            Live monitoring and insights for your content performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'secondary'} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePosts.length}</div>
            <p className="text-xs text-muted-foreground">currently being monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">likes, comments, shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagementRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">across active posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Trending */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Real-time Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Real-time Alerts
              {alerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {alerts.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Live notifications about your content performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-4">
                <BellOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trending Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Trending Content
            </CardTitle>
            <CardDescription>
              Posts with viral potential and high engagement velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trending.length === 0 ? (
              <div className="text-center py-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No trending content detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trending.map((item) => (
                  <div key={item.postId} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">{item.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {item.trendScore.toFixed(0)}% trend
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Views: {item.currentViews.toLocaleString()}</div>
                      <div>Projected: {item.projectedViews.toLocaleString()}</div>
                      <div>Velocity: {item.velocityScore.toFixed(1)}</div>
                      <div>Confidence: {(item.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
