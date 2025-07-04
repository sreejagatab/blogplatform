import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Clock, 
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Video Tutorials',
  description: 'Learn Universal Blog Platform with our comprehensive video tutorial library.',
}

const videoCategories = [
  {
    title: 'Getting Started',
    description: 'Essential videos for new users',
    videos: [
      { title: 'Platform Overview', duration: '5:30', views: '25k' },
      { title: 'Account Setup', duration: '8:15', views: '18k' },
      { title: 'First Post Tutorial', duration: '12:45', views: '32k' },
      { title: 'Platform Connections', duration: '10:20', views: '22k' }
    ]
  },
  {
    title: 'Content Creation',
    description: 'Master content creation tools',
    videos: [
      { title: 'AI Writing Assistant', duration: '15:30', views: '45k' },
      { title: 'Content Templates', duration: '8:45', views: '28k' },
      { title: 'SEO Optimization', duration: '12:15', views: '35k' },
      { title: 'Media Management', duration: '9:30', views: '19k' }
    ]
  },
  {
    title: 'Advanced Features',
    description: 'Unlock the full potential',
    videos: [
      { title: 'Team Collaboration', duration: '18:20', views: '15k' },
      { title: 'Analytics Deep Dive', duration: '22:10', views: '12k' },
      { title: 'API Integration', duration: '25:45', views: '8k' },
      { title: 'Automation Setup', duration: '16:30', views: '11k' }
    ]
  }
]

export default function VideosPage() {
  return (
    <PageLayout>
      <PageHero
        title="Video Tutorials"
        description="Learn Universal Blog Platform with our comprehensive video tutorial library. Watch step-by-step guides to master every feature."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Featured Video */}
          <Card className="mb-12">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <p className="text-muted-foreground">Featured Tutorial</p>
                  </div>
                </div>
                <div className="p-6">
                  <Badge className="mb-3">Most Popular</Badge>
                  <h2 className="text-2xl font-bold mb-3">Complete Getting Started Guide</h2>
                  <p className="text-muted-foreground mb-4">
                    A comprehensive 30-minute tutorial covering everything you need to know to get started with Universal Blog Platform.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      30:15
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      125k views
                    </div>
                  </div>
                  <Button size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Categories */}
          <div className="space-y-12">
            {videoCategories.map((category, index) => (
              <div key={index}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.videos.map((video, videoIndex) => (
                    <Card key={videoIndex} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-muted flex items-center justify-center relative">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Play className="h-6 w-6 ml-1" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{video.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {video.views} views
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Channel CTA */}
          <Card className="mt-16 bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Subscribe to Our YouTube Channel</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Get notified when we publish new tutorials and feature updates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit YouTube Channel
              </Button>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the video you're looking for? Check out our other resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/docs">
                  Written Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community">
                  Community Forum
                </Link>
              </Button>
              <Button asChild>
                <Link href="/contact">
                  Contact Support
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
