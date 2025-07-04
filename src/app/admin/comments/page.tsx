import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
  Eye
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comment Moderation - Admin',
  description: 'Moderate and manage user comments across all content.',
}

const comments = [
  {
    id: '1',
    author: 'John Smith',
    email: 'john@example.com',
    content: 'This is a really insightful article! I especially liked the section about AI content creation. Looking forward to more posts like this.',
    post: 'AI Content Creation Best Practices',
    status: 'pending',
    date: '2024-12-20T14:30:00Z',
    likes: 0,
    replies: 0,
    flagged: false
  },
  {
    id: '2',
    author: 'Sarah Johnson',
    email: 'sarah@example.com',
    content: 'Great tips! I\'ve been struggling with content consistency and this workflow approach seems perfect for my team.',
    post: 'Building a Content Calendar That Works',
    status: 'approved',
    date: '2024-12-20T12:15:00Z',
    likes: 3,
    replies: 1,
    flagged: false
  },
  {
    id: '3',
    author: 'Anonymous User',
    email: 'spam@fake.com',
    content: 'Check out my amazing product! Click here for incredible deals and make money fast!!!',
    post: 'Social Media Marketing Tips',
    status: 'spam',
    date: '2024-12-20T11:45:00Z',
    likes: 0,
    replies: 0,
    flagged: true
  },
  {
    id: '4',
    author: 'Mike Chen',
    email: 'mike@example.com',
    content: 'I disagree with some of the points made here. The approach seems too simplistic for complex marketing scenarios.',
    post: 'LinkedIn Content Strategy for B2B',
    status: 'approved',
    date: '2024-12-20T10:20:00Z',
    likes: 1,
    replies: 2,
    flagged: false
  },
  {
    id: '5',
    author: 'Emma Davis',
    email: 'emma@example.com',
    content: 'This is completely wrong and the author clearly doesn\'t know what they\'re talking about. Terrible advice!',
    post: 'Content Analytics Guide',
    status: 'flagged',
    date: '2024-12-20T09:30:00Z',
    likes: 0,
    replies: 0,
    flagged: true
  }
]

export default function CommentsPage() {
  const pendingCount = comments.filter(c => c.status === 'pending').length
  const flaggedCount = comments.filter(c => c.flagged).length
  const spamCount = comments.filter(c => c.status === 'spam').length

  return (
    <PageLayout>
      <PageHero
        title="Comment Moderation"
        description="Review, moderate, and manage user comments across all your content."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{comments.length}</div>
                <div className="text-sm text-muted-foreground">Total Comments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Flag className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{flaggedCount}</div>
                <div className="text-sm text-muted-foreground">Flagged</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{spamCount}</div>
                <div className="text-sm text-muted-foreground">Spam</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search comments..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <select className="px-3 py-2 border rounded-md text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Flagged</option>
                    <option>Spam</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                Review and moderate user comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{comment.author}</span>
                          </div>
                          <Badge variant={
                            comment.status === 'approved' ? 'default' :
                            comment.status === 'pending' ? 'secondary' :
                            comment.status === 'spam' ? 'destructive' : 'outline'
                          }>
                            {comment.status}
                          </Badge>
                          {comment.flagged && (
                            <Badge variant="destructive" className="text-xs">
                              <Flag className="mr-1 h-3 w-3" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          On: <span className="font-medium">{comment.post}</span>
                        </p>
                        
                        <p className="mb-3">{comment.content}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{comment.likes} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{comment.replies} replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Post
                      </Button>
                      
                      {comment.status === 'pending' && (
                        <>
                          <Button size="sm" className="text-green-600 hover:text-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {comment.status === 'approved' && (
                        <Button size="sm" variant="outline" className="text-orange-600 hover:text-orange-700">
                          <Flag className="mr-2 h-4 w-4" />
                          Flag
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Moderation Settings */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>
                Configure automatic moderation rules and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Auto-Approve</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automatically approve comments from trusted users
                  </p>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Spam Detection</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automatically detect and flag potential spam
                  </p>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="text-center">
                  <Flag className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Content Filters</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up keyword filters and content rules
                  </p>
                  <Button variant="outline" size="sm">
                    Configure
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
