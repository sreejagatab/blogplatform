import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  FileText,
  Layout,
  Mail,
  Share2,
  Calendar,
  BarChart3,
  ArrowRight,
  Star,
  Download,
  Eye,
  Copy,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Content Templates - Universal Blog Platform',
  description: 'Professional content templates for blogs, social media, emails, and more. Save time and create consistent, high-quality content.',
}

const templateCategories = [
  {
    icon: FileText,
    title: 'Blog Post Templates',
    description: 'Proven templates for different types of blog content',
    color: 'bg-blue-500',
    templates: [
      {
        name: 'How-To Guide Template',
        description: 'Step-by-step tutorial format with clear structure',
        type: 'Blog Post',
        uses: '25.3k',
        rating: 4.9,
        preview: '/templates/preview/how-to-guide.jpg',
        featured: true
      },
      {
        name: 'Listicle Template',
        description: 'Engaging list-based content with proven structure',
        type: 'Blog Post',
        uses: '18.7k',
        rating: 4.8,
        preview: '/templates/preview/listicle.jpg'
      },
      {
        name: 'Case Study Template',
        description: 'Professional case study format with results focus',
        type: 'Blog Post',
        uses: '12.4k',
        rating: 4.7,
        preview: '/templates/preview/case-study.jpg'
      },
      {
        name: 'Product Review Template',
        description: 'Comprehensive review format with pros/cons',
        type: 'Blog Post',
        uses: '15.9k',
        rating: 4.6,
        preview: '/templates/preview/product-review.jpg'
      }
    ]
  },
  {
    icon: Share2,
    title: 'Social Media Templates',
    description: 'Engaging templates for all major social platforms',
    color: 'bg-purple-500',
    templates: [
      {
        name: 'Instagram Story Series',
        description: '10 story templates for maximum engagement',
        type: 'Social Media',
        uses: '32.1k',
        rating: 4.9,
        preview: '/templates/preview/instagram-stories.jpg',
        featured: true
      },
      {
        name: 'LinkedIn Post Templates',
        description: 'Professional LinkedIn content templates',
        type: 'Social Media',
        uses: '19.8k',
        rating: 4.8,
        preview: '/templates/preview/linkedin-posts.jpg'
      },
      {
        name: 'Twitter Thread Templates',
        description: 'Viral thread structures and formats',
        type: 'Social Media',
        uses: '14.2k',
        rating: 4.7,
        preview: '/templates/preview/twitter-threads.jpg'
      },
      {
        name: 'Facebook Ad Templates',
        description: 'High-converting Facebook ad copy templates',
        type: 'Social Media',
        uses: '8.9k',
        rating: 4.6,
        preview: '/templates/preview/facebook-ads.jpg'
      }
    ]
  },
  {
    icon: Mail,
    title: 'Email Templates',
    description: 'Professional email templates for marketing and outreach',
    color: 'bg-green-500',
    templates: [
      {
        name: 'Newsletter Template Pack',
        description: '5 newsletter designs for different industries',
        type: 'Email',
        uses: '11.7k',
        rating: 4.8,
        preview: '/templates/preview/newsletter.jpg'
      },
      {
        name: 'Welcome Email Series',
        description: '7-email onboarding sequence template',
        type: 'Email',
        uses: '9.3k',
        rating: 4.7,
        preview: '/templates/preview/welcome-series.jpg'
      },
      {
        name: 'Product Launch Emails',
        description: 'Complete launch sequence with 5 emails',
        type: 'Email',
        uses: '7.8k',
        rating: 4.6,
        preview: '/templates/preview/product-launch.jpg'
      }
    ]
  },
  {
    icon: Calendar,
    title: 'Planning Templates',
    description: 'Organize and plan your content strategy',
    color: 'bg-orange-500',
    templates: [
      {
        name: 'Content Calendar Template',
        description: 'Monthly content planning with platform scheduling',
        type: 'Planning',
        uses: '16.4k',
        rating: 4.9,
        preview: '/templates/preview/content-calendar.jpg',
        featured: true
      },
      {
        name: 'Editorial Calendar',
        description: 'Comprehensive editorial planning template',
        type: 'Planning',
        uses: '12.1k',
        rating: 4.8,
        preview: '/templates/preview/editorial-calendar.jpg'
      },
      {
        name: 'Campaign Planning Template',
        description: 'Multi-channel campaign planning and tracking',
        type: 'Planning',
        uses: '8.6k',
        rating: 4.7,
        preview: '/templates/preview/campaign-planning.jpg'
      }
    ]
  }
]

export default function TemplatesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Professional Content Templates"
        description="Save time and create consistent, high-quality content with our collection of proven templates for blogs, social media, emails, and more."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#featured">
              Browse Featured Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources/downloads">Free Downloads</Link>
          </Button>
        </div>
      </PageHero>

      {/* Featured Templates */}
      <ContentSection id="featured">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Most Popular Templates</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our highest-rated and most-used templates to jumpstart your content creation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {templateCategories.flatMap(category => 
            category.templates.filter(template => template.featured)
          ).map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Layout className="h-12 w-12 text-primary" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{template.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {template.description}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    <span>{template.uses} uses</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      Use Template
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Template Categories */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect template for your content type and platform
          </p>
        </div>

        <div className="space-y-12">
          {templateCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-lg ${category.color} text-white`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.templates.map((template, templateIndex) => (
                  <Card key={templateIndex} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Layout className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">{template.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{template.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-3">
                        {template.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3" />
                          <span>{template.uses}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" asChild className="flex-1">
                          <Link href={`/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            Use
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* How It Works */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Templates Work</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with our templates in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Choose Template',
              description: 'Browse our collection and select the perfect template for your content type',
              icon: Layout
            },
            {
              step: '2',
              title: 'Customize Content',
              description: 'Replace placeholder text with your own content while keeping the proven structure',
              icon: FileText
            },
            {
              step: '3',
              title: 'Publish & Share',
              description: 'Publish your content across platforms or save as draft for later scheduling',
              icon: Share2
            }
          ].map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Content?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start using our professional templates today and see the difference in your content quality and engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/resources">
                Browse All Resources
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
