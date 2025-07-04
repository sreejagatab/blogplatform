'use client'

import { useState, useCallback } from 'react'
import { 
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2,
  Edit,
  Copy,
  Eye,
  Image as ImageIcon,
  Video,
  File,
  FolderPlus,
  X,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useDropzone } from 'react-dropzone'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  size: number
  uploadedAt: Date
  dimensions?: { width: number; height: number }
  alt?: string
  tags: string[]
}

interface MediaLibraryProps {
  onSelect?: (item: MediaItem) => void
  multiple?: boolean
  allowedTypes?: ('image' | 'video' | 'document')[]
  maxSize?: number
}

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    url: '/images/hero-banner.jpg',
    thumbnail: '/images/hero-banner-thumb.jpg',
    size: 2048000,
    uploadedAt: new Date('2024-01-15'),
    dimensions: { width: 1920, height: 1080 },
    alt: 'Hero banner for homepage',
    tags: ['banner', 'hero', 'homepage']
  },
  {
    id: '2',
    name: 'tutorial-video.mp4',
    type: 'video',
    url: '/videos/tutorial.mp4',
    thumbnail: '/images/video-thumb.jpg',
    size: 15728640,
    uploadedAt: new Date('2024-01-14'),
    dimensions: { width: 1280, height: 720 },
    tags: ['tutorial', 'education']
  },
  {
    id: '3',
    name: 'product-screenshot.png',
    type: 'image',
    url: '/images/product.png',
    thumbnail: '/images/product-thumb.png',
    size: 1024000,
    uploadedAt: new Date('2024-01-13'),
    dimensions: { width: 800, height: 600 },
    alt: 'Product dashboard screenshot',
    tags: ['product', 'screenshot', 'dashboard']
  },
  {
    id: '4',
    name: 'documentation.pdf',
    type: 'document',
    url: '/docs/documentation.pdf',
    size: 512000,
    uploadedAt: new Date('2024-01-12'),
    tags: ['documentation', 'guide']
  }
]

export default function MediaLibrary({ 
  onSelect, 
  multiple = false, 
  allowedTypes = ['image', 'video', 'document'],
  maxSize = 10 * 1024 * 1024 // 10MB default
}: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    
    for (const file of acceptedFiles) {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newItem: MediaItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date(),
        tags: []
      }
      
      setMediaItems(prev => [newItem, ...prev])
    }
    
    setIsUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md']
    },
    maxSize,
    multiple: true
  })

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    const isAllowedType = allowedTypes.includes(item.type)
    
    return matchesSearch && matchesType && isAllowedType
  })

  const handleItemSelect = (itemId: string) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setSelectedItems([itemId])
      const item = mediaItems.find(item => item.id === itemId)
      if (item && onSelect) {
        onSelect(item)
      }
    }
  }

  const handleConfirmSelection = () => {
    if (onSelect && multiple) {
      const items = mediaItems.filter(item => selectedItems.includes(item.id))
      items.forEach(onSelect)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      default: return File
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your images, videos, and documents
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          {selectedItems.length > 0 && multiple && (
            <Button onClick={handleConfirmSelection}>
              <Check className="h-4 w-4 mr-2" />
              Select {selectedItems.length} Items
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400">Drop files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports images, videos, and documents up to {formatFileSize(maxSize)}
              </p>
            </div>
          )}
          {isUploading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map(item => {
            const Icon = getFileIcon(item.type)
            const isSelected = selectedItems.includes(item.id)
            
            return (
              <Card
                key={item.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleItemSelect(item.id)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.alt || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(item.size)}
                  </p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map(item => {
              const Icon = getFileIcon(item.type)
              const isSelected = selectedItems.includes(item.id)
              
              return (
                <div
                  key={item.id}
                  className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleItemSelect(item.id)}
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.alt || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(item.size)}</span>
                      {item.dimensions && (
                        <span>{item.dimensions.width} × {item.dimensions.height}</span>
                      )}
                      <span>{item.uploadedAt.toLocaleDateString()}</span>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || filterType !== 'all' 
              ? 'No media found matching your criteria'
              : 'No media files yet. Upload some files to get started.'
            }
          </p>
        </Card>
      )}
    </div>
  )
}
