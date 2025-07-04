import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  Users,
  FileText,
  AlertCircle,
  ThumbsUp,
  Eye,
  Edit
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Approval Process - Documentation',
  description: 'Learn how to set up and manage content approval processes to ensure quality and compliance.',
}

const approvalStates = [
  {
    state: 'Draft',
    description: 'Content is being created or edited by the author',
    icon: Edit,
    color: 'bg-gray-100 text-gray-800',
    actions: ['Continue editing', 'Submit for review', 'Save as draft']
  },
  {
    state: 'Pending Review',
    description: 'Content has been submitted and is waiting for reviewer assignment',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    actions: ['Auto-assign reviewer', 'Manual assignment', 'Return to draft']
  },
  {
    state: 'Under Review',
    description: 'Content is actively being reviewed by assigned team members',
    icon: Eye,
    color: 'bg-blue-100 text-blue-800',
    actions: ['Add comments', 'Request changes', 'Approve', 'Reject']
  },
  {
    state: 'Changes Requested',
    description: 'Reviewer has requested modifications before approval',
    icon: MessageSquare,
    color: 'bg-orange-100 text-orange-800',
    actions: ['Make changes', 'Respond to feedback', 'Resubmit for review']
  },
  {
    state: 'Approved',
    description: 'Content has been approved and is ready for publishing',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    actions: ['Publish immediately', 'Schedule for later', 'Make final edits']
  },
  {
    state: 'Rejected',
    description: 'Content has been rejected and needs significant revision',
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    actions: ['Review feedback', 'Start over', 'Request clarification']
  }
]

const approvalTypes = [
  {
    name: 'Single Reviewer',
    description: 'One designated reviewer approves or rejects content',
    icon: Users,
    pros: ['Fast approval process', 'Clear responsibility', 'Simple workflow'],
    cons: ['Single point of failure', 'Potential bias', 'Limited perspective'],
    bestFor: 'Small teams with trusted reviewers'
  },
  {
    name: 'Multiple Reviewers',
    description: 'Several reviewers must approve before content is published',
    icon: Users,
    pros: ['Comprehensive review', 'Reduced bias', 'Higher quality'],
    cons: ['Slower process', 'Potential conflicts', 'Coordination needed'],
    bestFor: 'Large teams or high-stakes content'
  },
  {
    name: 'Hierarchical Approval',
    description: 'Content moves through approval levels based on seniority',
    icon: Users,
    pros: ['Clear chain of command', 'Escalation path', 'Authority alignment'],
    cons: ['Can be slow', 'Bottlenecks possible', 'Less flexibility'],
    bestFor: 'Organizations with strict approval hierarchies'
  },
  {
    name: 'Conditional Approval',
    description: 'Approval requirements change based on content type or risk',
    icon: Users,
    pros: ['Flexible process', 'Efficient routing', 'Risk-appropriate'],
    cons: ['Complex setup', 'Rule management', 'Potential confusion'],
    bestFor: 'Organizations with diverse content types'
  }
]

const bestPractices = [
  {
    title: 'Clear Approval Criteria',
    description: 'Define specific standards and requirements for content approval',
    tips: [
      'Create detailed style guides and quality standards',
      'Provide examples of approved and rejected content',
      'Document brand voice and messaging guidelines',
      'Establish technical and legal compliance requirements'
    ]
  },
  {
    title: 'Timely Reviews',
    description: 'Set and maintain reasonable turnaround times for approvals',
    tips: [
      'Set clear SLAs for each approval stage',
      'Send automatic reminders for overdue reviews',
      'Provide escalation paths for urgent content',
      'Track and report on approval turnaround times'
    ]
  },
  {
    title: 'Constructive Feedback',
    description: 'Provide actionable, specific feedback to improve content quality',
    tips: [
      'Use comment threads for specific line-by-line feedback',
      'Explain the reasoning behind requested changes',
      'Suggest specific improvements rather than just pointing out issues',
      'Acknowledge good work alongside areas for improvement'
    ]
  },
  {
    title: 'Process Documentation',
    description: 'Maintain clear documentation of approval processes and procedures',
    tips: [
      'Document approval workflows for different content types',
      'Maintain up-to-date reviewer assignments and responsibilities',
      'Create troubleshooting guides for common approval issues',
      'Regularly review and update approval processes'
    ]
  }
]

export default function ApprovalsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Approval Process"
        description="Implement effective content approval workflows to maintain quality, consistency, and compliance across your content."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-6 w-6" />
                Why Use Content Approvals?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Content approval processes ensure that all published content meets your organization's 
                quality standards, brand guidelines, and compliance requirements. A well-designed approval 
                workflow balances quality control with publishing efficiency.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Assurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all content meets your standards before publication
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Foster collaboration and knowledge sharing through reviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Risk Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevent publication of non-compliant or problematic content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval States */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Approval States</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvalStates.map((state, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${state.color}`}>
                        <state.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{state.state}</CardTitle>
                        <CardDescription>{state.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-2">Available Actions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {state.actions.map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Approval Types */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Approval Types</h2>
            <div className="space-y-6">
              {approvalTypes.map((type, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <type.icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">{type.name}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Pros:</h4>
                        <ul className="space-y-1">
                          {type.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="text-sm text-green-600">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-red-700">Cons:</h4>
                        <ul className="space-y-1">
                          {type.cons.map((con, conIndex) => (
                            <li key={conIndex} className="text-sm text-red-600">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Best For:</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          {type.bestFor}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Approval Best Practices</h2>
            <div className="space-y-6">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{practice.title}</CardTitle>
                    <CardDescription>{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Approval Features */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Platform Approval Features
              </CardTitle>
              <CardDescription>
                Built-in tools to streamline your content approval process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Review Tools</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Inline commenting and suggestions</li>
                    <li>• Version comparison and tracking</li>
                    <li>• Collaborative editing capabilities</li>
                    <li>• Visual content preview and markup</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Workflow Management</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Automated reviewer assignment</li>
                    <li>• Deadline tracking and reminders</li>
                    <li>• Escalation rules and notifications</li>
                    <li>• Approval history and audit trails</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Communication</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time notifications and alerts</li>
                    <li>• Email and Slack integration</li>
                    <li>• Comment threads and discussions</li>
                    <li>• Status updates and progress tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Analytics & Reporting</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Approval turnaround time metrics</li>
                    <li>• Reviewer performance analytics</li>
                    <li>• Bottleneck identification reports</li>
                    <li>• Quality improvement insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Challenges */}
          <Card className="mb-12 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertCircle className="h-5 w-5" />
                Common Approval Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-orange-800">
                <div>
                  <h4 className="font-semibold mb-2">Approval Bottlenecks</h4>
                  <p className="text-sm">
                    Solution: Set up backup reviewers and escalation rules to prevent delays when primary reviewers are unavailable.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Inconsistent Standards</h4>
                  <p className="text-sm">
                    Solution: Create detailed approval criteria and provide reviewer training to ensure consistent evaluation.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Lengthy Review Cycles</h4>
                  <p className="text-sm">
                    Solution: Implement time limits, automated reminders, and streamlined feedback processes to speed up reviews.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Set Up Content Approvals</h2>
            <p className="text-muted-foreground mb-6">
              Configure approval workflows to ensure quality and consistency in your content publishing process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/approvals">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Manage Approvals
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/workflows">
                  Learn About Workflows
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
