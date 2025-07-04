import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Edit,
  Trash2,
  Eye,
  Users,
  Globe,
  Filter
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scheduled Content - Admin',
  description: 'Manage your scheduled posts and content calendar.',
}

const scheduledPosts = [
  {
    id: '1',
    title: 'AI Content Creation Best Practices',
    platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    scheduledDate: '2024-12-25T10:00:00Z',
    status: 'scheduled',
    author: 'Sarah Johnson',
    type: 'Blog Post',
    engagement: { likes: 0, shares: 0, comments: 0 }
  },
  {
    id: '2',
    title: 'Year-End Content Marketing Review',
    platforms: ['LinkedIn', 'Medium'],
    scheduledDate: '2024-12-30T14:30:00Z',
    status: 'scheduled',
    author: 'Mike Chen',
    type: 'Article',
    engagement: { likes: 0, shares: 0, comments: 0 }
  },
  {
    id: '3',
    title: 'New Year Content Strategy Tips',
    platforms: ['Twitter', 'Instagram', 'Facebook'],
    scheduledDate: '2025-01-01T09:00:00Z',
    status: 'scheduled',
    author: 'Emma Davis',
    type: 'Social Post',
    engagement: { likes: 0, shares: 0, comments: 0 }
  },
  {
    id: '4',
    title: 'Weekly Newsletter - Content Trends',
    platforms: ['Email'],
    scheduledDate: '2024-12-23T08:00:00Z',
    status: 'paused',
    author: 'David Wilson',
    type: 'Newsletter',
    engagement: { likes: 0, shares: 0, comments: 0 }
  },
  {
    id: '5',
    title: 'Holiday Social Media Campaign',
    platforms: ['Instagram', 'TikTok', 'Twitter'],
    scheduledDate: '2024-12-24T12:00:00Z',
    status: 'scheduled',
    author: 'Sarah Johnson',
    type: 'Campaign',
    engagement: { likes: 0, shares: 0, comments: 0 }
  }
]

export default function ScheduledContentPage() {
  const totalScheduled = scheduledPosts.filter(p => p.status === 'scheduled').length
  const pausedPosts = scheduledPosts.filter(p => p.status === 'paused').length

  return (
    <PageLayout>
      <PageHero
        title="Scheduled Content"
        description="Manage your scheduled posts and content calendar across all platforms."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{scheduledPosts.length}</div>
                <div className="text-sm text-muted-foreground">Total Scheduled</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalScheduled}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Pause className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{pausedPosts}</div>
                <div className="text-sm text-muted-foreground">Paused</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    All Status
                  </Button>
                  <Button variant="outline" size="sm">
                    All Platforms
                  </Button>
                  <Button variant="outline" size="sm">
                    All Authors
                  </Button>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm">
                    Calendar View
                  </Button>
                  <Button size="sm">
                    Schedule New Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>
                Manage your upcoming content across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <Badge variant={post.status === 'scheduled' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>By {post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(post.scheduledDate).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-medium">Platforms:</span>
                          {post.platforms.map((platform, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>Likes: {post.engagement.likes}</span>
                          <span>Shares: {post.engagement.shares}</span>
                          <span>Comments: {post.engagement.comments}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {post.status === 'scheduled' ? (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Preview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Visual overview of your scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Calendar view coming soon</p>
                  <Button variant="outline" className="mt-4">
                    View Full Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
