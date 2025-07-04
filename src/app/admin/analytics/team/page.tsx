import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Clock,
  Target,
  Award,
  ArrowLeft,
  Download,
  Filter
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Team Analytics - Admin',
  description: 'Monitor team performance, productivity, and collaboration metrics.',
}

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Admin',
    postsCreated: 32,
    avgEngagement: 4.2,
    collaborationScore: 95,
    productivity: 'High'
  },
  {
    name: 'Mike Chen',
    role: 'Editor',
    postsCreated: 28,
    avgEngagement: 3.8,
    collaborationScore: 88,
    productivity: 'High'
  },
  {
    name: 'Emma Davis',
    role: 'Author',
    postsCreated: 15,
    avgEngagement: 3.5,
    collaborationScore: 82,
    productivity: 'Medium'
  },
  {
    name: 'David Wilson',
    role: 'Viewer',
    postsCreated: 0,
    avgEngagement: 0,
    collaborationScore: 45,
    productivity: 'Low'
  }
]

export default function TeamAnalyticsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Team Analytics"
        description="Monitor team performance, productivity, and collaboration metrics to optimize your content strategy."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/admin/analytics">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Analytics
              </Link>
            </Button>
          </div>

          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">75</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">3.8</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">82%</div>
                <div className="text-sm text-muted-foreground">Team Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Team Performance Chart */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Performance Overview</CardTitle>
                  <CardDescription>
                    Content creation and engagement metrics over time
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Team Performance Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Individual Team Member Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
              <CardDescription>
                Detailed metrics for each team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      </div>
                      <Badge variant={
                        member.productivity === 'High' ? 'default' :
                        member.productivity === 'Medium' ? 'secondary' : 'destructive'
                      }>
                        {member.productivity} Productivity
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Posts Created</span>
                          <span className="text-sm text-muted-foreground">{member.postsCreated}</span>
                        </div>
                        <Progress value={(member.postsCreated / 35) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Avg Engagement</span>
                          <span className="text-sm text-muted-foreground">{member.avgEngagement}/5</span>
                        </div>
                        <Progress value={(member.avgEngagement / 5) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Collaboration Score</span>
                          <span className="text-sm text-muted-foreground">{member.collaborationScore}%</span>
                        </div>
                        <Progress value={member.collaborationScore} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Collaboration Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaboration Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cross-team Projects</span>
                      <span className="text-sm text-muted-foreground">8 this month</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Review Participation</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Knowledge Sharing</span>
                      <span className="text-sm text-muted-foreground">15 sessions</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Workflow Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Avg Review Time</span>
                      <span className="text-sm text-muted-foreground">2.3 hours</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Approval Rate</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">On-time Delivery</span>
                      <span className="text-sm text-muted-foreground">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Team Goals & Targets
              </CardTitle>
              <CardDescription>
                Track progress toward team objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Monthly Targets</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Content Creation</span>
                        <span className="text-sm text-muted-foreground">75/100 posts</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Engagement Rate</span>
                        <span className="text-sm text-muted-foreground">3.8/4.0</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quarterly Goals</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Team Growth</span>
                        <span className="text-sm text-muted-foreground">5/8 members</span>
                      </div>
                      <Progress value={62.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Process Optimization</span>
                        <span className="text-sm text-muted-foreground">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
