import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Star, 
  Download,
  ArrowRight,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Templates',
  description: 'Discover and use pre-built content templates to create engaging posts faster.',
}

const templateCategories = [
  {
    name: 'Social Media',
    icon: Users,
    count: 25,
    templates: [
      { name: 'Product Launch', uses: '2.3k', rating: 4.8 },
      { name: 'Behind the Scenes', uses: '1.8k', rating: 4.7 },
      { name: 'User Testimonial', uses: '3.1k', rating: 4.9 },
      { name: 'Industry News', uses: '1.5k', rating: 4.6 }
    ]
  },
  {
    name: 'Blog Posts',
    icon: FileText,
    count: 18,
    templates: [
      { name: 'How-to Guide', uses: '4.2k', rating: 4.9 },
      { name: 'Case Study', uses: '2.7k', rating: 4.8 },
      { name: 'Industry Analysis', uses: '1.9k', rating: 4.7 },
      { name: 'Personal Story', uses: '3.3k', rating: 4.8 }
    ]
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    count: 15,
    templates: [
      { name: 'Email Newsletter', uses: '2.1k', rating: 4.7 },
      { name: 'Sales Announcement', uses: '1.6k', rating: 4.6 },
      { name: 'Event Promotion', uses: '2.4k', rating: 4.8 },
      { name: 'Customer Success', uses: '1.8k', rating: 4.7 }
    ]
  }
]

export default function TemplatesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Content Templates"
        description="Speed up your content creation with our library of proven templates for every occasion."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Featured Template */}
          <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4">Most Popular</Badge>
                  <h2 className="text-2xl font-bold mb-4">How-to Guide Template</h2>
                  <p className="text-muted-foreground mb-6">
                    Create comprehensive step-by-step guides that educate and engage your audience. 
                    Perfect for tutorials, processes, and instructional content.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Used 4.2k times</div>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <Button variant="outline">Preview</Button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-3">Template Structure:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Compelling headline with benefit</li>
                    <li>• Brief introduction and overview</li>
                    <li>• Step-by-step instructions</li>
                    <li>• Visual aids and examples</li>
                    <li>• Summary and next steps</li>
                    <li>• Call-to-action</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
            <div className="space-y-8">
              {templateCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <category.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category.name}</CardTitle>
                          <CardDescription>{category.count} templates available</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {category.templates.map((template, templateIndex) => (
                        <div key={templateIndex} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <h3 className="font-semibold mb-2">{template.name}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{template.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{template.uses} uses</span>
                          </div>
                          <Button size="sm" className="w-full">
                            <Download className="mr-2 h-3 w-3" />
                            Use Template
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Use Templates */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>How to Use Templates</CardTitle>
              <CardDescription>
                Get the most out of our content templates with these simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Choose Template</h3>
                  <p className="text-sm text-muted-foreground">Browse and select a template that fits your content goals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Customize Content</h3>
                  <p className="text-sm text-muted-foreground">Replace placeholder text with your own content and messaging</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Add Your Voice</h3>
                  <p className="text-sm text-muted-foreground">Personalize the tone and style to match your brand</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Publish & Track</h3>
                  <p className="text-sm text-muted-foreground">Share across platforms and monitor performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Custom Template */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Create Your Own Template
              </CardTitle>
              <CardDescription>
                Turn your best-performing content into reusable templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Save time by creating custom templates from your most successful posts. 
                Share them with your team or keep them private for your own use.
              </p>
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                Create Custom Template
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Ready to Create?</h2>
            <p className="text-muted-foreground mb-6">
              Start using templates to create engaging content faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Browse All Templates
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/ai-writing">
                  Learn About AI Writing
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
