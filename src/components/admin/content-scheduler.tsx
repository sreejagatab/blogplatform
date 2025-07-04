'use client'

import { useState } from 'react'
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ScheduledPost {
  id: string
  title: string
  content: string
  platforms: string[]
  scheduledFor: Date
  status: 'scheduled' | 'published' | 'failed' | 'draft'
  author: string
  tags: string[]
  featuredImage?: string
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    content: 'Exploring the latest trends and technologies...',
    platforms: ['LinkedIn', 'Twitter', 'Medium'],
    scheduledFor: new Date('2024-01-20T10:00:00'),
    status: 'scheduled',
    author: 'John Doe',
    tags: ['web-dev', 'technology', 'future'],
    featuredImage: '/images/web-dev.jpg'
  },
  {
    id: '2',
    title: 'Database Optimization Tips',
    content: 'Learn how to optimize your database performance...',
    platforms: ['Dev.to', 'Medium'],
    scheduledFor: new Date('2024-01-21T14:30:00'),
    status: 'scheduled',
    author: 'Jane Smith',
    tags: ['database', 'optimization', 'performance']
  },
  {
    id: '3',
    title: 'React Best Practices',
    content: 'Essential patterns and practices for React development...',
    platforms: ['LinkedIn', 'Dev.to'],
    scheduledFor: new Date('2024-01-18T09:00:00'),
    status: 'published',
    author: 'Mike Johnson',
    tags: ['react', 'javascript', 'best-practices'],
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2024-03-18')
    }
  },
  {
    id: '4',
    title: 'AI in Software Development',
    content: 'How AI is transforming the way we build software...',
    platforms: ['Twitter', 'LinkedIn'],
    scheduledFor: new Date('2024-01-19T16:00:00'),
    status: 'failed',
    author: 'Sarah Wilson',
    tags: ['ai', 'software', 'development']
  }
]

export default function ContentScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredPosts = scheduledPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-600 text-white'
      case 'twitter': return 'bg-sky-500 text-white'
      case 'medium': return 'bg-green-600 text-white'
      case 'dev.to': return 'bg-gray-900 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter(post => {
      const postDate = new Date(post.scheduledFor)
      return postDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const CalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const postsForDay = getPostsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-gray-200 dark:border-gray-700 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className={`text-sm font-medium mb-2 ${
            isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {postsForDay.slice(0, 2).map(post => (
              <div
                key={post.id}
                className={`text-xs p-1 rounded truncate ${getStatusColor(post.status)}`}
              >
                {post.title}
              </div>
            ))}
            {postsForDay.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{postsForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 bg-gray-50 dark:bg-gray-800 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  const ListView = () => (
    <div className="space-y-4">
      {filteredPosts.map(post => (
        <Card key={post.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </h3>
                <Badge className={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
                {post.recurring && (
                  <Badge variant="outline" className="text-xs">
                    Recurring
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.scheduledFor.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span>by {post.author}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Platforms:</span>
                {post.platforms.map(platform => (
                  <Badge key={platform} className={`text-xs ${getPlatformColor(platform)}`}>
                    {platform}
                  </Badge>
                ))}
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              {post.status === 'scheduled' && (
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
              )}
              {post.status === 'failed' && (
                <Button variant="ghost" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Scheduler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage your content across all platforms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {scheduledPosts.filter(p => p.status === 'scheduled').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {scheduledPosts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <Share2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {scheduledPosts.filter(p => p.status === 'failed').length}
              </p>
            </div>
            <RotateCcw className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {scheduledPosts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar Navigation (only for calendar view) */}
      {viewMode === 'calendar' && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Content */}
      {viewMode === 'calendar' ? <CalendarView /> : <ListView />}
    </div>
  )
}
