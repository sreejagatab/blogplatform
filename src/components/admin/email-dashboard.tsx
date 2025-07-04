'use client'

import { useState, useEffect } from 'react'
import { 
  Mail,
  Send,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  UserMinus,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Calendar,
  Filter,
  Download,
  Settings,
  BarChart3
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { emailService, EmailAnalytics, EmailCampaign, EmailTemplate } from '@/lib/email-service'
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

export default function EmailDashboard() {
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null)
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'campaigns' | 'templates' | 'subscribers'>('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [analyticsData, templatesData] = await Promise.all([
        emailService.getAnalytics(),
        emailService.getTemplates()
      ])
      
      setAnalytics(analyticsData)
      setTemplates(templatesData)
    } catch (error) {
      console.error('Failed to load email data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'paused': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend,
    suffix = ''
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    trend?: 'up' | 'down'
    suffix?: string
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}{suffix}
          </p>
        </div>
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      {change !== undefined && (
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
      )}
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading email data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Marketing</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your email campaigns, newsletters, and subscriber engagement
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'campaigns', label: 'Campaigns', icon: Send },
          { id: 'templates', label: 'Templates', icon: Mail },
          { id: 'subscribers', label: 'Subscribers', icon: Users }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setSelectedTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Sent"
              value={analytics.totalSent.toLocaleString()}
              change={12.5}
              icon={Send}
              trend="up"
            />
            <StatCard
              title="Open Rate"
              value={analytics.openRate}
              change={-2.1}
              icon={Eye}
              trend="down"
              suffix="%"
            />
            <StatCard
              title="Click Rate"
              value={analytics.clickRate}
              change={5.8}
              icon={MousePointer}
              trend="up"
              suffix="%"
            />
            <StatCard
              title="Unsubscribe Rate"
              value={analytics.unsubscribeRate}
              change={-0.3}
              icon={UserMinus}
              trend="up"
              suffix="%"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Growth */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Audience Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.audienceGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    name="New Subscribers"
                  />
                  <Area
                    type="monotone"
                    dataKey="unsubscribes"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.1}
                    name="Unsubscribes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Email Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Email Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${analytics.deliveryRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analytics.deliveryRate}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${analytics.openRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analytics.openRate}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Click Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${analytics.clickRate * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analytics.clickRate}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${analytics.bounceRate * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analytics.bounceRate}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Campaigns & Top Performing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Campaigns */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Campaigns
              </h3>
              <div className="space-y-4">
                {analytics.recentCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{campaign.sentAt.toLocaleDateString()}</span>
                        <span>{campaign.recipients} recipients</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-blue-600">{campaign.openRate}% opens</span>
                        <span className="text-purple-600">{campaign.clickRate}% clicks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Performing Emails */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Top Performing Emails
              </h3>
              <div className="space-y-4">
                {analytics.topPerformingEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {email.subject}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{email.openRate}% open rate</span>
                        <span>{email.clickRate}% click rate</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {selectedTab === 'campaigns' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email Campaigns
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <Send className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No campaigns yet. Create your first email campaign to get started.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email Templates
              </h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Card key={template.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <Badge className="mt-2">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.subject}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>Updated {template.updatedAt.toLocaleDateString()}</span>
                    <span>{template.variables.length} variables</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Subscribers Tab */}
      {selectedTab === 'subscribers' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Newsletter Subscribers
              </h3>
              <div className="flex items-center gap-2">
                <Input placeholder="Search subscribers..." className="w-64" />
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Subscriber management interface will be implemented here
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
