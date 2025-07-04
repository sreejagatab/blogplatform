import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  MessageCircle,
  ArrowRight,
  Search,
  Settings,
  Wifi
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Troubleshooting Guide',
  description: 'Solve common issues with Universal Blog Platform quickly and easily.',
}

const commonIssues = [
  {
    category: 'Publishing Issues',
    icon: AlertTriangle,
    issues: [
      {
        problem: 'Posts not publishing to platforms',
        causes: ['Expired platform authorization', 'Platform API limits', 'Network connectivity'],
        solutions: [
          'Reconnect your platform accounts',
          'Check platform status pages',
          'Verify your internet connection',
          'Try publishing again in a few minutes'
        ]
      },
      {
        problem: 'Content formatting issues',
        causes: ['Platform character limits', 'Unsupported media formats', 'HTML formatting'],
        solutions: [
          'Check platform-specific character limits',
          'Convert media to supported formats',
          'Use platform-specific formatting',
          'Preview content before publishing'
        ]
      }
    ]
  },
  {
    category: 'Account & Login',
    icon: Settings,
    issues: [
      {
        problem: 'Cannot log in to account',
        causes: ['Incorrect credentials', 'Account locked', 'Browser issues'],
        solutions: [
          'Reset your password',
          'Clear browser cache and cookies',
          'Try a different browser',
          'Contact support if account is locked'
        ]
      },
      {
        problem: 'Two-factor authentication problems',
        causes: ['Time sync issues', 'Lost authenticator device', 'Backup codes used'],
        solutions: [
          'Check device time settings',
          'Use backup authentication codes',
          'Contact support for account recovery',
          'Set up new authenticator device'
        ]
      }
    ]
  },
  {
    category: 'Platform Connections',
    icon: Wifi,
    issues: [
      {
        problem: 'Platform authorization failing',
        causes: ['Popup blockers', 'Third-party cookies disabled', 'Platform maintenance'],
        solutions: [
          'Disable popup blockers for our site',
          'Enable third-party cookies',
          'Try incognito/private browsing mode',
          'Check platform status pages'
        ]
      },
      {
        problem: 'Connection keeps disconnecting',
        causes: ['Password changes', 'Platform security updates', 'Token expiration'],
        solutions: [
          'Reconnect your account',
          'Update platform permissions',
          'Check for platform security notifications',
          'Contact platform support if needed'
        ]
      }
    ]
  }
]

const quickFixes = [
  {
    icon: RefreshCw,
    title: 'Refresh & Retry',
    description: 'Many issues resolve with a simple refresh',
    steps: ['Refresh the page', 'Clear browser cache', 'Try again']
  },
  {
    icon: Wifi,
    title: 'Check Connections',
    description: 'Verify your platform connections are active',
    steps: ['Go to Platform Connections', 'Test each connection', 'Reconnect if needed']
  },
  {
    icon: Settings,
    title: 'Update Settings',
    description: 'Ensure your account settings are current',
    steps: ['Review account settings', 'Update preferences', 'Save changes']
  }
]

export default function TroubleshootingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Troubleshooting Guide"
        description="Quick solutions to common issues. Get back to creating content faster."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Search */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search for Solutions
              </CardTitle>
              <CardDescription>
                Describe your issue to find relevant solutions quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="e.g., 'posts not publishing to Twitter'"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Fixes */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Fixes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickFixes.map((fix, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <fix.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{fix.title}</CardTitle>
                    <CardDescription>{fix.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm space-y-1">
                      {fix.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Common Issues & Solutions</h2>
            <div className="space-y-8">
              {commonIssues.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {category.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-3">{issue.problem}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2 text-red-600">Common Causes:</h4>
                              <ul className="space-y-1">
                                {issue.causes.map((cause, causeIndex) => (
                                  <li key={causeIndex} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0 mt-1" />
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* System Status */}
          <Card className="mb-16 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Check System Status</CardTitle>
              <CardDescription className="text-blue-700">
                Before troubleshooting, check if there are any known issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                  <Link href="/status">
                    View System Status
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline">
                  Check Platform Status Pages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* When to Contact Support */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>When to Contact Support</CardTitle>
              <CardDescription>
                If these solutions don't help, our support team is here for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Contact Support If:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Issue persists after trying solutions</li>
                    <li>• You're experiencing data loss</li>
                    <li>• Account security concerns</li>
                    <li>• Billing or subscription issues</li>
                    <li>• Feature requests or feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Before Contacting Support:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Try the solutions in this guide</li>
                    <li>• Check system status page</li>
                    <li>• Note error messages exactly</li>
                    <li>• Document steps to reproduce issue</li>
                    <li>• Have your account details ready</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is ready to help you resolve any issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">
                  Ask Community
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
