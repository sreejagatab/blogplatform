import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workflows - Admin',
  description: 'Manage content approval workflows and automation rules.',
}

const workflows = [
  {
    id: '1',
    name: 'Standard Content Approval',
    description: 'Basic approval workflow for regular content',
    status: 'active',
    steps: ['Create', 'Review', 'Approve', 'Publish'],
    assignees: ['Sarah J.', 'Mike C.'],
    avgTime: '2.5 hours',
    completedTasks: 45,
    pendingTasks: 3
  },
  {
    id: '2',
    name: 'Marketing Campaign Review',
    description: 'Multi-stage review for marketing campaigns',
    status: 'active',
    steps: ['Create', 'Content Review', 'Legal Review', 'Final Approval', 'Publish'],
    assignees: ['Emma D.', 'David W.', 'Legal Team'],
    avgTime: '4.2 hours',
    completedTasks: 12,
    pendingTasks: 2
  },
  {
    id: '3',
    name: 'Quick Social Posts',
    description: 'Fast-track approval for social media posts',
    status: 'active',
    steps: ['Create', 'Quick Review', 'Publish'],
    assignees: ['Sarah J.'],
    avgTime: '30 minutes',
    completedTasks: 89,
    pendingTasks: 5
  },
  {
    id: '4',
    name: 'Blog Post Workflow',
    description: 'Comprehensive review process for blog content',
    status: 'paused',
    steps: ['Draft', 'Editorial Review', 'SEO Review', 'Final Edit', 'Publish'],
    assignees: ['Mike C.', 'SEO Team'],
    avgTime: '6.1 hours',
    completedTasks: 23,
    pendingTasks: 0
  }
]

export default function WorkflowsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Content Workflows"
        description="Manage approval workflows, automation rules, and content review processes."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Workflow className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{workflows.length}</div>
                <div className="text-sm text-muted-foreground">Total Workflows</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{workflows.filter(w => w.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Active Workflows</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.completedTasks, 0)}</div>
                <div className="text-sm text-muted-foreground">Completed Tasks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.pendingTasks, 0)}</div>
                <div className="text-sm text-muted-foreground">Pending Tasks</div>
              </CardContent>
            </Card>
          </div>

          {/* Create New Workflow */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Workflow
              </CardTitle>
              <CardDescription>
                Set up a new content approval workflow for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
                <Button variant="outline">
                  Use Template
                </Button>
                <Button variant="outline">
                  Import Workflow
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Your Workflows</CardTitle>
              <CardDescription>
                Manage your existing content approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                            {workflow.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{workflow.description}</p>
                        
                        {/* Workflow Steps */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Workflow Steps:</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {workflow.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {step}
                                </Badge>
                                {stepIndex < workflow.steps.length - 1 && (
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assignees */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Assignees:</h4>
                          <div className="flex gap-2">
                            {workflow.assignees.map((assignee, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Users className="mr-1 h-3 w-3" />
                                {assignee}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Avg time: {workflow.avgTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Completed: {workflow.completedTasks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>Pending: {workflow.pendingTasks}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {workflow.status === 'active' ? (
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

          {/* Workflow Templates */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built workflow templates to get you started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Simple Approval</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basic two-step approval process
                  </p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Team Review</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Multi-reviewer approval workflow
                  </p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Scheduled Publishing</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Time-based automated workflow
                  </p>
                  <Button variant="outline" size="sm">
                    Use Template
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
