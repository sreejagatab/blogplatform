import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Target, 
  Settings,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Multi-Platform Publishing Guide',
  description: 'Learn how to effectively publish content across multiple platforms with Universal Blog Platform.',
}

const publishingMethods = [
  {
    icon: Send,
    title: 'Instant Publishing',
    description: 'Publish immediately to all selected platforms',
    bestFor: 'Breaking news, time-sensitive content',
    steps: ['Create content', 'Select platforms', 'Review previews', 'Click publish']
  },
  {
    icon: Clock,
    title: 'Scheduled Publishing',
    description: 'Schedule content for optimal posting times',
    bestFor: 'Regular content, global audiences',
    steps: ['Create content', 'Set publish time', 'Select platforms', 'Schedule post']
  },
  {
    icon: Target,
    title: 'Targeted Publishing',
    description: 'Customize content for specific platforms',
    bestFor: 'Platform-specific messaging',
    steps: ['Create base content', 'Customize per platform', 'Set targeting', 'Publish']
  }
]

const platformTips = [
  {
    platform: 'Twitter/X',
    tips: ['Keep under 280 characters', 'Use relevant hashtags', 'Include engaging visuals', 'Post during peak hours']
  },
  {
    platform: 'LinkedIn',
    tips: ['Professional tone', 'Longer-form content works', 'Industry hashtags', 'Engage with comments']
  },
  {
    platform: 'Instagram',
    tips: ['High-quality visuals', 'Story-driven captions', 'Use Instagram hashtags', 'Post consistently']
  },
  {
    platform: 'Facebook',
    tips: ['Engaging headlines', 'Mix content types', 'Encourage discussions', 'Use Facebook groups']
  }
]

export default function PublishingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Multi-Platform Publishing"
        description="Master the art of publishing content across multiple platforms effectively and efficiently."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Publishing Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Publishing Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publishingMethods.map((method, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-3">Best for: {method.bestFor}</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Steps:</h4>
                    <ol className="space-y-1">
                      {method.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm">
                          <span className="font-bold text-primary">{stepIndex + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform-Specific Tips */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Platform-Specific Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformTips.map((platform, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{platform.platform}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {platform.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Publishing Workflow */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Complete Publishing Workflow</CardTitle>
              <CardDescription>
                Follow this comprehensive workflow for successful multi-platform publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Plan Content</h3>
                  <p className="text-sm text-muted-foreground">Research topics, plan messaging, and set objectives</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Create & Optimize</h3>
                  <p className="text-sm text-muted-foreground">Write content, add visuals, and optimize for SEO</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Customize & Schedule</h3>
                  <p className="text-sm text-muted-foreground">Adapt for each platform and schedule optimally</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Monitor & Engage</h3>
                  <p className="text-sm text-muted-foreground">Track performance and engage with audience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Publishing Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Test content on different devices</li>
                    <li>• Use platform-specific hashtags</li>
                    <li>• Post at optimal times for each platform</li>
                    <li>• Engage with comments and responses</li>
                    <li>• Monitor performance metrics</li>
                    <li>• Maintain consistent brand voice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Post identical content everywhere</li>
                    <li>• Ignore platform guidelines</li>
                    <li>• Over-post or spam followers</li>
                    <li>• Forget to proofread content</li>
                    <li>• Ignore audience feedback</li>
                    <li>• Neglect visual quality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Publish?</h2>
            <p className="text-muted-foreground mb-6">
              Start creating and publishing content across multiple platforms today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Send className="mr-2 h-4 w-4" />
                Start Publishing
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/scheduling">
                  Learn About Scheduling
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
