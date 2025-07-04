import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Target, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SEO Optimization Guide',
  description: 'Learn how to optimize your content for search engines and improve your visibility across platforms.',
}

const seoFeatures = [
  {
    icon: Search,
    title: 'Keyword Research',
    description: 'Find the right keywords for your content',
    tips: ['Use long-tail keywords', 'Analyze search intent', 'Check keyword difficulty', 'Monitor trends']
  },
  {
    icon: Target,
    title: 'Content Optimization',
    description: 'Optimize your content for better rankings',
    tips: ['Include keywords naturally', 'Write compelling titles', 'Use proper headings', 'Optimize meta descriptions']
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor your SEO performance',
    tips: ['Track keyword rankings', 'Monitor organic traffic', 'Analyze click-through rates', 'Measure conversions']
  },
  {
    icon: Globe,
    title: 'Technical SEO',
    description: 'Ensure technical aspects are optimized',
    tips: ['Fast loading times', 'Mobile-friendly design', 'Clean URL structure', 'Proper schema markup']
  }
]

const seoChecklist = [
  { item: 'Include target keyword in title', priority: 'High' },
  { item: 'Write compelling meta description', priority: 'High' },
  { item: 'Use header tags (H1, H2, H3)', priority: 'High' },
  { item: 'Include keywords in first paragraph', priority: 'Medium' },
  { item: 'Add alt text to images', priority: 'Medium' },
  { item: 'Use internal and external links', priority: 'Medium' },
  { item: 'Optimize URL structure', priority: 'Low' },
  { item: 'Add schema markup', priority: 'Low' }
]

export default function SEOPage() {
  return (
    <PageLayout>
      <PageHero
        title="SEO Optimization Guide"
        description="Master search engine optimization to increase your content's visibility and reach more readers."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Quick Start
              </CardTitle>
              <CardDescription>
                Get started with SEO optimization in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Content
                </Button>
                <Button size="lg" variant="outline">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get SEO Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">SEO Optimization Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seoFeatures.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Best Practices:</h4>
                    <ul className="space-y-1">
                      {feature.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SEO Checklist */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>SEO Optimization Checklist</CardTitle>
              <CardDescription>
                Follow this checklist to ensure your content is properly optimized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoChecklist.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{item.item}</span>
                    </div>
                    <Badge variant={
                      item.priority === 'High' ? 'destructive' : 
                      item.priority === 'Medium' ? 'default' : 'secondary'
                    }>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform-Specific SEO */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Platform-Specific SEO Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Blog Platforms</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Use descriptive URLs</li>
                    <li>• Optimize images with alt text</li>
                    <li>• Include internal links</li>
                    <li>• Add meta descriptions</li>
                    <li>• Use proper heading structure</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Social Media</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Use relevant hashtags</li>
                    <li>• Include keywords in captions</li>
                    <li>• Optimize profile descriptions</li>
                    <li>• Use location tags when relevant</li>
                    <li>• Post at optimal times</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Optimizing Your Content</h2>
            <p className="text-muted-foreground mb-6">
              Use our SEO tools to improve your content's search engine visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Search className="mr-2 h-4 w-4" />
                Run SEO Analysis
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/analytics">
                  View Analytics Guide
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
