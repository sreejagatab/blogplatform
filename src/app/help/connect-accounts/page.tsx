import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Link as LinkIcon, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Play,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Connect Your Social Media Accounts',
  description: 'Step-by-step guide to connecting your social media accounts to Universal Blog Platform.',
}

const quickSteps = [
  'Go to Dashboard → Platform Connections',
  'Click "Add Platform" button',
  'Select your desired platform',
  'Follow the authorization process',
  'Configure your posting preferences'
]

const platformGuides = [
  {
    name: 'Twitter/X',
    difficulty: 'Easy',
    time: '2 minutes',
    steps: [
      'Click "Connect Twitter/X" button',
      'Sign in to your Twitter account',
      'Authorize Universal Blog Platform',
      'Choose posting preferences',
      'Test with a sample post'
    ],
    tips: [
      'Ensure your Twitter account is verified',
      'Check character limits for posts',
      'Enable thread posting for longer content'
    ]
  },
  {
    name: 'LinkedIn',
    difficulty: 'Easy',
    time: '3 minutes',
    steps: [
      'Click "Connect LinkedIn" button',
      'Sign in to your LinkedIn account',
      'Grant publishing permissions',
      'Select personal or company page',
      'Configure audience settings'
    ],
    tips: [
      'Choose between personal profile and company page',
      'Professional tone works best on LinkedIn',
      'Use LinkedIn-specific hashtags'
    ]
  },
  {
    name: 'Instagram',
    difficulty: 'Medium',
    time: '5 minutes',
    steps: [
      'Ensure you have a Business or Creator account',
      'Connect via Facebook Business Manager',
      'Authorize Instagram publishing',
      'Set up image formatting preferences',
      'Test with a photo post'
    ],
    tips: [
      'Business account required for API access',
      'Images are automatically optimized',
      'Stories and Reels supported'
    ]
  }
]

export default function ConnectAccountsPage() {
  return (
    <PageLayout>
      <PageHero
        title="How to Connect Your Social Media Accounts"
        description="Follow this comprehensive guide to connect your social media accounts and start cross-posting content."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Overview */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Quick Start</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                Connecting your accounts takes just a few minutes. Here's the basic process:
              </p>
              <ol className="space-y-2">
                {quickSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <span className="font-bold text-blue-600">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Platform-Specific Guides */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Platform-Specific Guides</h2>
            <div className="space-y-8">
              {platformGuides.map((platform, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{platform.difficulty}</Badge>
                        <Badge variant="secondary">{platform.time}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Step-by-Step Process</h3>
                        <ol className="space-y-2">
                          {platform.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <span className="font-bold text-primary">{stepIndex + 1}.</span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Pro Tips</h3>
                        <ul className="space-y-2">
                          {platform.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{tip}</span>
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

          {/* Common Issues */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
              <CardDescription>
                Troubleshoot the most frequent connection problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    "Authorization Failed" Error
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This usually happens when popup blockers are enabled or cookies are disabled.
                  </p>
                  <p className="text-sm font-medium">Solution:</p>
                  <ul className="text-sm text-muted-foreground ml-4 list-disc">
                    <li>Disable popup blockers for our site</li>
                    <li>Enable third-party cookies</li>
                    <li>Try using an incognito/private window</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-400 pl-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    "Account Not Eligible" Message
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Some platforms require specific account types for API access.
                  </p>
                  <p className="text-sm font-medium">Solution:</p>
                  <ul className="text-sm text-muted-foreground ml-4 list-disc">
                    <li>Convert to Business account (Instagram)</li>
                    <li>Verify your account (Twitter)</li>
                    <li>Check platform-specific requirements</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Connection Keeps Disconnecting
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This can happen due to expired tokens or changed passwords.
                  </p>
                  <p className="text-sm font-medium">Solution:</p>
                  <ul className="text-sm text-muted-foreground ml-4 list-disc">
                    <li>Reconnect your account</li>
                    <li>Check if you changed your password recently</li>
                    <li>Ensure app permissions are still granted</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Tutorial */}
          <Card className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Video Tutorial
              </CardTitle>
              <CardDescription>
                Watch our step-by-step video guide for connecting accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <p className="text-muted-foreground">How to Connect Social Media Accounts</p>
                  <p className="text-sm text-muted-foreground">Duration: 8:30</p>
                </div>
              </div>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Watch Tutorial
              </Button>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get connected successfully.
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
