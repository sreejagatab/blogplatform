'use client'

import { useState } from 'react'
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Globe,
  Zap,
  Bell,
  Filter,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAnalyticsDashboard, useRealTimeEvents, useAnalyticsNotifications } from '@/hooks/use-analytics'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function RealTimeAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | 'day' | 'week'>('day')
  const [showNotifications, setShowNotifications] = useState(false)
  
  const {
    metrics,
    realTimeEvents,
    platformComparison,
    trendingContent,
    loading,
    error,
    dateRange,
    selectedPlatforms,
    selectedMetric,
    refresh,
    updateDateRange,
    togglePlatform,
    setSelectedMetric
  } = useAnalyticsDashboard()

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAnalyticsNotifications()

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading real-time analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading analytics: {error}</div>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    )
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend,
    realTime = false
  }: {
    title: string
    value: string | number
    change: number
    icon: any
    trend: 'up' | 'down'
    realTime?: boolean
  }) => (
    <Card className="p-6 relative">
      {realTime && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400">LIVE</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">vs last period</span>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Real-Time Analytics</h1>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Activity className="h-4 w-4 text-green-600 animate-pulse" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">LIVE</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your content performance in real-time across all platforms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Notifications
            </h3>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No notifications yet
              </p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Live Views"
          value={metrics?.totalViews.toLocaleString() || '0'}
          change={23.5}
          icon={Eye}
          trend="up"
          realTime
        />
        <StatCard
          title="Live Engagement"
          value={metrics?.totalLikes.toLocaleString() || '0'}
          change={18.2}
          icon={Heart}
          trend="up"
          realTime
        />
        <StatCard
          title="Active Users"
          value={metrics?.uniqueVisitors.toLocaleString() || '0'}
          change={-5.1}
          icon={Users}
          trend="down"
          realTime
        />
        <StatCard
          title="Conversion Rate"
          value={`${((metrics?.totalLikes || 0) / Math.max(metrics?.totalViews || 1, 1) * 100).toFixed(1)}%`}
          change={31.8}
          icon={Zap}
          trend="up"
          realTime
        />
      </div>

      {/* Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Activity
              </h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
            >
              <option value="views">Views</option>
              <option value="likes">Likes</option>
              <option value="comments">Comments</option>
              <option value="shares">Shares</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics?.timeSeriesData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Platform Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformComparison || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="metrics.views" fill="#3B82F6" name="Views" />
              <Bar dataKey="metrics.engagement" fill="#10B981" name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Real-Time Activity Feed & Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Activity Feed
            </h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {realTimeEvents.map((event, index) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  {event.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                  {event.type === 'like' && <Heart className="h-4 w-4 text-red-600" />}
                  {event.type === 'comment' && <MessageCircle className="h-4 w-4 text-green-600" />}
                  {event.type === 'share' && <Share2 className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.type === 'view' && 'New page view'}
                    {event.type === 'like' && 'Content liked'}
                    {event.type === 'comment' && 'New comment'}
                    {event.type === 'share' && 'Content shared'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {event.platform && (
                      <Badge variant="secondary" className="text-xs">
                        {event.platform}
                      </Badge>
                    )}
                    <span>{event.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                {index === 0 && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    NEW
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Trending Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trending Now
            </h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
            >
              <option value="hour">Last Hour</option>
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="space-y-3">
            {trendingContent?.slice(0, 5).map((item, index) => (
              <div key={item.postId} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Score: {item.score}</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {item.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No trending content yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
