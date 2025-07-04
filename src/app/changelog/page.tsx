import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Zap, 
  Bug, 
  Shield,
  Calendar,
  ArrowRight,
  ExternalLink,
  Star,
  Sparkles,
  Settings,
  Users,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Stay up to date with the latest features, improvements, and bug fixes in Universal Blog Platform.',
}

const releases = [
  {
    version: '2.4.0',
    date: '2024-12-20',
    type: 'major',
    title: 'AI Content Enhancement & Team Collaboration',
    description: 'Major update with improved AI capabilities and enhanced team features.',
    changes: [
      {
        type: 'feature',
        title: 'Advanced AI Writing Modes',
        description: 'Added creative, professional, and casual writing modes for better content personalization.'
      },
      {
        type: 'feature',
        title: 'Team Workspaces',
        description: 'New collaborative workspaces with role-based permissions and shared content libraries.'
      },
      {
        type: 'feature',
        title: 'Content Templates Library',
        description: 'Pre-built templates for common content types including blog posts, social media, and newsletters.'
      },
      {
        type: 'improvement',
        title: 'Enhanced Analytics Dashboard',
        description: 'Redesigned analytics with better visualizations and custom date ranges.'
      },
      {
        type: 'fix',
        title: 'Publishing Queue Reliability',
        description: 'Fixed issues with scheduled posts not publishing at the correct time.'
      }
    ]
  },
  {
    version: '2.3.2',
    date: '2024-12-10',
    type: 'minor',
    title: 'Platform Integrations & Performance',
    description: 'New platform integrations and significant performance improvements.',
    changes: [
      {
        type: 'feature',
        title: 'TikTok Integration',
        description: 'Added support for publishing video content to TikTok with automatic format optimization.'
      },
      {
        type: 'feature',
        title: 'Pinterest Boards',
        description: 'Enhanced Pinterest integration with support for multiple boards and Rich Pins.'
      },
      {
        type: 'improvement',
        title: 'API Response Times',
        description: 'Reduced average API response time by 40% through infrastructure optimizations.'
      },
      {
        type: 'improvement',
        title: 'Mobile App Performance',
        description: 'Improved mobile app loading speed and reduced memory usage.'
      },
      {
        type: 'fix',
        title: 'Image Upload Issues',
        description: 'Resolved problems with large image uploads failing on slower connections.'
      }
    ]
  },
  {
    version: '2.3.1',
    date: '2024-11-28',
    type: 'patch',
    title: 'Bug Fixes & Security Updates',
    description: 'Important security updates and bug fixes.',
    changes: [
      {
        type: 'security',
        title: 'Enhanced Authentication',
        description: 'Implemented additional security measures for user authentication and session management.'
      },
      {
        type: 'fix',
        title: 'LinkedIn Publishing',
        description: 'Fixed issue where LinkedIn posts were not formatting correctly with line breaks.'
      },
      {
        type: 'fix',
        title: 'Dashboard Loading',
        description: 'Resolved slow loading times on the main dashboard for users with large amounts of content.'
      },
      {
        type: 'improvement',
        title: 'Error Messages',
        description: 'Improved error messages throughout the platform for better user experience.'
      }
    ]
  },
  {
    version: '2.3.0',
    date: '2024-11-15',
    type: 'major',
    title: 'AI-Powered SEO & Content Optimization',
    description: 'Revolutionary AI features for content optimization and SEO enhancement.',
    changes: [
      {
        type: 'feature',
        title: 'AI SEO Optimizer',
        description: 'Automatically optimize content for search engines with AI-powered keyword suggestions and meta descriptions.'
      },
      {
        type: 'feature',
        title: 'Content Performance Predictor',
        description: 'AI model that predicts content performance across different platforms before publishing.'
      },
      {
        type: 'feature',
        title: 'Smart Hashtag Generator',
        description: 'Generate relevant hashtags automatically based on content analysis and trending topics.'
      },
      {
        type: 'feature',
        title: 'Multi-language Support',
        description: 'Added support for content creation and publishing in 15+ languages.'
      },
      {
        type: 'improvement',
        title: 'Bulk Operations',
        description: 'Enhanced bulk editing capabilities for managing multiple posts simultaneously.'
      }
    ]
  },
  {
    version: '2.2.5',
    date: '2024-11-01',
    type: 'minor',
    title: 'Analytics & Reporting Enhancements',
    description: 'Comprehensive analytics improvements and new reporting features.',
    changes: [
      {
        type: 'feature',
        title: 'Custom Reports',
        description: 'Create and schedule custom analytics reports with your preferred metrics and timeframes.'
      },
      {
        type: 'feature',
        title: 'Competitor Analysis',
        description: 'Track and compare your performance against competitors across platforms.'
      },
      {
        type: 'improvement',
        title: 'Real-time Metrics',
        description: 'Enhanced real-time analytics with live engagement tracking and notifications.'
      },
      {
        type: 'improvement',
        title: 'Export Capabilities',
        description: 'Export analytics data in multiple formats including CSV, PDF, and Excel.'
      }
    ]
  }
]

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case 'feature': return Plus
    case 'improvement': return Zap
    case 'fix': return Bug
    case 'security': return Shield
    default: return Settings
  }
}

const getChangeTypeColor = (type: string) => {
  switch (type) {
    case 'feature': return 'text-green-600 bg-green-100'
    case 'improvement': return 'text-blue-600 bg-blue-100'
    case 'fix': return 'text-orange-600 bg-orange-100'
    case 'security': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getReleaseTypeColor = (type: string) => {
  switch (type) {
    case 'major': return 'text-purple-600 bg-purple-100'
    case 'minor': return 'text-blue-600 bg-blue-100'
    case 'patch': return 'text-green-600 bg-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getChangeTypeLabel = (type: string) => {
  switch (type) {
    case 'feature': return 'New Feature'
    case 'improvement': return 'Improvement'
    case 'fix': return 'Bug Fix'
    case 'security': return 'Security'
    default: return 'Change'
  }
}

export default function ChangelogPage() {
  return (
    <PageLayout>
      <PageHero
        title="Changelog"
        description="Stay up to date with the latest features, improvements, and bug fixes in Universal Blog Platform."
        size="md"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">
              Request Feature
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/status">System Status</Link>
          </Button>
        </div>
      </PageHero>

      {/* Changelog Entries */}
      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {releases.map((release, index) => (
              <div key={index} className="relative">
                {/* Timeline line */}
                {index < releases.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-border -z-10" />
                )}
                
                <div className="flex gap-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {release.version.split('.')[1]}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getReleaseTypeColor(release.type)}>
                              v{release.version}
                            </Badge>
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              {release.date}
                            </Badge>
                          </div>
                          {release.type === 'major' && (
                            <Star className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <CardTitle className="text-xl">{release.title}</CardTitle>
                        <CardDescription className="text-base">
                          {release.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {release.changes.map((change, changeIndex) => {
                            const ChangeIcon = getChangeTypeIcon(change.type)
                            
                            return (
                              <div key={changeIndex} className="flex gap-3">
                                <div className={`p-1.5 rounded-full ${getChangeTypeColor(change.type)} flex-shrink-0 mt-0.5`}>
                                  <ChangeIcon className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{change.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {getChangeTypeLabel(change.type)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {change.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Feature Request CTA */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Have a Feature Request?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking to improve Universal Blog Platform. Share your ideas and help shape the future of content distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Submit Feature Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/community">Join Community Discussion</Link>
            </Button>
          </div>
        </div>
      </ContentSection>

      {/* Newsletter Signup */}
      <ContentSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get notified about new features, updates, and improvements delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/newsletter">
                Subscribe to Updates
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
