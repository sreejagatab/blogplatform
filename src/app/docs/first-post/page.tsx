import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Target, 
  Send, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Your First Post',
  description: 'Step-by-step guide to creating and publishing your first post on Universal Blog Platform.',
}

const postSteps = [
  {
    icon: Edit,
    title: 'Write Your Content',
    description: 'Create engaging content using our editor and AI tools',
    details: [
      'Choose a compelling topic',
      'Use the AI writing assistant for ideas',
      'Add images and media',
      'Format your content properly'
    ]
  },
  {
    icon: Target,
    title: 'Select Platforms',
    description: 'Choose where to publish your content',
    details: [
      'Select connected platforms',
      'Customize for each platform',
      'Preview how it will look',
      'Set platform-specific settings'
    ]
  },
  {
    icon: Send,
    title: 'Publish or Schedule',
    description: 'Share your content with the world',
    details: [
      'Publish immediately',
      'Schedule for later',
      'Set up recurring posts',
      'Review before publishing'
    ]
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description: 'Monitor how your content performs',
    details: [
      'View engagement metrics',
      'Track reach and impressions',
      'Analyze audience response',
      'Optimize future content'
    ]
  }
]

const tips = [
  {
    icon: Lightbulb,
    title: 'Content Tips',
    tips: [
      'Start with a hook to grab attention',
      'Use clear, concise language',
      'Include relevant hashtags',
      'Add a call-to-action'
    ]
  },
  {
    icon: Zap,
    title: 'Platform Tips',
    tips: [
      'Tailor content for each platform',
      'Use optimal posting times',
      'Engage with your audience',
      'Monitor comments and replies'
    ]
  }
]

export default function FirstPostPage() {
  return (
    <PageLayout>
      <PageHero
        title="Create Your First Post"
        description="Learn how to create, customize, and publish your first piece of content across multiple platforms."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>🚀 Ready to Create?</CardTitle>
              <CardDescription>
                Jump straight into creating your first post, or follow the detailed guide below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg">
                <Edit className="mr-2 h-4 w-4" />
                Start Creating Now
              </Button>
            </CardContent>
          </Card>

          {/* Step-by-step Guide */}
          <div className="space-y-8 mb-16">
            <h2 className="text-3xl font-bold text-center">Step-by-Step Guide</h2>
            
            {postSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < postSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-24 bg-border" />
                )}
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <step.icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{detail}</span>
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

          {/* Pro Tips */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tips.map((tipGroup, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tipGroup.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{tipGroup.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tipGroup.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Need Content Ideas?</CardTitle>
              <CardDescription>
                Here are some popular post types to get you started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">📝 How-to Guide</h3>
                  <p className="text-sm text-muted-foreground">Share your expertise with step-by-step tutorials</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">💡 Industry Insights</h3>
                  <p className="text-sm text-muted-foreground">Share trends and observations from your field</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🎯 Personal Story</h3>
                  <p className="text-sm text-muted-foreground">Connect with your audience through experiences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <p className="text-muted-foreground mb-6">
              After publishing your first post, explore these advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/ai-writing">
                  AI Writing Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/analytics">View Analytics Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
