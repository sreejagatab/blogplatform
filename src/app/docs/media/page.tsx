import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Image, 
  Video, 
  Upload,
  Crop,
  ArrowRight,
  CheckCircle,
  FileImage,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Media Management Guide',
  description: 'Learn how to upload, manage, and optimize images and videos for your content.',
}

const mediaFeatures = [
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Drag and drop or browse to upload media files',
    formats: ['JPEG, PNG, GIF', 'MP4, MOV, AVI', 'SVG, WebP', 'PDF documents']
  },
  {
    icon: Crop,
    title: 'Auto-Optimization',
    description: 'Automatic resizing and optimization for each platform',
    formats: ['Instagram: 1080x1080', 'Twitter: 1200x675', 'LinkedIn: 1200x627', 'Facebook: 1200x630']
  },
  {
    icon: FileImage,
    title: 'Media Library',
    description: 'Organize and reuse your media across all content',
    formats: ['Smart tagging', 'Search & filter', 'Folder organization', 'Usage tracking']
  }
]

const bestPractices = [
  {
    category: 'Image Quality',
    tips: [
      'Use high-resolution images (at least 1080px wide)',
      'Maintain consistent visual style and branding',
      'Optimize file sizes for faster loading',
      'Include alt text for accessibility'
    ]
  },
  {
    category: 'Video Content',
    tips: [
      'Keep videos under 2 minutes for social media',
      'Add captions for accessibility',
      'Use engaging thumbnails',
      'Optimize for mobile viewing'
    ]
  }
]

export default function MediaPage() {
  return (
    <PageLayout>
      <PageHero
        title="Media Management Guide"
        description="Master media management to create visually compelling content across all platforms."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Media Library
              </CardTitle>
              <CardDescription>
                Upload and manage your images and videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
                <Button size="lg" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Media Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Media Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Media Management Features</h2>
            <div className="space-y-8">
              {mediaFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {feature.formats.map((format, formatIndex) => (
                        <div key={formatIndex} className="p-3 bg-muted/50 rounded-lg text-sm text-center">
                          {format}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Specifications */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Platform Image Specifications</CardTitle>
              <CardDescription>
                Optimal image sizes for each platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Instagram</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Feed: 1080 x 1080px</li>
                    <li>• Stories: 1080 x 1920px</li>
                    <li>• Reels: 1080 x 1920px</li>
                    <li>• IGTV: 1080 x 1920px</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Twitter/X</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Single image: 1200 x 675px</li>
                    <li>• Multiple images: 1200 x 600px</li>
                    <li>• Header: 1500 x 500px</li>
                    <li>• Profile: 400 x 400px</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">LinkedIn</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Single image: 1200 x 627px</li>
                    <li>• Company page: 1192 x 220px</li>
                    <li>• Profile: 400 x 400px</li>
                    <li>• Article: 1200 x 627px</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Media Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{practice.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, tipIndex) => (
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

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Managing Your Media</h2>
            <p className="text-muted-foreground mb-6">
              Upload and organize your images and videos for better content creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/templates">
                  Browse Templates
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
