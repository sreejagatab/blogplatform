'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  TrendingUp,
  Globe,
  Zap,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { formatDistanceToNow } from 'date-fns'

interface RealTimeMetrics {
  activeUsers: number
  currentViews: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  engagementRate: number
  topContent: Array<{
    id: string
    title: string
    views: number
    platform?: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
    platform?: string
  }>
  platformBreakdown: Array<{
    platform: string
    views: number
    percentage: number
  }>
}

interface RealTimeEvent {
  type: 'page-view' | 'like' | 'comment' | 'share'
  postId?: string
  platform?: string
  timestamp: Date
  data?: any
}

export default function RealTimeDashboard() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [recentEvents, setRecentEvents] = useState<RealTimeEvent[]>([])

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) return

    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      auth: {
        token: 'session-token' // In production, use actual JWT token
      }
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      socketInstance.emit('join-admin-analytics')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for real-time analytics updates
    socketInstance.on('analytics-update', (data: any) => {
      if (isLive) {
        updateMetrics(data)
        addToTimeSeries(data)
        addRecentEvent(data)
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [session, isLive])

  // Fetch initial metrics
  useEffect(() => {
    if (session?.user) {
      fetchInitialMetrics()
    }
  }, [session])

  const fetchInitialMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/realtime')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.data)
        
        // Initialize time series with recent data
        const timeSeriesResponse = await fetch('/api/analytics/timeseries?timeframe=1h')
        if (timeSeriesResponse.ok) {
          const timeSeriesData = await timeSeriesResponse.json()
          setTimeSeriesData(timeSeriesData.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching initial metrics:', error)
    }
  }

  const updateMetrics = (data: any) => {
    setMetrics(prev => {
      if (!prev) return prev

      const updated = { ...prev }
      
      switch (data.type) {
        case 'page-view':
          updated.currentViews++
          updated.totalViews++
          break
        case 'like':
          updated.totalLikes++
          break
        case 'comment':
          updated.totalComments++
          break
        case 'share':
          updated.totalShares++
          break
      }

      // Recalculate engagement rate
      const totalEngagement = updated.totalLikes + updated.totalComments + updated.totalShares
      updated.engagementRate = updated.totalViews > 0 ? (totalEngagement / updated.totalViews) * 100 : 0

      return updated
    })
  }

  const addToTimeSeries = (data: any) => {
    const now = new Date()
    const timePoint = {
      timestamp: now.toISOString(),
      views: data.type === 'page-view' ? 1 : 0,
      likes: data.type === 'like' ? 1 : 0,
      comments: data.type === 'comment' ? 1 : 0,
      shares: data.type === 'share' ? 1 : 0
    }

    setTimeSeriesData(prev => {
      const updated = [...prev, timePoint]
      // Keep only last 60 data points (1 hour if 1 point per minute)
      return updated.slice(-60)
    })
  }

  const addRecentEvent = (data: any) => {
    const event: RealTimeEvent = {
      type: data.type,
      postId: data.postId,
      platform: data.platform,
      timestamp: new Date(),
      data
    }

    setRecentEvents(prev => [event, ...prev.slice(0, 19)]) // Keep last 20 events
  }

  const toggleLiveUpdates = () => {
    setIsLive(!isLive)
  }

  const refreshData = () => {
    fetchInitialMetrics()
  }

  if (!session?.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Access denied. Admin or Editor role required.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveUpdates}
            className={isLive ? 'bg-green-50 border-green-200' : ''}
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? 'Pause' : 'Resume'} Live
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Live Views"
          value={metrics?.currentViews || 0}
          total={metrics?.totalViews || 0}
          icon={Eye}
          color="blue"
          isLive={isLive}
        />
        <MetricCard
          title="Active Users"
          value={metrics?.activeUsers || 0}
          icon={Users}
          color="green"
          isLive={isLive}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(metrics?.engagementRate || 0).toFixed(1)}%`}
          icon={Heart}
          color="red"
          isLive={isLive}
        />
        <MetricCard
          title="Total Interactions"
          value={(metrics?.totalLikes || 0) + (metrics?.totalComments || 0) + (metrics?.totalShares || 0)}
          icon={Zap}
          color="purple"
          isLive={isLive}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="likes" 
                stackId="1"
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="comments" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Platform Breakdown
          </h3>
          <div className="space-y-3">
            {metrics?.platformBreakdown?.map((platform, index) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="font-medium capitalize">{platform.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{platform.views}</span>
                  <Badge variant="secondary" className="text-xs">
                    {platform.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No platform data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentEvents.map((event, index) => (
            <div key={`${event.timestamp}-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className={`p-1 rounded-full ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {getEventDescription(event)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </p>
              </div>
              {event.platform && (
                <Badge variant="outline" className="text-xs">
                  {event.platform}
                </Badge>
              )}
            </div>
          ))}
          {recentEvents.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, total, icon: Icon, color, isLive }: any) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {total !== undefined && (
            <p className="text-xs text-gray-500">
              of {total.toLocaleString()} total
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {isLive && (
        <div className="mt-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600">Live</span>
        </div>
      )}
    </Card>
  )
}

function getEventIcon(type: string) {
  switch (type) {
    case 'page-view':
      return <Eye className="h-3 w-3" />
    case 'like':
      return <Heart className="h-3 w-3" />
    case 'comment':
      return <MessageCircle className="h-3 w-3" />
    case 'share':
      return <Share2 className="h-3 w-3" />
    default:
      return <Activity className="h-3 w-3" />
  }
}

function getEventColor(type: string) {
  switch (type) {
    case 'page-view':
      return 'bg-blue-100 text-blue-600'
    case 'like':
      return 'bg-red-100 text-red-600'
    case 'comment':
      return 'bg-green-100 text-green-600'
    case 'share':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function getEventDescription(event: RealTimeEvent) {
  switch (event.type) {
    case 'page-view':
      return 'New page view'
    case 'like':
      return 'Post liked'
    case 'comment':
      return 'New comment'
    case 'share':
      return 'Post shared'
    default:
      return 'Unknown activity'
  }
}
