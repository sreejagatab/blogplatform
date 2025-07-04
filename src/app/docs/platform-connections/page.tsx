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
  AlertTriangle,
  Settings,
  ArrowRight,
  Globe,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Platform Connections',
  description: 'Learn how to connect and manage your social media and blog platforms with Universal Blog Platform.',
}

const platforms = [
  {
    category: 'Social Media',
    icon: Users,
    platforms: [
      { name: 'Twitter/X', difficulty: 'Easy', time: '2 min' },
      { name: 'LinkedIn', difficulty: 'Easy', time: '3 min' },
      { name: 'Facebook', difficulty: 'Medium', time: '5 min' },
      { name: 'Instagram', difficulty: 'Medium', time: '5 min' },
      { name: 'TikTok', difficulty: 'Medium', time: '7 min' },
      { name: 'YouTube', difficulty: 'Hard', time: '10 min' }
    ]
  },
  {
    category: 'Blog Platforms',
    icon: Globe,
    platforms: [
      { name: 'Medium', difficulty: 'Easy', time: '2 min' },
      { name: 'WordPress', difficulty: 'Medium', time: '8 min' },
      { name: 'Ghost', difficulty: 'Medium', time: '6 min' },
      { name: 'Substack', difficulty: 'Easy', time: '3 min' },
      { name: 'Dev.to', difficulty: 'Easy', time: '2 min' },
      { name: 'Hashnode', difficulty: 'Easy', time: '3 min' }
    ]
  },
  {
    category: 'Professional',
    icon: Zap,
    platforms: [
      { name: 'Slack', difficulty: 'Medium', time: '5 min' },
      { name: 'Discord', difficulty: 'Easy', time: '3 min' },
      { name: 'Telegram', difficulty: 'Easy', time: '2 min' },
      { name: 'Reddit', difficulty: 'Hard', time: '12 min' }
    ]
  }
]

const connectionSteps = [
  {
    step: 1,
    title: 'Navigate to Connections',
    description: 'Go to your dashboard and click on "Platform Connections"'
  },
  {
    step: 2,
    title: 'Choose Platform',
    description: 'Select the platform you want to connect from our list'
  },
  {
    step: 3,
    title: 'Authorize Access',
    description: 'Follow the OAuth flow to grant necessary permissions'
  },
  {
    step: 4,
    title: 'Configure Settings',
    description: 'Set up posting preferences and content formatting'
  },
  {
    step: 5,
    title: 'Test Connection',
    description: 'Send a test post to verify everything works correctly'
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Hard': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function PlatformConnectionsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Platform Connections"
        description="Connect your social media accounts and blog platforms to start distributing content across multiple channels."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle>🔗 Connect Your First Platform</CardTitle>
              <CardDescription>
                Start with an easy connection to see how it works, then add more platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect Twitter/X
                </Button>
                <Button size="lg" variant="outline">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connection Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How to Connect Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {connectionSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Available Platforms */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Available Platforms</h2>
            <div className="space-y-8">
              {platforms.map((category, categoryIndex) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.platforms.map((platform, platformIndex) => (
                        <div key={platformIndex} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            <p className="text-sm text-muted-foreground">Setup time: {platform.time}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getDifficultyColor(platform.difficulty)}>
                              {platform.difficulty}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Connect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Connection Best Practices</CardTitle>
              <CardDescription>
                Tips to ensure smooth platform connections and optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Do's
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Test connections with a draft post first</li>
                    <li>• Review platform-specific formatting</li>
                    <li>• Set up proper posting schedules</li>
                    <li>• Configure audience targeting</li>
                    <li>• Enable analytics tracking</li>
                    <li>• Keep API credentials secure</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Don'ts
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Don't share API keys publicly</li>
                    <li>• Don't ignore platform guidelines</li>
                    <li>• Don't post identical content everywhere</li>
                    <li>• Don't exceed posting limits</li>
                    <li>• Don't forget to monitor connections</li>
                    <li>• Don't ignore error notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                  <h3 className="font-semibold mb-2">Connection Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your internet connection and try again. Ensure you're using the correct credentials.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
                  <h3 className="font-semibold mb-2">Posts Not Publishing</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify platform permissions and check if the platform is experiencing downtime.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-red-400 bg-red-50">
                  <h3 className="font-semibold mb-2">API Limits Exceeded</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce posting frequency or upgrade your platform plan for higher limits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-muted-foreground mb-6">
              Start connecting your platforms and begin distributing content across multiple channels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Settings className="mr-2 h-4 w-4" />
                Manage Connections
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/first-post">
                  Create First Post
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
