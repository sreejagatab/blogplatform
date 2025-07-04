'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  UserMinus, 
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { formatDistanceToNow } from 'date-fns'

interface EmailAnalytics {
  totalSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  bounceRate: number
  recentCampaigns: Array<{
    id: string
    name: string
    sentAt: Date
    recipients: number
    openRate: number
    clickRate: number
  }>
  topPerformingEmails: Array<{
    id: string
    subject: string
    openRate: number
    clickRate: number
  }>
  audienceGrowth: Array<{
    date: Date
    subscribers: number
    unsubscribes: number
  }>
}

export default function EmailAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/email/analytics?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching email analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch(`/api/email/analytics/export?timeframe=${timeframe}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `email-analytics-${timeframe}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No analytics data available
        </p>
      </Card>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your email campaign performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sent"
          value={analytics.totalSent.toLocaleString()}
          icon={Mail}
          color="blue"
        />
        <MetricCard
          title="Delivery Rate"
          value={`${analytics.deliveryRate.toFixed(1)}%`}
          icon={TrendingUp}
          color="green"
          trend={analytics.deliveryRate > 95 ? 'up' : 'down'}
        />
        <MetricCard
          title="Open Rate"
          value={`${analytics.openRate.toFixed(1)}%`}
          icon={Eye}
          color="purple"
          trend={analytics.openRate > 20 ? 'up' : 'down'}
        />
        <MetricCard
          title="Click Rate"
          value={`${analytics.clickRate.toFixed(1)}%`}
          icon={MousePointer}
          color="orange"
          trend={analytics.clickRate > 3 ? 'up' : 'down'}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Unsubscribe Rate"
          value={`${analytics.unsubscribeRate.toFixed(2)}%`}
          icon={UserMinus}
          color="red"
          trend={analytics.unsubscribeRate < 0.5 ? 'up' : 'down'}
        />
        <MetricCard
          title="Bounce Rate"
          value={`${analytics.bounceRate.toFixed(1)}%`}
          icon={AlertTriangle}
          color="yellow"
          trend={analytics.bounceRate < 2 ? 'up' : 'down'}
        />
        <MetricCard
          title="List Growth"
          value={`+${analytics.audienceGrowth.slice(-7).reduce((sum, day) => sum + day.subscribers, 0)}`}
          icon={Users}
          color="green"
          subtitle="Last 7 days"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audience Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.audienceGrowth.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="subscribers" 
                stroke="#10B981" 
                strokeWidth={2}
                name="New Subscribers"
              />
              <Line 
                type="monotone" 
                dataKey="unsubscribes" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Unsubscribes"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Campaign Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.recentCampaigns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="openRate" fill="#3B82F6" name="Open Rate %" />
              <Bar dataKey="clickRate" fill="#10B981" name="Click Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Emails */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Emails</h3>
          <div className="space-y-4">
            {analytics.topPerformingEmails.map((email, index) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{email.subject}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Open: {email.openRate.toFixed(1)}%</span>
                    <span>Click: {email.clickRate.toFixed(1)}%</span>
                  </div>
                </div>
                <Badge variant="secondary">#{index + 1}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Campaigns */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {analytics.recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{campaign.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{campaign.recipients} recipients</span>
                    <span>{formatDistanceToNow(new Date(campaign.sentAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{campaign.openRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">open rate</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Good Performance</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your open rate is {analytics.openRate > 20 ? 'above' : 'below'} industry average (20%)
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900 dark:text-green-100">List Health</span>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Low unsubscribe rate indicates good content quality
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900 dark:text-purple-100">Engagement</span>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Click rate suggests {analytics.clickRate > 3 ? 'strong' : 'moderate'} audience engagement
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  subtitle 
}: {
  title: string
  value: string
  icon: any
  color: string
  trend?: 'up' | 'down'
  subtitle?: string
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    yellow: 'text-yellow-600 bg-yellow-100'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? 'Good' : 'Needs attention'}
          </span>
        </div>
      )}
    </Card>
  )
}
