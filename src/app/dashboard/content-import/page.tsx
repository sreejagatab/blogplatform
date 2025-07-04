'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Plus, 
  Rss, 
  Globe, 
  Settings, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react'

interface FeedSubscription {
  id: string
  feedUrl: string
  feedTitle: string
  feedDescription?: string
  isActive: boolean
  lastProcessedAt?: string
  lastError?: string
  syncFrequency: number
  createdAt: string
  _count?: {
    user: number
  }
}

interface InboundContent {
  id: string
  platform: string
  title?: string
  content: string
  excerpt?: string
  extractedTags: string[]
  extractedTopics: string[]
  sentiment?: string
  language: string
  publishedAt?: string
  createdAt: string
  status: string
}

interface CrossPostingRule {
  id: string
  name: string
  enabled: boolean
  sourcePlatforms: string[]
  targetPlatforms: string[]
  contentFilters?: any
  createdAt: string
}

export default function ContentImportDashboard() {
  const { data: session } = useSession()
  const [feeds, setFeeds] = useState<FeedSubscription[]>([])
  const [inboundContent, setInboundContent] = useState<InboundContent[]>([])
  const [crossPostingRules, setCrossPostingRules] = useState<CrossPostingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Feed management state
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [newFeedTitle, setNewFeedTitle] = useState('')
  const [discoveredFeeds, setDiscoveredFeeds] = useState<any[]>([])
  const [discoveringFeeds, setDiscoveringFeeds] = useState(false)

  // Content filtering state
  const [contentFilter, setContentFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (session?.user) {
      loadDashboardData()
    }
  }, [session])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load feeds
      const feedsResponse = await fetch('/api/feeds')
      if (feedsResponse.ok) {
        const feedsData = await feedsResponse.json()
        setFeeds(feedsData.feeds || [])
      }

      // Load inbound content
      const contentResponse = await fetch('/api/inbound-content')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setInboundContent(contentData.content || [])
      }

      // Load cross-posting rules
      const rulesResponse = await fetch('/api/cross-posting-rules')
      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json()
        setCrossPostingRules(rulesData.rules || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const discoverFeeds = async (websiteUrl: string) => {
    try {
      setDiscoveringFeeds(true)
      const response = await fetch('/api/feeds/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl })
      })

      if (response.ok) {
        const data = await response.json()
        setDiscoveredFeeds(data.feeds || [])
        toast.success(`Found ${data.feeds?.length || 0} RSS feeds`)
      } else {
        toast.error('Failed to discover feeds')
      }
    } catch (error) {
      console.error('Feed discovery failed:', error)
      toast.error('Feed discovery failed')
    } finally {
      setDiscoveringFeeds(false)
    }
  }

  const subscribeFeed = async (feedUrl: string, customTitle?: string) => {
    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl, customTitle })
      })

      if (response.ok) {
        toast.success('Successfully subscribed to feed')
        loadDashboardData()
        setNewFeedUrl('')
        setNewFeedTitle('')
        setDiscoveredFeeds([])
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to subscribe to feed')
      }
    } catch (error) {
      console.error('Feed subscription failed:', error)
      toast.error('Feed subscription failed')
    }
  }

  const toggleFeedStatus = async (feedId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/feeds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId, isActive })
      })

      if (response.ok) {
        toast.success(`Feed ${isActive ? 'activated' : 'deactivated'}`)
        loadDashboardData()
      } else {
        toast.error('Failed to update feed status')
      }
    } catch (error) {
      console.error('Failed to update feed status:', error)
      toast.error('Failed to update feed status')
    }
  }

  const deleteFeed = async (feedId: string) => {
    try {
      const response = await fetch(`/api/feeds?feedId=${feedId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Feed unsubscribed successfully')
        loadDashboardData()
      } else {
        toast.error('Failed to unsubscribe from feed')
      }
    } catch (error) {
      console.error('Failed to delete feed:', error)
      toast.error('Failed to unsubscribe from feed')
    }
  }

  const filteredContent = inboundContent.filter(content => {
    const matchesSearch = !contentFilter || 
      content.title?.toLowerCase().includes(contentFilter.toLowerCase()) ||
      content.content.toLowerCase().includes(contentFilter.toLowerCase())
    
    const matchesPlatform = platformFilter === 'all' || content.platform === platformFilter
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter
    
    return matchesSearch && matchesPlatform && matchesStatus
  })

  const stats = {
    totalFeeds: feeds.length,
    activeFeeds: feeds.filter(f => f.isActive).length,
    feedsWithErrors: feeds.filter(f => f.lastError).length,
    totalContent: inboundContent.length,
    recentContent: inboundContent.filter(c => 
      new Date(c.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
    activeRules: crossPostingRules.filter(r => r.enabled).length
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Import Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your RSS feeds, inbound content, and cross-posting automation
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add RSS Feed</DialogTitle>
              <DialogDescription>
                Subscribe to RSS/Atom feeds to automatically import content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL (for feed discovery)</Label>
                <div className="flex gap-2">
                  <Input
                    id="website-url"
                    placeholder="https://example.com"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                  />
                  <Button 
                    onClick={() => discoverFeeds(newFeedUrl)}
                    disabled={!newFeedUrl || discoveringFeeds}
                  >
                    {discoveringFeeds ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {discoveredFeeds.length > 0 && (
                <div className="space-y-2">
                  <Label>Discovered Feeds</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {discoveredFeeds.map((feed, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{feed.title}</div>
                          <div className="text-sm text-muted-foreground">{feed.url}</div>
                          {feed.description && (
                            <div className="text-xs text-muted-foreground mt-1">{feed.description}</div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => subscribeFeed(feed.url, feed.title)}
                        >
                          Subscribe
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="feed-url">Or enter feed URL directly</Label>
                <Input
                  id="feed-url"
                  placeholder="https://example.com/feed.xml"
                  value={newFeedTitle}
                  onChange={(e) => setNewFeedTitle(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => subscribeFeed(newFeedTitle)}
                disabled={!newFeedTitle}
                className="w-full"
              >
                Subscribe to Feed
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feeds</CardTitle>
            <Rss className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeeds}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeFeeds} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentContent} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-posting Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crossPostingRules.length}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRules} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Errors</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feedsWithErrors}</div>
            <p className="text-xs text-muted-foreground">
              Feeds with issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feeds">RSS Feeds</TabsTrigger>
          <TabsTrigger value="content">Inbound Content</TabsTrigger>
          <TabsTrigger value="rules">Cross-posting Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>Latest imported content from your feeds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inboundContent.slice(0, 5).map((content) => (
                    <div key={content.id} className="flex items-start space-x-3">
                      <Badge variant="outline">{content.platform}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {content.title || 'Untitled'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feed Status</CardTitle>
                <CardDescription>Status of your RSS feed subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feeds.slice(0, 5).map((feed) => (
                    <div key={feed.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {feed.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium truncate">
                          {feed.feedTitle}
                        </span>
                      </div>
                      {feed.lastError && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RSS Feed Subscriptions</CardTitle>
              <CardDescription>Manage your RSS/Atom feed subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeds.map((feed) => (
                  <div key={feed.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{feed.feedTitle}</h3>
                        <Badge variant={feed.isActive ? "default" : "secondary"}>
                          {feed.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {feed.lastError && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{feed.feedUrl}</p>
                      {feed.feedDescription && (
                        <p className="text-xs text-muted-foreground mt-1">{feed.feedDescription}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Sync: every {feed.syncFrequency} minutes</span>
                        {feed.lastProcessedAt && (
                          <span>Last: {new Date(feed.lastProcessedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={feed.isActive}
                        onCheckedChange={(checked) => toggleFeedStatus(feed.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(feed.feedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFeed(feed.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inbound Content</CardTitle>
              <CardDescription>Content imported from your connected platforms and feeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search content..."
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value)}
                  />
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="rss">RSS</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredContent.map((content) => (
                  <div key={content.id} className="p-4 border rounded">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{content.platform}</Badge>
                          <Badge variant={content.status === 'processed' ? 'default' : 'secondary'}>
                            {content.status}
                          </Badge>
                          {content.sentiment && (
                            <Badge variant="outline">{content.sentiment}</Badge>
                          )}
                        </div>
                        <h3 className="font-medium mb-1">{content.title || 'Untitled'}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {content.excerpt || content.content.substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{new Date(content.createdAt).toLocaleString()}</span>
                          <span>{content.language}</span>
                          {content.extractedTags.length > 0 && (
                            <span>Tags: {content.extractedTags.slice(0, 3).join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Publish
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-posting Rules</CardTitle>
              <CardDescription>Automate content distribution across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
                
                {crossPostingRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>From: {rule.sourcePlatforms.join(', ')}</p>
                          <p>To: {rule.targetPlatforms.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.enabled} />
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
