import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Workflow, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users,
  FileText,
  Send,
  Eye,
  Settings,
  Zap,
  Target
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Workflow Management - Documentation',
  description: 'Learn how to create and manage content workflows for efficient team collaboration and content approval processes.',
}

const workflowTypes = [
  {
    name: 'Simple Approval',
    description: 'Basic workflow with author creation and editor approval',
    steps: ['Create', 'Review', 'Publish'],
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    useCase: 'Small teams with straightforward content approval needs'
  },
  {
    name: 'Multi-Stage Review',
    description: 'Complex workflow with multiple review stages',
    steps: ['Create', 'Editorial Review', 'Legal Review', 'Final Approval', 'Publish'],
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    useCase: 'Large organizations requiring multiple approvals'
  },
  {
    name: 'Scheduled Publishing',
    description: 'Automated workflow with time-based publishing',
    steps: ['Create', 'Review', 'Schedule', 'Auto-Publish'],
    icon: Clock,
    color: 'bg-purple-100 text-purple-800',
    useCase: 'Content calendars and planned campaigns'
  },
  {
    name: 'Collaborative Creation',
    description: 'Multiple authors working on the same content',
    steps: ['Draft', 'Collaborate', 'Merge', 'Review', 'Publish'],
    icon: FileText,
    color: 'bg-orange-100 text-orange-800',
    useCase: 'Team-authored content and collaborative projects'
  }
]

const workflowSteps = [
  {
    step: 1,
    title: 'Define Your Process',
    description: 'Map out your current content creation and approval process',
    icon: Target,
    actions: [
      'Identify all stakeholders in your content process',
      'Document current approval steps and requirements',
      'Define quality standards and review criteria',
      'Establish timelines for each stage'
    ]
  },
  {
    step: 2,
    title: 'Set Up Workflow Rules',
    description: 'Configure automated rules and triggers in the platform',
    icon: Settings,
    actions: [
      'Create workflow templates for different content types',
      'Set up automatic assignee rules based on content category',
      'Configure notification triggers for each workflow stage',
      'Define escalation rules for overdue reviews'
    ]
  },
  {
    step: 3,
    title: 'Assign Team Roles',
    description: 'Map team members to appropriate workflow roles',
    icon: Users,
    actions: [
      'Assign content creators to author roles',
      'Designate editors and reviewers for each content area',
      'Set up backup reviewers for coverage',
      'Configure approval hierarchies'
    ]
  },
  {
    step: 4,
    title: 'Test and Optimize',
    description: 'Run test workflows and refine based on feedback',
    icon: Zap,
    actions: [
      'Create test content to validate workflow steps',
      'Gather feedback from team members on the process',
      'Identify bottlenecks and optimization opportunities',
      'Adjust rules and assignments based on real usage'
    ]
  }
]

const workflowFeatures = [
  {
    title: 'Automated Assignments',
    description: 'Automatically assign content to reviewers based on category, author, or custom rules',
    icon: Users
  },
  {
    title: 'Deadline Management',
    description: 'Set deadlines for each workflow stage with automatic reminders and escalations',
    icon: Clock
  },
  {
    title: 'Status Tracking',
    description: 'Real-time visibility into content status and workflow progress for all team members',
    icon: Eye
  },
  {
    title: 'Approval History',
    description: 'Complete audit trail of all approvals, rejections, and comments throughout the process',
    icon: FileText
  },
  {
    title: 'Conditional Logic',
    description: 'Create complex workflows with conditional paths based on content type or metadata',
    icon: Workflow
  },
  {
    title: 'Integration Ready',
    description: 'Connect workflows to external tools like Slack, email, or project management systems',
    icon: Send
  }
]

export default function WorkflowsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Workflow Management"
        description="Streamline your content creation process with powerful, customizable workflows that scale with your team."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-6 w-6" />
                Why Use Content Workflows?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Content workflows ensure consistency, quality, and efficiency in your content creation process. 
                By automating approval processes and providing clear visibility into content status, workflows 
                help teams collaborate effectively while maintaining high standards.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all content meets your standards before publication
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Faster Approvals</h3>
                  <p className="text-sm text-muted-foreground">
                    Automate routing and notifications to speed up reviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Full Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Track content status and identify bottlenecks easily
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Types */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Workflow Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowTypes.map((workflow, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${workflow.color}`}>
                        <workflow.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Workflow Steps:</h4>
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
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Best For:</h4>
                        <p className="text-sm text-muted-foreground">{workflow.useCase}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Setup Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Setting Up Workflows</h2>
            <div className="space-y-8">
              {workflowSteps.map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex items-center gap-3">
                        <step.icon className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle>{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Workflow Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Workflow Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <Card className="mb-12 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Workflow Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-green-800">
                <div>
                  <h4 className="font-semibold mb-2">Keep It Simple</h4>
                  <p className="text-sm">
                    Start with simple workflows and add complexity only when needed. Too many steps can slow down the process.
                  </p>
                </div>
                <Separator className="bg-green-200" />
                <div>
                  <h4 className="font-semibold mb-2">Clear Responsibilities</h4>
                  <p className="text-sm">
                    Ensure each workflow step has a clear owner and defined expectations for completion.
                  </p>
                </div>
                <Separator className="bg-green-200" />
                <div>
                  <h4 className="font-semibold mb-2">Regular Reviews</h4>
                  <p className="text-sm">
                    Periodically review workflow performance and gather team feedback to identify improvements.
                  </p>
                </div>
                <Separator className="bg-green-200" />
                <div>
                  <h4 className="font-semibold mb-2">Backup Plans</h4>
                  <p className="text-sm">
                    Always have backup reviewers assigned to prevent bottlenecks when team members are unavailable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Create Your First Workflow</h2>
            <p className="text-muted-foreground mb-6">
              Set up automated workflows to streamline your content creation and approval process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/workflows">
                  <Workflow className="mr-2 h-4 w-4" />
                  Manage Workflows
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/approvals">
                  Learn About Approvals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
