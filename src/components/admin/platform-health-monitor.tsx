'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  Server,
  Wifi,
  WifiOff,
  AlertCircle,
  Info,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface PlatformHealth {
  id: string
  name: string
  displayName: string
  status: 'online' | 'degraded' | 'offline' | 'maintenance'
  responseTime: number
  uptime: number
  lastChecked: Date
  errorRate: number
  requestsPerMinute: number
  rateLimitRemaining: number
  rateLimitTotal: number
  issues: HealthIssue[]
  metrics: HealthMetric[]
}

interface HealthIssue {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: Date
  resolved: boolean
}

interface HealthMetric {
  timestamp: Date
  responseTime: number
  errorRate: number
  requestCount: number
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  platform?: string
  acknowledged: boolean
}

export default function PlatformHealthMonitor() {
  const [platforms, setPlatforms] = useState<PlatformHealth[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchHealthData()
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchHealthData()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/platforms/health')
      if (response.ok) {
        const data = await response.json()
        setPlatforms(data.platforms || mockPlatforms)
        setAlerts(data.alerts || mockAlerts)
      } else {
        // Use mock data if API fails
        setPlatforms(mockPlatforms)
        setAlerts(mockAlerts)
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error)
      setPlatforms(mockPlatforms)
      setAlerts(mockAlerts)
    }
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  const mockPlatforms: PlatformHealth[] = [
    {
      id: 'linkedin',
      name: 'linkedin',
      displayName: 'LinkedIn',
      status: 'online',
      responseTime: 245,
      uptime: 99.8,
      lastChecked: new Date(),
      errorRate: 0.2,
      requestsPerMinute: 45,
      rateLimitRemaining: 850,
      rateLimitTotal: 1000,
      issues: [],
      metrics: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        responseTime: Math.random() * 100 + 200,
        errorRate: Math.random() * 2,
        requestCount: Math.floor(Math.random() * 100) + 20
      }))
    },
    {
      id: 'twitter',
      name: 'twitter',
      displayName: 'Twitter/X',
      status: 'degraded',
      responseTime: 1250,
      uptime: 97.5,
      lastChecked: new Date(),
      errorRate: 5.2,
      requestsPerMinute: 32,
      rateLimitRemaining: 150,
      rateLimitTotal: 300,
      issues: [
        {
          id: '1',
          severity: 'warning',
          title: 'High Response Time',
          description: 'API response times are above normal thresholds',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          resolved: false
        }
      ],
      metrics: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        responseTime: Math.random() * 500 + 800,
        errorRate: Math.random() * 8 + 2,
        requestCount: Math.floor(Math.random() * 80) + 10
      }))
    },
    {
      id: 'medium',
      name: 'medium',
      displayName: 'Medium',
      status: 'online',
      responseTime: 180,
      uptime: 99.9,
      lastChecked: new Date(),
      errorRate: 0.1,
      requestsPerMinute: 28,
      rateLimitRemaining: 480,
      rateLimitTotal: 500,
      issues: [],
      metrics: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        responseTime: Math.random() * 80 + 150,
        errorRate: Math.random() * 0.5,
        requestCount: Math.floor(Math.random() * 60) + 15
      }))
    },
    {
      id: 'facebook',
      name: 'facebook',
      displayName: 'Facebook',
      status: 'offline',
      responseTime: 0,
      uptime: 95.2,
      lastChecked: new Date(),
      errorRate: 100,
      requestsPerMinute: 0,
      rateLimitRemaining: 0,
      rateLimitTotal: 200,
      issues: [
        {
          id: '2',
          severity: 'critical',
          title: 'API Unavailable',
          description: 'Facebook API is not responding to requests',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          resolved: false
        }
      ],
      metrics: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        responseTime: i > 20 ? 0 : Math.random() * 200 + 300,
        errorRate: i > 20 ? 100 : Math.random() * 3,
        requestCount: i > 20 ? 0 : Math.floor(Math.random() * 40) + 5
      }))
    }
  ]

  const mockAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'error',
      title: 'Facebook API Down',
      message: 'Facebook platform is experiencing connectivity issues',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      platform: 'facebook',
      acknowledged: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Twitter Rate Limit Low',
      message: 'Twitter rate limit is below 20% threshold',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      platform: 'twitter',
      acknowledged: false
    },
    {
      id: '3',
      type: 'info',
      title: 'LinkedIn Maintenance Scheduled',
      message: 'LinkedIn has scheduled maintenance for tomorrow 2-4 AM UTC',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      platform: 'linkedin',
      acknowledged: true
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'offline':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'maintenance':
        return <Settings className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200'
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'offline': return 'text-red-600 bg-red-50 border-red-200'
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const overallHealth = platforms && platforms.length > 0
    ? platforms.filter(p => p && p.status === 'online').length / platforms.length * 100
    : 0

  const criticalIssues = platforms && platforms.length > 0
    ? platforms.reduce((count, platform) =>
        count + (platform.issues || []).filter(issue => issue.severity === 'critical' && !issue.resolved).length, 0
      )
    : 0

  const unacknowledgedAlerts = alerts && alerts.length > 0
    ? alerts.filter(alert => !alert.acknowledged).length
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading platform health data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Health Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of platform APIs and system health
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealthData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Health</p>
                <p className="text-2xl font-bold">{overallHealth.toFixed(1)}%</p>
              </div>
              <div className={`p-2 rounded-full ${overallHealth > 90 ? 'bg-green-100' : overallHealth > 70 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {overallHealth > 90 ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : overallHealth > 70 ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <Progress value={overallHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Platforms</p>
                <p className="text-2xl font-bold">
                  {platforms && platforms.length > 0 ? platforms.filter(p => p && p.status === 'online').length : 0}/{platforms ? platforms.length : 0}
                </p>
              </div>
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{criticalIssues}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{unacknowledgedAlerts}</p>
              </div>
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Status</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        {/* Platform Status Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {platforms && platforms.map((platform) => platform ? (
              <Card key={platform.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{platform.displayName || 'Unknown Platform'}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(platform.status || 'offline')}
                      <Badge className={getStatusColor(platform.status || 'offline')}>
                        {platform.status || 'offline'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-lg font-semibold">
                        {platform.responseTime && platform.responseTime > 0 ? `${platform.responseTime}ms` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-semibold">{platform.uptime || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <p className="text-lg font-semibold">{platform.errorRate || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requests/min</p>
                      <p className="text-lg font-semibold">{platform.requestsPerMinute || 0}</p>
                    </div>
                  </div>

                  {/* Rate Limit */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Rate Limit</p>
                      <p className="text-sm">
                        {platform.rateLimitRemaining || 0}/{platform.rateLimitTotal || 0}
                      </p>
                    </div>
                    <Progress
                      value={platform.rateLimitTotal ? ((platform.rateLimitRemaining || 0) / platform.rateLimitTotal) * 100 : 0}
                      className="h-2"
                    />
                  </div>

                  {/* Issues */}
                  {platform.issues && platform.issues.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Active Issues</p>
                      <div className="space-y-2">
                        {platform.issues.filter(issue => !issue.resolved).map((issue) => (
                          <div
                            key={issue.id}
                            className={`p-2 rounded border-l-4 ${
                              issue.severity === 'critical' ? 'border-red-500 bg-red-50' :
                              issue.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                              'border-blue-500 bg-blue-50'
                            }`}
                          >
                            <p className="text-sm font-medium">{issue.title}</p>
                            <p className="text-xs text-muted-foreground">{issue.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {issue.timestamp.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Last checked: {platform.lastChecked ? platform.lastChecked.toLocaleString() : 'Never'}
                  </div>
                </CardContent>
              </Card>
            ) : null)}
          </div>
        </TabsContent>

        {/* Performance Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platforms && platforms.map((platform) => platform ? (
              <Card key={platform.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{platform.displayName || 'Unknown Platform'} Metrics</CardTitle>
                  <CardDescription>24-hour performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Response Time Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Response Time (ms)</h4>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={platform.metrics || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value) => [`${value}ms`, 'Response Time']}
                          />
                          <Line
                            type="monotone"
                            dataKey="responseTime"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Error Rate Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Error Rate (%)</h4>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={platform.metrics || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value) => [`${value}%`, 'Error Rate']}
                          />
                          <Line
                            type="monotone"
                            dataKey="errorRate"
                            stroke="#ff7300"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Request Count Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Request Count</h4>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={platform.metrics || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value) => [value, 'Requests']}
                          />
                          <Bar dataKey="requestCount" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null)}
          </div>
        </TabsContent>

        {/* System Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Recent alerts and notifications from platform monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {!alerts || alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No alerts</p>
                      <p className="text-sm">All systems are running normally</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${
                          alert.acknowledged ? 'opacity-60' : ''
                        } ${
                          alert.type === 'error' ? 'border-red-200 bg-red-50' :
                          alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                          alert.type === 'info' ? 'border-blue-200 bg-blue-50' :
                          'border-green-200 bg-green-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{alert.title}</h4>
                                {alert.platform && (
                                  <Badge variant="outline" className="text-xs">
                                    {alert.platform}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {alert.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {alert.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!alert.acknowledged && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAlerts(prev => prev.map(a =>
                                    a.id === alert.id ? { ...a, acknowledged: true } : a
                                  ))
                                }}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {alert.acknowledged && (
                              <Badge variant="secondary" className="text-xs">
                                Acknowledged
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
