import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  CheckCircle, 
  Play,
  Book,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quick Start Guide',
  description: 'Get started with Universal Blog Platform in minutes. Learn the basics and publish your first post.',
}

const steps = [
  {
    step: 1,
    title: 'Create Your Account',
    description: 'Sign up for free and choose your plan',
    time: '2 minutes',
    actions: [
      'Visit the signup page',
      'Choose your preferred authentication method',
      'Select a plan (start with free)',
      'Verify your email address'
    ]
  },
  {
    step: 2,
    title: 'Connect Your Platforms',
    description: 'Link your social media and blog accounts',
    time: '5 minutes',
    actions: [
      'Go to Platform Connections in your dashboard',
      'Click "Add Platform" for each service',
      'Authorize the connections',
      'Test the connections'
    ]
  },
  {
    step: 3,
    title: 'Create Your First Post',
    description: 'Write and publish content across platforms',
    time: '10 minutes',
    actions: [
      'Navigate to the Content Creator',
      'Write your post or use AI assistance',
      'Select target platforms',
      'Preview and publish'
    ]
  },
  {
    step: 4,
    title: 'Monitor Performance',
    description: 'Track engagement and optimize',
    time: '5 minutes',
    actions: [
      'Visit the Analytics dashboard',
      'Review engagement metrics',
      'Identify top-performing content',
      'Plan your next posts'
    ]
  }
]

const quickActions = [
  {
    icon: Play,
    title: 'Video Tutorial',
    description: 'Watch our 10-minute getting started video',
    href: '/docs/videos/getting-started',
    badge: 'Popular'
  },
  {
    icon: Book,
    title: 'Complete Guide',
    description: 'Read the comprehensive setup guide',
    href: '/docs/complete-setup',
    badge: 'Detailed'
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Get help from other users',
    href: '/community',
    badge: 'Support'
  },
  {
    icon: Zap,
    title: 'AI Assistant',
    description: 'Learn about AI-powered features',
    href: '/docs/ai-writing',
    badge: 'AI'
  }
]

export default function QuickStartPage() {
  return (
    <PageLayout>
      <PageHero
        title="Quick Start Guide"
        description="Get up and running with Universal Blog Platform in under 30 minutes. Follow these simple steps to publish your first post."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <Link href={action.href}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <Badge variant="secondary">{action.badge}</Badge>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Step-by-step Guide */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">4 Simple Steps to Get Started</h2>
              <p className="text-xl text-muted-foreground">
                Follow this guide to set up your account and publish your first post
              </p>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-24 bg-border" />
                )}
                
                <div className="flex gap-6">
                  {/* Step number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <Badge variant="outline">{step.time}</Badge>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <Card className="mt-16">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
              <CardDescription className="text-lg">
                You've completed the quick start guide. Here's what to explore next:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Advanced Features</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore AI writing, scheduling, and analytics
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/docs/ai-writing">Learn More</Link>
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Invite team members and set up workflows
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/docs/team-collaboration">Get Started</Link>
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">API Integration</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Build custom integrations with our API
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/api-docs">View API Docs</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team and community are here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/help">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
