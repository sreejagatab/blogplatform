import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Code, 
  Rocket, 
  Users, 
  Zap,
  Search,
  ArrowRight,
  ExternalLink,
  FileText,
  Video,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for Universal Blog Platform. Learn how to maximize your content distribution and engagement.',
}

const docSections = [
  {
    title: 'Getting Started',
    description: 'Quick start guides and basic setup',
    icon: Rocket,
    badge: 'Essential',
    items: [
      { title: 'Quick Start Guide', href: '/docs/quick-start', type: 'guide' },
      { title: 'Account Setup', href: '/docs/account-setup', type: 'guide' },
      { title: 'First Post', href: '/docs/first-post', type: 'tutorial' },
      { title: 'Platform Connections', href: '/docs/platform-connections', type: 'guide' }
    ]
  },
  {
    title: 'Content Creation',
    description: 'Master the art of content creation with AI',
    icon: FileText,
    badge: 'Popular',
    items: [
      { title: 'AI Writing Assistant', href: '/docs/ai-writing', type: 'guide' },
      { title: 'Content Templates', href: '/docs/templates', type: 'reference' },
      { title: 'SEO Optimization', href: '/docs/seo', type: 'guide' },
      { title: 'Media Management', href: '/docs/media', type: 'guide' }
    ]
  },
  {
    title: 'Distribution & Publishing',
    description: 'Publish across 1000+ platforms effectively',
    icon: Zap,
    badge: 'Core',
    items: [
      { title: 'Multi-Platform Publishing', href: '/docs/publishing', type: 'guide' },
      { title: 'Scheduling Content', href: '/docs/scheduling', type: 'guide' },
      { title: 'Platform-Specific Formatting', href: '/docs/formatting', type: 'reference' },
      { title: 'Bulk Operations', href: '/docs/bulk-operations', type: 'tutorial' }
    ]
  },
  {
    title: 'Analytics & Insights',
    description: 'Track performance and optimize strategy',
    icon: BookOpen,
    badge: 'Advanced',
    items: [
      { title: 'Analytics Dashboard', href: '/docs/analytics', type: 'guide' },
      { title: 'Custom Reports', href: '/docs/reports', type: 'guide' },
      { title: 'Performance Metrics', href: '/docs/metrics', type: 'reference' },
      { title: 'ROI Tracking', href: '/docs/roi', type: 'tutorial' }
    ]
  },
  {
    title: 'Team Collaboration',
    description: 'Work together with your team',
    icon: Users,
    badge: 'Pro',
    items: [
      { title: 'User Roles & Permissions', href: '/docs/roles', type: 'guide' },
      { title: 'Workflow Management', href: '/docs/workflows', type: 'guide' },
      { title: 'Team Analytics', href: '/docs/team-analytics', type: 'guide' },
      { title: 'Approval Process', href: '/docs/approvals', type: 'tutorial' }
    ]
  },
  {
    title: 'API & Integrations',
    description: 'Extend functionality with our API',
    icon: Code,
    badge: 'Developer',
    items: [
      { title: 'API Reference', href: '/docs/api', type: 'reference' },
      { title: 'Authentication', href: '/docs/api-auth', type: 'guide' },
      { title: 'Webhooks', href: '/docs/webhooks', type: 'guide' },
      { title: 'Custom Integrations', href: '/docs/integrations', type: 'tutorial' }
    ]
  }
]

const quickLinks = [
  { title: 'Video Tutorials', href: '/docs/videos', icon: Video },
  { title: 'Community Forum', href: '/community', icon: MessageCircle },
  { title: 'API Reference', href: '/docs/api', icon: Code },
  { title: 'Contact Support', href: '/help', icon: ExternalLink }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'tutorial': return '🎯'
    case 'guide': return '📖'
    case 'reference': return '📋'
    default: return '📄'
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'tutorial': return 'Tutorial'
    case 'guide': return 'Guide'
    case 'reference': return 'Reference'
    default: return 'Doc'
  }
}

export default function DocsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Documentation"
        description="Everything you need to master Universal Blog Platform and maximize your content reach."
        size="md"
      >
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search documentation..." 
              className="pl-10 h-12"
            />
          </div>
        </div>
      </PageHero>

      {/* Quick Links */}
      <ContentSection className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <link.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <Link 
                  href={link.href}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {link.title}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docSections.map((section, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{section.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription className="text-base">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        href={item.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getTypeBadge(item.type)}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Help Section */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need More Help?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help.
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
      </ContentSection>
    </PageLayout>
  )
}
