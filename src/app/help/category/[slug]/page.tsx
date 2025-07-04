import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  Eye,
  ArrowRight,
  BookOpen,
  Users,
  Settings,
  Zap,
  BarChart3,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: {
    slug: string
  }
}

const categories = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Essential guides for new users to get up and running quickly',
    icon: BookOpen,
    color: 'bg-green-100 text-green-800',
    articles: [
      {
        title: 'Platform Overview and Setup',
        description: 'Complete introduction to Universal Blog Platform features and initial setup',
        readTime: '5 min read',
        views: '12.5k views',
        href: '/help/getting-started/platform-overview'
      },
      {
        title: 'Creating Your First Post',
        description: 'Step-by-step guide to creating and publishing your first content',
        readTime: '8 min read',
        views: '9.8k views',
        href: '/help/getting-started/first-post'
      },
      {
        title: 'Connecting Social Media Accounts',
        description: 'How to connect and configure your social media platforms',
        readTime: '6 min read',
        views: '8.2k views',
        href: '/help/getting-started/connect-accounts'
      },
      {
        title: 'Understanding the Dashboard',
        description: 'Navigate your dashboard and understand key metrics',
        readTime: '4 min read',
        views: '7.1k views',
        href: '/help/getting-started/dashboard'
      }
    ]
  },
  'content-creation': {
    title: 'Content Creation',
    description: 'Master the art of creating engaging content with AI assistance',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    articles: [
      {
        title: 'AI Writing Assistant Guide',
        description: 'Learn to use AI tools for creating compelling content',
        readTime: '10 min read',
        views: '15.3k views',
        href: '/help/content-creation/ai-writing'
      },
      {
        title: 'Content Templates and Reusability',
        description: 'Create and use templates to streamline content production',
        readTime: '7 min read',
        views: '6.9k views',
        href: '/help/content-creation/templates'
      },
      {
        title: 'SEO Optimization Best Practices',
        description: 'Optimize your content for search engines and discoverability',
        readTime: '12 min read',
        views: '11.2k views',
        href: '/help/content-creation/seo'
      }
    ]
  },
  'publishing': {
    title: 'Publishing & Distribution',
    description: 'Learn how to publish and distribute content across multiple platforms',
    icon: Zap,
    color: 'bg-purple-100 text-purple-800',
    articles: [
      {
        title: 'Multi-Platform Publishing',
        description: 'Best practices for publishing across multiple social media platforms',
        readTime: '9 min read',
        views: '8.7k views',
        href: '/help/publishing/multi-platform'
      },
      {
        title: 'Content Scheduling and Automation',
        description: 'Set up automated publishing schedules for consistent content',
        readTime: '11 min read',
        views: '7.4k views',
        href: '/help/publishing/scheduling'
      },
      {
        title: 'Troubleshooting Publishing Issues',
        description: 'Common publishing problems and how to solve them',
        readTime: '6 min read',
        views: '5.8k views',
        href: '/help/publishing/troubleshooting'
      }
    ]
  },
  'analytics': {
    title: 'Analytics & Reporting',
    description: 'Track performance and optimize your content strategy with data',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-800',
    articles: [
      {
        title: 'Understanding Your Analytics Dashboard',
        description: 'Navigate and interpret your content performance metrics',
        readTime: '8 min read',
        views: '9.1k views',
        href: '/help/analytics/dashboard'
      },
      {
        title: 'ROI Tracking and Measurement',
        description: 'Measure the return on investment of your content marketing',
        readTime: '15 min read',
        views: '4.3k views',
        href: '/help/analytics/roi'
      },
      {
        title: 'Custom Reports and Data Export',
        description: 'Create custom reports and export data for external analysis',
        readTime: '7 min read',
        views: '3.9k views',
        href: '/help/analytics/reports'
      }
    ]
  },
  'team-collaboration': {
    title: 'Team Collaboration',
    description: 'Work effectively with your team using collaboration features',
    icon: Users,
    color: 'bg-pink-100 text-pink-800',
    articles: [
      {
        title: 'Setting Up Team Roles and Permissions',
        description: 'Configure team access and manage user permissions',
        readTime: '6 min read',
        views: '5.2k views',
        href: '/help/team-collaboration/roles'
      },
      {
        title: 'Content Approval Workflows',
        description: 'Implement approval processes for quality control',
        readTime: '9 min read',
        views: '3.8k views',
        href: '/help/team-collaboration/workflows'
      },
      {
        title: 'Team Analytics and Performance',
        description: 'Monitor team productivity and collaboration metrics',
        readTime: '11 min read',
        views: '2.7k views',
        href: '/help/team-collaboration/analytics'
      }
    ]
  },
  'billing': {
    title: 'Billing & Account',
    description: 'Manage your subscription, payments, and account settings',
    icon: CreditCard,
    color: 'bg-gray-100 text-gray-800',
    articles: [
      {
        title: 'Managing Your Subscription',
        description: 'Upgrade, downgrade, or cancel your subscription',
        readTime: '5 min read',
        views: '6.8k views',
        href: '/help/billing/subscription'
      },
      {
        title: 'Payment Methods and Billing',
        description: 'Update payment information and understand billing cycles',
        readTime: '4 min read',
        views: '4.1k views',
        href: '/help/billing/payment'
      },
      {
        title: 'Account Security and Settings',
        description: 'Secure your account and manage personal settings',
        readTime: '7 min read',
        views: '3.5k views',
        href: '/help/billing/security'
      }
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories[params.slug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested help category could not be found.'
    }
  }

  return {
    title: `${category.title} - Help Center`,
    description: category.description
  }
}

export default function HelpCategoryPage({ params }: Props) {
  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  return (
    <PageLayout>
      <PageHero
        title={category.title}
        description={category.description}
        size="md"
      >
        <div className="max-w-md mx-auto mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={`Search ${category.title.toLowerCase()}...`}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </PageHero>

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/help">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Help Center
              </Link>
            </Button>
          </div>

          {/* Category Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${category.color}`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">{category.title}</h1>
                  <p className="text-muted-foreground">{category.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="outline">
                      {category.articles.length} articles
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Updated regularly
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {category.articles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                    <Link href={article.href}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={article.href}>
                        Read More
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Related Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Related Help Categories</CardTitle>
              <CardDescription>
                Explore other areas that might be helpful
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(categories)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 3)
                  .map(([slug, cat]) => (
                    <Button
                      key={slug}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      asChild
                    >
                      <Link href={`/help/category/${slug}`}>
                        <div className="flex items-center gap-3">
                          <div className={`rounded p-2 ${cat.color}`}>
                            <cat.icon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{cat.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {cat.articles.length} articles
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }))
}
