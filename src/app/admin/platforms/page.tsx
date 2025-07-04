'use client'

import { useState } from 'react'
import { 
  Plus,
  Search,
  Filter,
  Globe,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Zap,
  Share2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlatformDistributionHub } from '@/components/admin/platform-distribution-hub'

// Mock platform data with various categories and statuses
const platforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional Network',
    status: 'active',
    subscribers: 15420,
    postsPublished: 47,
    lastSync: '2 minutes ago',
    apiHealth: 'healthy',
    engagement: '12.5%',
    icon: '🔗',
    description: 'Professional networking platform for business content'
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'Publishing Platform',
    status: 'active',
    subscribers: 8934,
    postsPublished: 32,
    lastSync: '5 minutes ago',
    apiHealth: 'healthy',
    engagement: '8.7%',
    icon: '📝',
    description: 'Popular writing platform for thought leadership'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    category: 'Social Media',
    status: 'warning',
    subscribers: 23567,
    postsPublished: 156,
    lastSync: '15 minutes ago',
    apiHealth: 'degraded',
    engagement: '15.2%',
    icon: '🐦',
    description: 'Microblogging platform for real-time updates'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social Media',
    status: 'inactive',
    subscribers: 5647,
    postsPublished: 0,
    lastSync: 'Never',
    apiHealth: 'error',
    engagement: '0%',
    icon: '📘',
    description: 'Social networking platform for broader audience'
  },
  {
    id: 'devto',
    name: 'Dev.to',
    category: 'Developer Community',
    status: 'active',
    subscribers: 3421,
    postsPublished: 18,
    lastSync: '1 hour ago',
    apiHealth: 'healthy',
    engagement: '9.1%',
    icon: '👨‍💻',
    description: 'Community platform for software developers'
  },
  {
    id: 'hashnode',
    name: 'Hashnode',
    category: 'Developer Community',
    status: 'pending',
    subscribers: 0,
    postsPublished: 0,
    lastSync: 'Never',
    apiHealth: 'pending',
    engagement: '0%',
    icon: '🚀',
    description: 'Blogging platform for developers and tech writers'
  }
]

const categories = [
  'All Categories',
  'Social Media',
  'Professional Network',
  'Publishing Platform',
  'Developer Community',
  'News Platform',
  'Video Platform',
  'Podcast Platform'
]

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}

const healthColors = {
  healthy: 'text-green-500',
  degraded: 'text-yellow-500',
  error: 'text-red-500',
  pending: 'text-blue-500'
}

const healthIcons = {
  healthy: CheckCircle,
  degraded: AlertCircle,
  error: AlertCircle,
  pending: Clock
}

export default function AdminPlatforms() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || platform.category === selectedCategory
    const matchesStatus = selectedStatus === 'All Status' || platform.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Platform Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your content distribution across 1000+ platforms
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="distribute">
            <Share2 className="h-4 w-4 mr-2" />
            Distribution Hub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Platforms
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                156
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Reach
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                2.3M
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                API Health
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                98.7%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Auto-Publish
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                142
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search platforms by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All Status">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="warning">Warning</option>
              <option value="pending">Pending</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform) => {
          const HealthIcon = healthIcons[platform.apiHealth as keyof typeof healthIcons]
          
          return (
            <Card key={platform.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{platform.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {platform.category}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[platform.status as keyof typeof statusColors]}>
                    {platform.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {platform.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subscribers</span>
                  <span className="font-medium">{platform.subscribers.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Posts Published</span>
                  <span className="font-medium">{platform.postsPublished}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Engagement Rate</span>
                  <span className="font-medium">{platform.engagement}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">API Health</span>
                  <div className="flex items-center gap-1">
                    <HealthIcon className={`h-4 w-4 ${healthColors[platform.apiHealth as keyof typeof healthColors]}`} />
                    <span className="font-medium capitalize">{platform.apiHealth}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Sync</span>
                  <span className="font-medium">{platform.lastSync}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Platform Discovery */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Discover New Platforms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Expand your reach with these recommended platforms
            </p>
          </div>
          <Button variant="outline">
            View All 1000+ Platforms
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['YouTube', 'TikTok', 'Instagram'].map((platform) => (
            <div key={platform} className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
              <Globe className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">{platform}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click to integrate
              </p>
            </div>
          ))}
        </div>
      </Card>
        </TabsContent>

        <TabsContent value="distribute">
          <PlatformDistributionHub />
        </TabsContent>
      </Tabs>
    </div>
  )
}
