import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Filter
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Content Approvals - Admin',
  description: 'Review and approve pending content submissions.',
}

const pendingApprovals = [
  {
    id: '1',
    title: 'AI Content Creation Best Practices',
    author: 'Emma Davis',
    submittedDate: '2024-12-20T10:30:00Z',
    type: 'Blog Post',
    priority: 'high',
    workflow: 'Standard Content Approval',
    currentStep: 'Editorial Review',
    assignedTo: 'Mike Chen',
    excerpt: 'A comprehensive guide to using AI tools effectively for content creation...'
  },
  {
    id: '2',
    title: 'Social Media Trends 2025',
    author: 'David Wilson',
    submittedDate: '2024-12-20T09:15:00Z',
    type: 'Social Post',
    priority: 'medium',
    workflow: 'Quick Social Posts',
    currentStep: 'Quick Review',
    assignedTo: 'Sarah Johnson',
    excerpt: 'Exploring the upcoming trends that will shape social media marketing in 2025...'
  },
  {
    id: '3',
    title: 'Product Launch Campaign',
    author: 'Sarah Johnson',
    submittedDate: '2024-12-19T16:45:00Z',
    type: 'Marketing Campaign',
    priority: 'high',
    workflow: 'Marketing Campaign Review',
    currentStep: 'Legal Review',
    assignedTo: 'Legal Team',
    excerpt: 'Complete marketing campaign for our upcoming product launch including...'
  },
  {
    id: '4',
    title: 'Weekly Newsletter Content',
    author: 'Mike Chen',
    submittedDate: '2024-12-19T14:20:00Z',
    type: 'Newsletter',
    priority: 'medium',
    workflow: 'Standard Content Approval',
    currentStep: 'Final Approval',
    assignedTo: 'Emma Davis',
    excerpt: 'This week\'s newsletter featuring industry insights and platform updates...'
  }
]

const recentApprovals = [
  {
    id: '5',
    title: 'Content Marketing ROI Guide',
    author: 'Emma Davis',
    status: 'approved',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-12-20T08:30:00Z',
    type: 'Blog Post'
  },
  {
    id: '6',
    title: 'Holiday Social Media Posts',
    author: 'David Wilson',
    status: 'rejected',
    rejectedBy: 'Mike Chen',
    rejectedDate: '2024-12-19T18:15:00Z',
    type: 'Social Post',
    reason: 'Needs brand voice adjustment'
  }
]

export default function ApprovalsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Content Approvals"
        description="Review, approve, or request changes for pending content submissions."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Approved Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Rejected Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Need Changes</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>
                    Content submissions waiting for your review
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                            {item.priority} priority
                          </Badge>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Author: {item.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted: {new Date(item.submittedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Step: {item.currentStep}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Assigned: {item.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Request Changes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Activity</CardTitle>
              <CardDescription>
                Recently approved or rejected content submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        item.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {item.status === 'approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {item.author}</span>
                          <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          {item.status === 'approved' ? (
                            <span>Approved by {item.approvedBy}</span>
                          ) : (
                            <span>Rejected by {item.rejectedBy}</span>
                          )}
                        </div>
                        {item.status === 'rejected' && item.reason && (
                          <p className="text-sm text-red-600 mt-1">Reason: {item.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.status === 'approved' ? item.approvedDate! : item.rejectedDate!).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
