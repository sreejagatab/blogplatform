'use client'

import { useState } from 'react'
import { 
  ArrowLeft,
  Save,
  Eye,
  Send,
  Calendar,
  Globe,
  Tag,
  User,
  Image,
  Settings,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import RichTextEditor from '@/components/admin/rich-text-editor'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', enabled: true, color: 'bg-blue-600' },
  { id: 'medium', name: 'Medium', enabled: true, color: 'bg-green-600' },
  { id: 'twitter', name: 'Twitter', enabled: false, color: 'bg-sky-500' },
  { id: 'facebook', name: 'Facebook', enabled: false, color: 'bg-indigo-600' },
  { id: 'devto', name: 'Dev.to', enabled: true, color: 'bg-purple-600' },
  { id: 'hashnode', name: 'Hashnode', enabled: false, color: 'bg-blue-500' },
]

const categories = [
  'Technology',
  'Programming',
  'Artificial Intelligence',
  'Web Development',
  'Database',
  'DevOps',
  'Mobile Development',
  'Design',
  'Business',
  'Tutorials'
]

export default function CreateEditPost() {
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    publishDate: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    platforms: platforms.filter(p => p.enabled).map(p => p.id)
  })

  const [currentTag, setCurrentTag] = useState('')

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!post.tags.includes(currentTag.trim())) {
        setPost(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }))
      }
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handlePlatformToggle = (platformId: string) => {
    setPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleSave = (status: string) => {
    console.log('Saving post with status:', status, post)
  }

  const handleAIOptimize = () => {
    console.log('AI optimization requested')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Write and distribute your content across multiple platforms
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAIOptimize}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Optimize
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <Card className="p-6">
            <Input
              placeholder="Enter your post title..."
              value={post.title}
              onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold border-0 px-0 focus:ring-0 placeholder:text-gray-400"
            />
          </Card>

          {/* Excerpt */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Excerpt (Preview Text)
            </h3>
            <textarea
              placeholder="Write a brief description of your post..."
              value={post.excerpt}
              onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </Card>

          {/* Rich Text Editor */}
          <RichTextEditor
            initialContent={post.content}
            onSave={(content) => setPost(prev => ({ ...prev, content }))}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publish Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={post.status}
                  onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Publish Date
                </label>
                <Input
                  type="datetime-local"
                  value={post.publishDate}
                  onChange={(e) => setPost(prev => ({ ...prev, publishDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Author
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">John Doe</p>
              </div>
            </div>
          </Card>

          {/* Categories and Tags */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={post.category}
                  onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Tags
                </label>
                <Input
                  placeholder="Type and press Enter to add tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer"
                           onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Featured Image */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Image className="h-5 w-5 inline mr-2" />
              Featured Image
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop an image, or click to select
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose File
              </Button>
            </div>
          </Card>

          {/* Platform Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Globe className="h-5 w-5 inline mr-2" />
              Platform Distribution
            </h3>
            <div className="space-y-3">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <button
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      post.platforms.includes(platform.id)
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      post.platforms.includes(platform.id) ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* SEO Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Settings className="h-5 w-5 inline mr-2" />
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Title
                </label>
                <Input
                  placeholder="Custom SEO title"
                  value={post.seoTitle}
                  onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  placeholder="Meta description for search engines"
                  value={post.seoDescription}
                  onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
