import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Download,
  FileText,
  Image,
  Video,
  Code,
  Palette,
  Calendar,
  BarChart3,
  ArrowRight,
  Star,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads - Universal Blog Platform',
  description: 'Free downloads including templates, tools, guides, and resources to accelerate your content creation and marketing success.',
}

const downloadCategories = [
  {
    icon: FileText,
    title: 'Templates & Guides',
    description: 'Ready-to-use templates and comprehensive guides',
    color: 'bg-blue-500',
    downloads: [
      {
        name: 'Content Calendar Template',
        description: 'Plan your content strategy with our comprehensive calendar template',
        type: 'Excel/Google Sheets',
        size: '2.1 MB',
        downloads: '15.2k',
        rating: 4.9,
        href: '/downloads/content-calendar-template.xlsx',
        featured: true
      },
      {
        name: 'Blog Post Template Pack',
        description: '10 proven blog post templates for different content types',
        type: 'Word/Google Docs',
        size: '1.8 MB',
        downloads: '12.8k',
        rating: 4.8,
        href: '/downloads/blog-post-templates.docx'
      },
      {
        name: 'Social Media Style Guide',
        description: 'Complete brand consistency guide for social platforms',
        type: 'PDF',
        size: '3.2 MB',
        downloads: '9.5k',
        rating: 4.7,
        href: '/downloads/social-media-style-guide.pdf'
      }
    ]
  },
  {
    icon: Palette,
    title: 'Design Assets',
    description: 'Professional graphics and design resources',
    color: 'bg-purple-500',
    downloads: [
      {
        name: 'Social Media Graphics Pack',
        description: '100+ customizable graphics for all major platforms',
        type: 'PSD/Figma',
        size: '45.6 MB',
        downloads: '8.9k',
        rating: 4.9,
        href: '/downloads/social-graphics-pack.zip',
        featured: true
      },
      {
        name: 'Blog Header Templates',
        description: '25 professional blog header designs',
        type: 'PSD/PNG',
        size: '12.3 MB',
        downloads: '7.2k',
        rating: 4.6,
        href: '/downloads/blog-headers.zip'
      },
      {
        name: 'Icon Library',
        description: '500+ vector icons for content creation',
        type: 'SVG/AI',
        size: '8.7 MB',
        downloads: '11.4k',
        rating: 4.8,
        href: '/downloads/icon-library.zip'
      }
    ]
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Track and measure your content performance',
    color: 'bg-green-500',
    downloads: [
      {
        name: 'Content Performance Dashboard',
        description: 'Google Sheets dashboard for tracking content metrics',
        type: 'Google Sheets',
        size: '1.2 MB',
        downloads: '6.8k',
        rating: 4.7,
        href: '/downloads/performance-dashboard.xlsx'
      },
      {
        name: 'ROI Calculator',
        description: 'Calculate the return on investment for your content',
        type: 'Excel',
        size: '0.8 MB',
        downloads: '5.3k',
        rating: 4.5,
        href: '/downloads/roi-calculator.xlsx'
      },
      {
        name: 'Competitor Analysis Template',
        description: 'Comprehensive template for analyzing competitors',
        type: 'Excel/PDF',
        size: '2.4 MB',
        downloads: '4.9k',
        rating: 4.6,
        href: '/downloads/competitor-analysis.xlsx'
      }
    ]
  },
  {
    icon: Code,
    title: 'Developer Tools',
    description: 'Code snippets and development resources',
    color: 'bg-orange-500',
    downloads: [
      {
        name: 'API Integration Examples',
        description: 'Code examples for integrating with our API',
        type: 'ZIP',
        size: '5.1 MB',
        downloads: '3.2k',
        rating: 4.8,
        href: '/downloads/api-examples.zip'
      },
      {
        name: 'WordPress Plugin',
        description: 'Official WordPress plugin for seamless integration',
        type: 'ZIP',
        size: '2.8 MB',
        downloads: '7.6k',
        rating: 4.7,
        href: '/downloads/wordpress-plugin.zip'
      },
      {
        name: 'JavaScript SDK',
        description: 'Complete SDK for JavaScript applications',
        type: 'NPM Package',
        size: '1.5 MB',
        downloads: '2.1k',
        rating: 4.9,
        href: '/downloads/js-sdk.zip'
      }
    ]
  }
]

export default function DownloadsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Free Downloads & Resources"
        description="Accelerate your content creation with our collection of free templates, tools, guides, and design assets."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#featured">
              Browse Featured Downloads
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources">All Resources</Link>
          </Button>
        </div>
      </PageHero>

      {/* Featured Downloads */}
      <ContentSection id="featured">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Downloads</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our most popular and highly-rated resources to get you started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {downloadCategories.flatMap(category => 
            category.downloads.filter(download => download.featured)
          ).map((download, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{download.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{download.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{download.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {download.description}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span>{download.size}</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{download.downloads}</span>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={download.href}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* All Categories */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need with our organized download categories
          </p>
        </div>

        <div className="space-y-12">
          {downloadCategories.map((category, categoryIndex) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.downloads.map((download, downloadIndex) => (
                  <Card key={downloadIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{download.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{download.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{download.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {download.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{download.size}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{download.downloads}</span>
                        </div>
                      </div>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={download.href}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Newsletter CTA */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get New Downloads First</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter and be the first to access new templates, tools, and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/newsletter">
                Subscribe Now
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
