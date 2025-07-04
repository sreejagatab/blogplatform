import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Calendar, 
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Scheduling Posts Help',
  description: 'Learn how to schedule your posts effectively across multiple platforms.',
}

const schedulingSteps = [
  {
    step: 1,
    title: 'Create Your Content',
    description: 'Write your post and add any media or formatting'
  },
  {
    step: 2,
    title: 'Select Platforms',
    description: 'Choose which platforms to publish to'
  },
  {
    step: 3,
    title: 'Set Date & Time',
    description: 'Pick when you want your content to go live'
  },
  {
    step: 4,
    title: 'Review & Schedule',
    description: 'Double-check everything and confirm scheduling'
  }
]

const commonIssues = [
  {
    problem: 'Posts not publishing at scheduled time',
    causes: ['Timezone confusion', 'Platform API issues', 'Account disconnected'],
    solutions: [
      'Check your timezone settings',
      'Verify platform connections',
      'Try rescheduling the post',
      'Contact support if issue persists'
    ]
  },
  {
    problem: 'Cannot schedule posts for certain platforms',
    causes: ['Platform limitations', 'Account permissions', 'API restrictions'],
    solutions: [
      'Check platform-specific scheduling limits',
      'Verify account permissions',
      'Try scheduling closer to current time',
      'Use manual posting if needed'
    ]
  }
]

export default function SchedulingHelpPage() {
  return (
    <PageLayout>
      <PageHero
        title="Scheduling Posts Help"
        description="Get help with scheduling your content across multiple platforms effectively."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Guide */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Quick Scheduling Guide</CardTitle>
              <CardDescription className="text-blue-700">
                Follow these steps to schedule your posts successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {schedulingSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-2">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-blue-700">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Scheduling Limits */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Platform Scheduling Limits</CardTitle>
              <CardDescription>
                Understanding each platform's scheduling restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Twitter/X</h3>
                    <p className="text-sm text-muted-foreground">Can schedule up to 1 year in advance</p>
                  </div>
                  <Badge variant="outline">No limit</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">LinkedIn</h3>
                    <p className="text-sm text-muted-foreground">Can schedule up to 3 months in advance</p>
                  </div>
                  <Badge variant="outline">3 months</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Instagram</h3>
                    <p className="text-sm text-muted-foreground">Can schedule up to 75 days in advance</p>
                  </div>
                  <Badge variant="outline">75 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Facebook</h3>
                    <p className="text-sm text-muted-foreground">Can schedule up to 6 months in advance</p>
                  </div>
                  <Badge variant="outline">6 months</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Common Scheduling Issues</h2>
            <div className="space-y-6">
              {commonIssues.map((issue, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      {issue.problem}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">Possible Causes:</h4>
                        <ul className="space-y-1">
                          {issue.causes.map((cause, causeIndex) => (
                            <li key={causeIndex} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0 mt-1" />
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600">Solutions:</h4>
                        <ul className="space-y-1">
                          {issue.solutions.map((solution, solutionIndex) => (
                            <li key={solutionIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-1" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Scheduling Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Schedule during your audience's active hours
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Double-check timezone settings
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Test with a few posts first
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Monitor scheduled posts regularly
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Schedule too far in advance
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Ignore platform-specific limits
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Forget to engage after posting
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Schedule during platform downtime
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Having Issues?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you with any scheduling problems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/scheduling">
                  Read Full Scheduling Guide
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
