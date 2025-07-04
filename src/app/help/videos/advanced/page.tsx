import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Zap,
  Settings,
  BarChart3,
  Code,
  Target,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Advanced Features Video Tutorials - Universal Blog Platform',
  description: 'Master advanced features with in-depth video tutorials. Analytics, automation, API integration, and power user techniques.',
}

const advancedSeries = [
  {
    title: 'Analytics & Performance',
    description: 'Master data-driven content optimization',
    icon: BarChart3,
    color: 'bg-blue-500',
    videos: [
      {
        title: 'Advanced Analytics Dashboard',
        description: 'Deep dive into analytics features and custom reports',
        duration: '18:45',
        views: '12.3k',
        complexity: 'Expert',
        thumbnail: '/videos/advanced-analytics.jpg'
      },
      {
        title: 'Performance Optimization Strategies',
        description: 'Use data to optimize content performance across platforms',
        duration: '22:15',
        views: '9.8k',
        complexity: 'Expert',
        thumbnail: '/videos/performance-optimization.jpg'
      },
      {
        title: 'Custom Metrics & KPIs',
        description: 'Set up custom tracking for your specific goals',
        duration: '16:30',
        views: '7.2k',
        complexity: 'Advanced',
        thumbnail: '/videos/custom-metrics.jpg'
      }
    ]
  },
  {
    title: 'Automation & Workflows',
    description: 'Automate your content processes for maximum efficiency',
    icon: Zap,
    color: 'bg-purple-500',
    videos: [
      {
        title: 'Advanced Scheduling Strategies',
        description: 'Master complex scheduling and automation rules',
        duration: '20:10',
        views: '11.5k',
        complexity: 'Advanced',
        thumbnail: '/videos/advanced-scheduling.jpg'
      },
      {
        title: 'Workflow Automation Setup',
        description: 'Create custom workflows for your content pipeline',
        duration: '25:40',
        views: '8.9k',
        complexity: 'Expert',
        thumbnail: '/videos/workflow-automation.jpg'
      },
      {
        title: 'Conditional Publishing Rules',
        description: 'Set up smart publishing based on performance metrics',
        duration: '14:20',
        views: '6.7k',
        complexity: 'Advanced',
        thumbnail: '/videos/conditional-publishing.jpg'
      }
    ]
  },
  {
    title: 'API & Integrations',
    description: 'Extend functionality with custom integrations',
    icon: Code,
    color: 'bg-green-500',
    videos: [
      {
        title: 'API Integration Masterclass',
        description: 'Complete guide to using our API for custom solutions',
        duration: '35:25',
        views: '5.4k',
        complexity: 'Expert',
        thumbnail: '/videos/api-masterclass.jpg'
      },
      {
        title: 'Webhook Configuration',
        description: 'Set up webhooks for real-time data synchronization',
        duration: '19:50',
        views: '4.8k',
        complexity: 'Advanced',
        thumbnail: '/videos/webhook-config.jpg'
      },
      {
        title: 'Custom Platform Integrations',
        description: 'Build integrations with platforms not natively supported',
        duration: '28:15',
        views: '3.9k',
        complexity: 'Expert',
        thumbnail: '/videos/custom-integrations.jpg'
      }
    ]
  },
  {
    title: 'Enterprise Features',
    description: 'Advanced features for teams and organizations',
    icon: Settings,
    color: 'bg-orange-500',
    videos: [
      {
        title: 'Team Management & Permissions',
        description: 'Advanced team setup and role-based access control',
        duration: '21:35',
        views: '8.1k',
        complexity: 'Advanced',
        thumbnail: '/videos/team-management.jpg'
      },
      {
        title: 'Multi-Brand Content Strategy',
        description: 'Manage multiple brands and content strategies',
        duration: '24:10',
        views: '6.3k',
        complexity: 'Advanced',
        thumbnail: '/videos/multi-brand.jpg'
      },
      {
        title: 'Advanced Security & Compliance',
        description: 'Enterprise security features and compliance tools',
        duration: '17:45',
        views: '4.2k',
        complexity: 'Expert',
        thumbnail: '/videos/security-compliance.jpg'
      }
    ]
  }
]

const prerequisites = [
  'Completed beginner and intermediate tutorials',
  'Familiar with basic platform features',
  'Understanding of content marketing concepts',
  'Basic technical knowledge (for API tutorials)'
]

export default function AdvancedVideosPage() {
  return (
    <PageLayout>
      <PageHero
        title="Advanced Features Video Tutorials"
        description="Master advanced features and power-user techniques with comprehensive video tutorials. Perfect for experienced users ready to take their content strategy to the next level."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#series">
              <Play className="mr-2 h-4 w-4" />
              Start Advanced Training
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help/videos">
              <BookOpen className="mr-2 h-4 w-4" />
              All Video Tutorials
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Prerequisites */}
      <ContentSection>
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Target className="h-5 w-5" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                These tutorials are designed for advanced users. Before starting, make sure you have:
              </p>
              <ul className="space-y-2">
                {prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2 text-orange-700 dark:text-orange-300">
                    <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* Advanced Series */}
      <ContentSection id="series" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Advanced Tutorial Series</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep-dive tutorials for power users and technical professionals
          </p>
        </div>

        <div className="space-y-12">
          {advancedSeries.map((series, seriesIndex) => (
            <div key={seriesIndex}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-lg ${series.color} text-white`}>
                  <series.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{series.title}</h3>
                  <p className="text-muted-foreground">{series.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {series.videos.map((video, videoIndex) => (
                  <Card key={videoIndex} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                      <Play className="h-12 w-12 text-primary" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant={video.complexity === 'Advanced' ? 'secondary' : 'destructive'}>
                          {video.complexity}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{video.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.9</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {video.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Learning Tracks */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Specialized Learning Tracks</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a track based on your role and specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Data Analyst Track',
              description: 'Focus on analytics, reporting, and performance optimization',
              icon: BarChart3,
              duration: '4 hours',
              videos: 8,
              topics: ['Advanced Analytics', 'Custom Reports', 'Data Visualization', 'Performance Metrics']
            },
            {
              title: 'Developer Track',
              description: 'API integration, webhooks, and custom development',
              icon: Code,
              duration: '6 hours',
              videos: 12,
              topics: ['API Integration', 'Webhook Setup', 'Custom Integrations', 'SDK Usage']
            },
            {
              title: 'Enterprise Admin Track',
              description: 'Team management, security, and enterprise features',
              icon: Settings,
              duration: '3 hours',
              videos: 6,
              topics: ['Team Management', 'Security Settings', 'Compliance', 'Multi-Brand Setup']
            }
          ].map((track, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <track.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Specialized</Badge>
                </div>
                <CardTitle className="text-xl">{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{track.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{track.videos} videos</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {track.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Start Track
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Expert Tips */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Expert Tips</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pro tips from our most experienced users and team members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Performance Optimization',
              tips: [
                'Monitor key metrics daily, not just weekly',
                'Set up automated alerts for performance drops',
                'Use A/B testing for all major content changes',
                'Analyze competitor performance regularly'
              ]
            },
            {
              title: 'Automation Best Practices',
              tips: [
                'Start with simple workflows before complex ones',
                'Always test automation rules thoroughly',
                'Keep human oversight in critical processes',
                'Document all custom workflows for your team'
              ]
            },
            {
              title: 'API Integration',
              tips: [
                'Use rate limiting to avoid API throttling',
                'Implement proper error handling and retries',
                'Cache frequently accessed data',
                'Monitor API usage and performance'
              ]
            },
            {
              title: 'Team Management',
              tips: [
                'Define clear roles and responsibilities',
                'Use approval workflows for sensitive content',
                'Regular training sessions for new features',
                'Establish content quality standards'
              ]
            }
          ].map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Become a Power User?</h2>
          <p className="text-xl mb-8 opacity-90">
            Master advanced features and unlock the full potential of our platform. Join the ranks of our most successful users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#series">
                <Play className="mr-2 h-4 w-4" />
                Start Advanced Training
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">
                <Settings className="mr-2 h-4 w-4" />
                Get Expert Support
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
