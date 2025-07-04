'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  Tag,
  FileText,
  Bookmark,
  Download,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Template {
  id: string
  title: string
  description: string
  category: 'blog' | 'social' | 'email' | 'landing'
  platform: string[]
  content: string
  tags: string[]
  isPublic: boolean
  isFavorite: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    name: string
    avatar?: string
  }
}

const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    description: 'Perfect template for announcing new product launches across all platforms',
    category: 'blog',
    platform: ['LinkedIn', 'Twitter', 'Medium'],
    content: '🚀 Exciting News! We\'re thrilled to announce the launch of [Product Name]...',
    tags: ['product-launch', 'announcement', 'marketing'],
    isPublic: true,
    isFavorite: true,
    usageCount: 45,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    author: { name: 'Marketing Team' }
  },
  {
    id: '2',
    title: 'Weekly Newsletter Template',
    description: 'Engaging weekly newsletter format with sections for news, tips, and updates',
    category: 'email',
    platform: ['Email'],
    content: '📧 Weekly Roundup - [Date]\n\n🔥 This Week\'s Highlights...',
    tags: ['newsletter', 'weekly', 'email-marketing'],
    isPublic: false,
    isFavorite: false,
    usageCount: 23,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    author: { name: 'Content Team' }
  },
  {
    id: '3',
    title: 'Social Media Contest',
    description: 'Boost engagement with this proven contest template',
    category: 'social',
    platform: ['Instagram', 'Facebook', 'Twitter'],
    content: '🎉 CONTEST TIME! Win amazing prizes by following these simple steps...',
    tags: ['contest', 'engagement', 'social-media'],
    isPublic: true,
    isFavorite: true,
    usageCount: 67,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    author: { name: 'Social Team' }
  }
]

export default function TemplatesPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'landing', label: 'Landing Pages' }
  ]

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Email', label: 'Email' }
  ]

  // Fetch templates from API
  useEffect(() => {
    if (session?.user) {
      fetchTemplates()
    }
  }, [session, selectedCategory, selectedPlatform, showFavoritesOnly, searchQuery])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedPlatform !== 'all' && { platform: selectedPlatform }),
        ...(showFavoritesOnly && { favorites: 'true' }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await fetch(`/api/templates?${params}`)
      if (!response.ok) throw new Error('Failed to fetch templates')

      const data = await response.json()
      setTemplates(data.data.templates)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to fetch templates')
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates

  const handleUseTemplate = async (templateId: string) => {
    try {
      // Record template usage
      await fetch(`/api/templates/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use' })
      })

      // Navigate to create post with template content
      window.location.href = `/admin/posts/create?template=${templateId}`
    } catch (error) {
      console.error('Error using template:', error)
      toast.error('Failed to use template')
    }
  }

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'favorite' })
      })

      if (!response.ok) throw new Error('Failed to toggle favorite')

      const data = await response.json()
      setTemplates(prev => prev.map(template =>
        template.id === templateId
          ? { ...template, isFavorite: data.data.template.isFavorite }
          : template
      ))

      toast.success(data.data.message)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blog': return FileText
      case 'social': return Tag
      case 'email': return Clock
      case 'landing': return Bookmark
      default: return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blog': return 'bg-blue-100 text-blue-800'
      case 'social': return 'bg-green-100 text-green-800'
      case 'email': return 'bg-purple-100 text-purple-800'
      case 'landing': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please sign in to access templates.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Templates</h1>
          <p className="text-muted-foreground">
            Save time with pre-built templates for all your content needs
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Templates
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.isFavorite).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Templates</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.isPublic).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Favorites
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category)
          
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${getCategoryColor(template.category)}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="text-sm">
                        by {template.author.name}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(template.id)}
                  >
                    <Star 
                      className={`h-4 w-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.platform.map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or create a new template.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </Card>
      )}
    </div>
  )
}
