'use client'

import { useState, useEffect } from 'react'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Settings,
  Target,
  Globe,
  Calendar,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

interface Platform {
  id: string
  name: string
  displayName: string
  category: 'social' | 'blogging' | 'professional' | 'news' | 'community'
  isConnected: boolean
  isEnabled: boolean
  status: 'online' | 'offline' | 'error'
  lastSync: Date
  icon: string
  color: string
  capabilities: {
    maxContentLength: number
    supportsImages: boolean
    supportsVideo: boolean
    supportsHashtags: boolean
    supportsScheduling: boolean
  }
}

interface PublishingJob {
  id: string
  postId: string
  title: string
  platforms: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
  scheduledAt?: Date
  createdAt: Date
  progress: number
  results: Record<string, {
    success: boolean
    platformPostId?: string
    platformUrl?: string
    error?: string
  }>
}

interface UniversalPublishingHubProps {
  postId?: string
  initialContent?: {
    title: string
    content: string
    excerpt?: string
  }
  onPublishComplete?: (results: any) => void
}

export default function UniversalPublishingHub({ 
  postId, 
  initialContent, 
  onPublishComplete 
}: UniversalPublishingHubProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [publishingJobs, setPublishingJobs] = useState<PublishingJob[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<string>('')
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [activeTab, setActiveTab] = useState('platforms')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlatforms()
    fetchPublishingJobs()
  }, [])

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms')
      if (response.ok) {
        const data = await response.json()
        setPlatforms(data.platforms || mockPlatforms)
      } else {
        setPlatforms(mockPlatforms)
      }
    } catch (error) {
      console.error('Failed to fetch platforms:', error)
      setPlatforms(mockPlatforms)
    }
    setLoading(false)
  }

  const fetchPublishingJobs = async () => {
    try {
      const response = await fetch('/api/publishing/jobs')
      if (response.ok) {
        const data = await response.json()
        setPublishingJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to fetch publishing jobs:', error)
    }
  }

  const mockPlatforms: Platform[] = [
    {
      id: 'linkedin',
      name: 'linkedin',
      displayName: 'LinkedIn',
      category: 'professional',
      isConnected: true,
      isEnabled: true,
      status: 'online',
      lastSync: new Date(),
      icon: '💼',
      color: '#0077B5',
      capabilities: {
        maxContentLength: 3000,
        supportsImages: true,
        supportsVideo: true,
        supportsHashtags: true,
        supportsScheduling: false
      }
    },
    {
      id: 'twitter',
      name: 'twitter',
      displayName: 'Twitter/X',
      category: 'social',
      isConnected: true,
      isEnabled: true,
      status: 'online',
      lastSync: new Date(),
      icon: '🐦',
      color: '#1DA1F2',
      capabilities: {
        maxContentLength: 280,
        supportsImages: true,
        supportsVideo: true,
        supportsHashtags: true,
        supportsScheduling: true
      }
    },
    {
      id: 'medium',
      name: 'medium',
      displayName: 'Medium',
      category: 'blogging',
      isConnected: true,
      isEnabled: true,
      status: 'online',
      lastSync: new Date(),
      icon: '📝',
      color: '#00AB6C',
      capabilities: {
        maxContentLength: 100000,
        supportsImages: true,
        supportsVideo: false,
        supportsHashtags: true,
        supportsScheduling: false
      }
    },
    {
      id: 'devto',
      name: 'devto',
      displayName: 'Dev.to',
      category: 'community',
      isConnected: false,
      isEnabled: false,
      status: 'offline',
      lastSync: new Date(),
      icon: '👩‍💻',
      color: '#0A0A0A',
      capabilities: {
        maxContentLength: 50000,
        supportsImages: true,
        supportsVideo: false,
        supportsHashtags: true,
        supportsScheduling: false
      }
    },
    {
      id: 'facebook',
      name: 'facebook',
      displayName: 'Facebook',
      category: 'social',
      isConnected: true,
      isEnabled: false,
      status: 'online',
      lastSync: new Date(),
      icon: '📘',
      color: '#1877F2',
      capabilities: {
        maxContentLength: 63206,
        supportsImages: true,
        supportsVideo: true,
        supportsHashtags: true,
        supportsScheduling: true
      }
    },
    {
      id: 'instagram',
      name: 'instagram',
      displayName: 'Instagram',
      category: 'social',
      isConnected: false,
      isEnabled: false,
      status: 'offline',
      lastSync: new Date(),
      icon: '📷',
      color: '#E4405F',
      capabilities: {
        maxContentLength: 2200,
        supportsImages: true,
        supportsVideo: true,
        supportsHashtags: true,
        supportsScheduling: true
      }
    }
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsPublishing(true)

    try {
      const scheduledAt = scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`)
        : undefined

      const response = await fetch('/api/posts/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          platforms: selectedPlatforms,
          scheduledAt: scheduledAt?.toISOString(),
          content: initialContent
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Add new job to the list
        const newJob: PublishingJob = {
          id: result.jobId,
          postId: postId || 'new',
          title: initialContent?.title || 'New Post',
          platforms: selectedPlatforms,
          status: 'processing',
          scheduledAt,
          createdAt: new Date(),
          progress: 0,
          results: {}
        }
        
        setPublishingJobs(prev => [newJob, ...prev])
        
        // Simulate progress updates
        simulateProgress(newJob.id)
        
        if (onPublishComplete) {
          onPublishComplete(result)
        }
      } else {
        throw new Error('Publishing failed')
      }
    } catch (error) {
      console.error('Publishing error:', error)
      alert('Publishing failed. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const simulateProgress = (jobId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      
      setPublishingJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, progress: Math.min(progress, 100) }
          : job
      ))
      
      if (progress >= 100) {
        clearInterval(interval)
        setPublishingJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: 'completed', 
                progress: 100,
                results: selectedPlatforms.reduce((acc, platform) => ({
                  ...acc,
                  [platform]: {
                    success: Math.random() > 0.1, // 90% success rate
                    platformPostId: `${platform}_${Date.now()}`,
                    platformUrl: `https://${platform}.com/post/${Date.now()}`
                  }
                }), {})
              }
            : job
        ))
      }
    }, 500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'offline': return <AlertCircle className="h-4 w-4 text-gray-400" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading publishing hub...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Universal Publishing Hub</h2>
          <p className="text-muted-foreground">
            Distribute your content across multiple platforms with one click
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchPlatforms}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Connected Platforms
              </CardTitle>
              <CardDescription>
                Manage your platform connections and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                            style={{ backgroundColor: platform.color }}
                          >
                            {platform.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{platform.displayName}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {platform.category}
                            </p>
                          </div>
                        </div>
                        {getStatusIcon(platform.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Connected</span>
                          <Badge variant={platform.isConnected ? "default" : "secondary"}>
                            {platform.isConnected ? "Yes" : "No"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Enabled</span>
                          <Switch
                            checked={platform.isEnabled}
                            onCheckedChange={(checked) => {
                              setPlatforms(prev => prev.map(p =>
                                p.id === platform.id ? { ...p, isEnabled: checked } : p
                              ))
                            }}
                            disabled={!platform.isConnected}
                          />
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Max length: {platform.capabilities.maxContentLength.toLocaleString()} chars
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {platform.capabilities.supportsImages && (
                            <Badge variant="outline" className="text-xs">Images</Badge>
                          )}
                          {platform.capabilities.supportsVideo && (
                            <Badge variant="outline" className="text-xs">Video</Badge>
                          )}
                          {platform.capabilities.supportsHashtags && (
                            <Badge variant="outline" className="text-xs">Hashtags</Badge>
                          )}
                          {platform.capabilities.supportsScheduling && (
                            <Badge variant="outline" className="text-xs">Scheduling</Badge>
                          )}
                        </div>
                      </div>

                      {!platform.isConnected && (
                        <Button className="w-full mt-3" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publish Tab */}
        <TabsContent value="publish" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Select Platforms
                  </CardTitle>
                  <CardDescription>
                    Choose which platforms to publish to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {platforms
                      .filter(p => p.isConnected && p.isEnabled)
                      .map((platform) => (
                        <div
                          key={platform.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPlatforms.includes(platform.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platform.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{platform.displayName}</h4>
                              <p className="text-xs text-muted-foreground">
                                {platform.capabilities.maxContentLength.toLocaleString()} chars max
                              </p>
                            </div>
                            {selectedPlatforms.includes(platform.id) && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {selectedPlatforms.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        Selected platforms ({selectedPlatforms.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlatforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId)
                          return platform ? (
                            <Badge key={platformId} variant="secondary">
                              {platform.displayName}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Publishing Options */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Publishing Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date">Schedule Date (Optional)</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="schedule-time">Schedule Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      disabled={!scheduledDate}
                    />
                  </div>

                  <Separator />

                  <Button
                    className="w-full"
                    onClick={handlePublish}
                    disabled={isPublishing || selectedPlatforms.length === 0}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : scheduledDate ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Post
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publish Now
                      </>
                    )}
                  </Button>

                  {selectedPlatforms.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Select at least one platform to publish
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Publishing History
              </CardTitle>
              <CardDescription>
                View recent publishing jobs and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {publishingJobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No publishing jobs yet</p>
                      <p className="text-sm">Your publishing history will appear here</p>
                    </div>
                  ) : (
                    publishingJobs.map((job) => (
                      <Card key={job.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {job.platforms.length} platform{job.platforms.length !== 1 ? 's' : ''}
                                {job.scheduledAt && (
                                  <span> • Scheduled for {job.scheduledAt.toLocaleString()}</span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getJobStatusIcon(job.status)}
                              <Badge variant={
                                job.status === 'completed' ? 'default' :
                                job.status === 'failed' ? 'destructive' :
                                job.status === 'partial' ? 'secondary' : 'outline'
                              }>
                                {job.status}
                              </Badge>
                            </div>
                          </div>

                          {job.status === 'processing' && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Publishing progress</span>
                                <span>{Math.round(job.progress)}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {job.platforms.map(platformId => {
                              const platform = platforms.find(p => p.id === platformId)
                              const result = job.results[platformId]

                              return platform ? (
                                <div
                                  key={platformId}
                                  className={`p-2 rounded border text-center ${
                                    result?.success === true ? 'border-green-200 bg-green-50' :
                                    result?.success === false ? 'border-red-200 bg-red-50' :
                                    'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="text-xs font-medium">{platform.displayName}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {result?.success === true ? (
                                      <span className="text-green-600">✓ Published</span>
                                    ) : result?.success === false ? (
                                      <span className="text-red-600">✗ Failed</span>
                                    ) : (
                                      <span className="text-gray-500">Pending</span>
                                    )}
                                  </div>
                                  {result?.platformUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-full mt-1 text-xs"
                                      onClick={() => window.open(result.platformUrl, '_blank')}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  )}
                                </div>
                              ) : null
                            })}
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <span className="text-xs text-muted-foreground">
                              Created {job.createdAt.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              {job.status === 'failed' && (
                                <Button variant="ghost" size="sm">
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Retry
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
