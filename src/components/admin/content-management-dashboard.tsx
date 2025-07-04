'use client'

import { useState } from 'react'
import { 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  Copy,
  Send,
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Bookmark,
  Tag,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ContentItem {
  id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  type: 'article' | 'video' | 'image' | 'social'
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  scheduledFor?: Date
  platforms: string[]
  tags: string[]
  featuredImage?: string
  metrics: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  aiScore?: {
    readability: number
    seo: number
    engagement: number
  }
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    content: 'Artificial Intelligence is revolutionizing...',
    excerpt: 'Exploring how AI is transforming the way we build web applications...',
    status: 'published',
    type: 'article',
    author: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
    platforms: ['LinkedIn', 'Medium', 'Dev.to'],
    tags: ['AI', 'Web Development', 'Technology'],
    featuredImage: '/images/ai-web-dev.jpg',
    metrics: { views: 12500, likes: 450, comments: 89, shares: 156 },
    aiScore: { readability: 85, seo: 92, engagement: 78 }
  },
  {
    id: '2',
    title: 'Database Optimization Best Practices',
    content: 'Learn how to optimize your database performance...',
    excerpt: 'Essential techniques for improving database performance and scalability...',
    status: 'draft',
    type: 'article',
    author: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    platforms: ['Medium', 'Dev.to'],
    tags: ['Database', 'Performance', 'Optimization'],
    metrics: { views: 0, likes: 0, comments: 0, shares: 0 },
    aiScore: { readability: 78, seo: 85, engagement: 72 }
  },
  {
    id: '3',
    title: 'React Hooks Deep Dive',
    content: 'Understanding React Hooks and their use cases...',
    excerpt: 'A comprehensive guide to React Hooks and modern patterns...',
    status: 'scheduled',
    type: 'article',
    author: { id: '3', name: 'Mike Johnson' },
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    scheduledFor: new Date('2024-01-20T10:00:00'),
    platforms: ['LinkedIn', 'Twitter'],
    tags: ['React', 'JavaScript', 'Frontend'],
    featuredImage: '/images/react-hooks.jpg',
    metrics: { views: 0, likes: 0, comments: 0, shares: 0 },
    aiScore: { readability: 90, seo: 88, engagement: 85 }
  }
]

export default function ContentManagementDashboard() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map(item => item.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'archived': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText
      case 'video': return Video
      case 'image': return Image
      case 'social': return MessageCircle
      default: return FileText
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map(item => {
        const TypeIcon = getTypeIcon(item.type)
        const isSelected = selectedItems.includes(item.id)
        
        return (
          <Card
            key={item.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onClick={() => handleItemSelect(item.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4 text-gray-500" />
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Featured Image */}
            {item.featuredImage && (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {item.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Platforms:</span>
                {item.platforms.slice(0, 2).map(platform => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
                {item.platforms.length > 2 && (
                  <span className="text-xs text-gray-500">+{item.platforms.length - 2}</span>
                )}
              </div>

              {/* AI Scores */}
              {item.aiScore && (
                <div className="flex items-center gap-4 text-xs">
                  <span className={`font-medium ${getScoreColor(item.aiScore.readability)}`}>
                    R: {item.aiScore.readability}%
                  </span>
                  <span className={`font-medium ${getScoreColor(item.aiScore.seo)}`}>
                    SEO: {item.aiScore.seo}%
                  </span>
                  <span className={`font-medium ${getScoreColor(item.aiScore.engagement)}`}>
                    E: {item.aiScore.engagement}%
                  </span>
                </div>
              )}

              {/* Metrics */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.metrics.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item.metrics.likes}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={item.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {item.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{item.author.name}</span>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.status === 'scheduled' && item.scheduledFor ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Scheduled for {item.scheduledFor.toLocaleDateString()}
                  </span>
                ) : (
                  <span>Updated {item.updatedAt.toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Edit functionality - navigate to edit page
                  window.location.href = `/admin/posts/${post.id}/edit`
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Copy functionality
                  navigator.clipboard.writeText(post.title)
                  console.log('Post title copied to clipboard')
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Publish functionality
                  console.log('Publishing post:', post.id)
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Delete functionality
                  if (confirm('Are you sure you want to delete this post?')) {
                    console.log('Deleting post:', post.id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )

  const ListView = () => (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Platforms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Metrics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                AI Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Author
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContent.map(item => {
              const TypeIcon = getTypeIcon(item.type)
              const isSelected = selectedItems.includes(item.id)
              
              return (
                <tr key={item.id} className={isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleItemSelect(item.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {item.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.platforms.map(platform => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.metrics.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {item.metrics.likes}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.aiScore && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={getScoreColor(item.aiScore.readability)}>
                          {item.aiScore.readability}%
                        </span>
                        <span className={getScoreColor(item.aiScore.seo)}>
                          {item.aiScore.seo}%
                        </span>
                        <span className={getScoreColor(item.aiScore.engagement)}>
                          {item.aiScore.engagement}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {item.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.author.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and optimize your content across all platforms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Templates functionality
              window.location.href = '/admin/templates'
            }}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            onClick={() => {
              // Create content functionality
              window.location.href = '/admin/posts/create'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Content</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{content.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {content.filter(c => c.status === 'published').length}
              </p>
            </div>
            <Send className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {content.filter(c => c.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {content.filter(c => c.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="image">Images</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk publish functionality
                    console.log('Publishing selected items:', selectedItems)
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk delete functionality
                    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
                      console.log('Deleting selected items:', selectedItems)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {viewMode === 'grid' ? <GridView /> : <ListView />}

      {filteredContent.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No content found matching your criteria'
              : 'No content yet. Create your first piece of content to get started.'
            }
          </p>
        </Card>
      )}
    </div>
  )
}
