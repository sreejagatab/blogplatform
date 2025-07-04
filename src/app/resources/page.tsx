import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  BookOpen,
  Video,
  Download,
  Users,
  Lightbulb,
  TrendingUp,
  FileText,
  Headphones,
  ArrowRight,
  ExternalLink,
  Star,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resources - Universal Blog Platform',
  description: 'Comprehensive resources, guides, templates, and tools to help you succeed with content creation and distribution.',
}

const resourceCategories = [
  {
    icon: BookOpen,
    title: 'Guides & Tutorials',
    description: 'Step-by-step guides to master content creation',
    count: '25+ guides',
    color: 'bg-blue-500',
    resources: [
      { name: 'Creator Playbook', href: '/resources/creator-playbook', type: 'Guide' },
      { name: 'SEO Best Practices', href: '/docs/seo', type: 'Tutorial' },
      { name: 'Platform Optimization', href: '/docs/platform-connections', type: 'Guide' },
      { name: 'Content Strategy', href: '/resources/content-strategy', type: 'Guide' }
    ]
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch and learn with our video content',
    count: '50+ videos',
    color: 'bg-red-500',
    resources: [
      { name: 'Getting Started Series', href: '/help/videos', type: 'Video Series' },
      { name: 'AI Writing Assistant', href: '/help/videos/ai-assistant', type: 'Video' },
      { name: 'Advanced Features', href: '/help/videos/advanced', type: 'Video Series' },
      { name: 'Platform Integrations', href: '/help/videos/integrations', type: 'Video' }
    ]
  },
  {
    icon: FileText,
    title: 'Templates & Tools',
    description: 'Ready-to-use templates and productivity tools',
    count: '100+ templates',
    color: 'bg-green-500',
    resources: [
      { name: 'Content Templates', href: '/resources/templates', type: 'Templates' },
      { name: 'Social Media Kit', href: '/resources/social-kit', type: 'Tool Kit' },
      { name: 'Editorial Calendar', href: '/resources/calendar', type: 'Template' },
      { name: 'Analytics Dashboard', href: '/admin/analytics', type: 'Tool' }
    ]
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with other creators and experts',
    count: '25k+ members',
    color: 'bg-purple-500',
    resources: [
      { name: 'Discord Community', href: '/community', type: 'Community' },
      { name: 'Creator Spotlight', href: '/community/spotlight', type: 'Feature' },
      { name: 'Q&A Sessions', href: '/community/qa', type: 'Events' },
      { name: 'Success Stories', href: '/community/stories', type: 'Case Studies' }
    ]
  }
]

const featuredResources = [
  {
    title: 'Complete Creator Playbook',
    description: 'Everything you need to know about content creation, distribution, and growth.',
    image: '/resources/playbook-cover.jpg',
    href: '/resources/creator-playbook',
    type: 'Free Guide',
    readTime: '45 min read',
    featured: true
  },
  {
    title: 'Content Strategy Masterclass',
    description: 'Learn how to develop a winning content strategy that drives results.',
    image: '/resources/strategy-cover.jpg',
    href: '/resources/content-strategy',
    type: 'Video Course',
    readTime: '2 hours',
    featured: true
  },
  {
    title: 'AI Writing Toolkit',
    description: 'Master AI-powered content creation with our comprehensive toolkit.',
    image: '/resources/ai-toolkit-cover.jpg',
    href: '/resources/ai-toolkit',
    type: 'Tool Kit',
    readTime: '30 min setup',
    featured: true
  }
]

export default function ResourcesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Creator Resources Hub"
        description="Everything you need to succeed with content creation, distribution, and growth. Free guides, templates, tools, and community support."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/resources/creator-playbook">
              Get Started Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/community">Join Community</Link>
          </Button>
        </div>
      </PageHero>

      {/* Featured Resources */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our most popular and comprehensive resources to accelerate your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {resource.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {resource.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href={resource.href}>
                    Access Resource
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Resource Categories */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need with our organized resource categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${category.color} text-white`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {category.count}
                    </CardDescription>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="flex items-center justify-between">
                      <Link 
                        href={resource.href}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {resource.name}
                      </Link>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  View All {category.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Quick Access */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Access</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Jump directly to the most requested resources and tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Download, title: 'Downloads', href: '/resources/downloads' },
            { icon: Headphones, title: 'Podcast', href: '/podcast' },
            { icon: TrendingUp, title: 'Analytics', href: '/admin/analytics' },
            { icon: Lightbulb, title: 'Help Center', href: '/help' }
          ].map((item, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href={item.href}>Access</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Newsletter CTA */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest resources, tips, and updates delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/newsletter">
                Subscribe to Newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/community">
                Join Community
                <Users className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
