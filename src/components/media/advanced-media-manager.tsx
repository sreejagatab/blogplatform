'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
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
  Settings, 
  Zap,
  RefreshCw,
  MoreHorizontal,
  Tag,
  Calendar,
  User,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  size: number
  folder: string
  alt: string
  tags: string[]
  dimensions?: { width: number; height: number }
  uploadedAt: Date
  uploadedBy: {
    name: string
    image?: string
  }
}

interface UploadProgress {
  filename: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}

export default function AdvancedMediaManager() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentFolder, setCurrentFolder] = useState('general')
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  // Fetch media files
  const fetchMediaFiles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        folder: currentFolder,
        ...(filterType !== 'all' && { type: filterType }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await fetch(`/api/media/upload?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMediaFiles(data.data.files || [])
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
      toast.error('Failed to load media files')
    } finally {
      setLoading(false)
    }
  }, [currentFolder, filterType, searchQuery])

  useEffect(() => {
    fetchMediaFiles()
  }, [fetchMediaFiles])

  // File upload handling
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    
    // Initialize progress tracking
    const initialProgress = acceptedFiles.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'uploading' as const
    }))
    setUploadProgress(initialProgress)

    try {
      const formData = new FormData()
      acceptedFiles.forEach(file => formData.append('files', file))
      formData.append('folder', currentFolder)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(item => ({
            ...item,
            progress: Math.min(item.progress + Math.random() * 20, 90)
          }))
        )
      }, 500)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const result = await response.json()
        
        // Update progress to complete
        setUploadProgress(prev => 
          prev.map(item => ({
            ...item,
            progress: 100,
            status: 'complete' as const
          }))
        )

        // Add new files to the list
        if (result.data.uploadedFiles) {
          setMediaFiles(prev => [...result.data.uploadedFiles, ...prev])
        }

        // Show errors if any
        if (result.data.errors && result.data.errors.length > 0) {
          result.data.errors.forEach((error: any) => {
            toast.error(`Failed to upload ${error.filename}: ${error.error}`)
          })
        }

        toast.success(`Successfully uploaded ${result.data.uploadedFiles.length} files`)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress(prev => 
        prev.map(item => ({
          ...item,
          status: 'error' as const,
          error: 'Upload failed'
        }))
      )
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress([]), 3000)
    }
  }, [currentFolder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  })

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0) return

    try {
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedFiles })
      })

      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
        setSelectedFiles([])
        toast.success(`Deleted ${selectedFiles.length} files`)
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete files')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon
    if (mimeType.startsWith('video/')) return Video
    return File
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || file.mimeType.startsWith(filterType + '/')
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Media Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your media files with advanced features
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMediaFiles}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {selectedFiles.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteFiles}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedFiles.length})
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
                Supports images, videos, and documents up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadProgress.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{item.filename}</span>
                    <span className={`
                      ${item.status === 'complete' ? 'text-green-600' : ''}
                      ${item.status === 'error' ? 'text-red-600' : ''}
                    `}>
                      {item.status === 'complete' ? 'Complete' : 
                       item.status === 'error' ? 'Error' : 
                       `${Math.round(item.progress)}%`}
                    </span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Filters and Controls */}
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
            <option value="application">Documents</option>
          </select>

          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          >
            <option value="general">General</option>
            <option value="blog">Blog</option>
            <option value="products">Products</option>
            <option value="marketing">Marketing</option>
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map(file => {
            const Icon = getFileIcon(file.mimeType)
            const isSelected = selectedFiles.includes(file.id)
            
            return (
              <Card
                key={file.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {file.mimeType.startsWith('image/') ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={file.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
            {filteredFiles.map(file => {
              const Icon = getFileIcon(file.mimeType)
              const isSelected = selectedFiles.includes(file.id)
              
              return (
                <div
                  key={file.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded"
                  />
                  
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {file.mimeType.startsWith('image/') ? (
                      <img
                        src={file.thumbnailUrl || file.url}
                        alt={file.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.originalName}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.dimensions && (
                        <span>{file.dimensions.width} × {file.dimensions.height}</span>
                      )}
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedFile(file)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{file.originalName}</DialogTitle>
                        </DialogHeader>
                        <FilePreview file={file} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(file.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {filteredFiles.length === 0 && !loading && (
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

function FilePreview({ file }: { file: MediaFile }) {
  return (
    <div className="space-y-4">
      {file.mimeType.startsWith('image/') ? (
        <img
          src={file.url}
          alt={file.alt}
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      ) : file.mimeType.startsWith('video/') ? (
        <video
          src={file.url}
          controls
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <File className="h-16 w-16 text-gray-400" />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>File Name:</strong> {file.originalName}
        </div>
        <div>
          <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
        <div>
          <strong>Type:</strong> {file.mimeType}
        </div>
        <div>
          <strong>Uploaded:</strong> {new Date(file.uploadedAt).toLocaleDateString()}
        </div>
        {file.dimensions && (
          <div>
            <strong>Dimensions:</strong> {file.dimensions.width} × {file.dimensions.height}
          </div>
        )}
        <div>
          <strong>Folder:</strong> {file.folder}
        </div>
      </div>
      
      {file.tags.length > 0 && (
        <div>
          <strong>Tags:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {file.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
