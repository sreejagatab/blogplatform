import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Video, 
  Play, 
  Clock, 
  Search, 
  BookOpen, 
  Users,
  Zap,
  BarChart3,
  Settings,
  Rocket,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Video Tutorials - Documentation',
  description: 'Learn Universal Blog Platform with comprehensive video tutorials covering all features and use cases.',
}

const videoCategories = [
  {
    title: 'Getting Started',
    description: 'Essential videos for new users',
    icon: Rocket,
    color: 'bg-green-100 text-green-800',
    videos: [
      {
        title: 'Platform Overview & Setup',
        duration: '8:45',
        description: 'Complete introduction to Universal Blog Platform and account setup',
        level: 'Beginner',
        views: '12.5K'
      },
      {
        title: 'Creating Your First Post',
        duration: '6:30',
        description: 'Step-by-step guide to creating and publishing your first content',
        level: 'Beginner',
        views: '9.8K'
      },
      {
        title: 'Connecting Social Media Platforms',
        duration: '12:15',
        description: 'How to connect and configure your social media accounts',
        level: 'Beginner',
        views: '8.2K'
      }
    ]
  },
  {
    title: 'Content Creation',
    description: 'Master content creation with AI',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    videos: [
      {
        title: 'AI Writing Assistant Deep Dive',
        duration: '15:20',
        description: 'Advanced techniques for using AI to create compelling content',
        level: 'Intermediate',
        views: '7.1K'
      },
      {
        title: 'Content Templates & Reusability',
        duration: '9:45',
        description: 'Creating and using templates to streamline content production',
        level: 'Intermediate',
        views: '5.9K'
      },
      {
        title: 'SEO Optimization Strategies',
        duration: '18:30',
        description: 'Optimize your content for search engines and discoverability',
        level: 'Advanced',
        views: '6.7K'
      }
    ]
  },
  {
    title: 'Publishing & Distribution',
    description: 'Maximize your content reach',
    icon: Zap,
    color: 'bg-purple-100 text-purple-800',
    videos: [
      {
        title: 'Multi-Platform Publishing Strategies',
        duration: '14:10',
        description: 'Best practices for publishing across multiple platforms',
        level: 'Intermediate',
        views: '4.8K'
      },
      {
        title: 'Content Scheduling & Automation',
        duration: '11:25',
        description: 'Set up automated publishing schedules for consistent content',
        level: 'Intermediate',
        views: '5.3K'
      },
      {
        title: 'Bulk Operations & Content Management',
        duration: '13:40',
        description: 'Efficiently manage large volumes of content with bulk operations',
        level: 'Advanced',
        views: '3.2K'
      }
    ]
  },
  {
    title: 'Analytics & Optimization',
    description: 'Track performance and optimize',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-800',
    videos: [
      {
        title: 'Understanding Your Analytics Dashboard',
        duration: '16:55',
        description: 'Navigate and interpret your content performance metrics',
        level: 'Beginner',
        views: '4.1K'
      },
      {
        title: 'ROI Tracking & Measurement',
        duration: '20:30',
        description: 'Measure the return on investment of your content marketing',
        level: 'Advanced',
        views: '2.9K'
      },
      {
        title: 'Custom Reports & Data Export',
        duration: '12:20',
        description: 'Create custom reports and export data for external analysis',
        level: 'Intermediate',
        views: '3.5K'
      }
    ]
  },
  {
    title: 'Team Collaboration',
    description: 'Work effectively with your team',
    icon: Users,
    color: 'bg-pink-100 text-pink-800',
    videos: [
      {
        title: 'Setting Up Team Roles & Permissions',
        duration: '10:15',
        description: 'Configure team access and manage user permissions',
        level: 'Intermediate',
        views: '2.7K'
      },
      {
        title: 'Content Approval Workflows',
        duration: '14:45',
        description: 'Implement approval processes for quality control',
        level: 'Advanced',
        views: '2.1K'
      },
      {
        title: 'Team Analytics & Performance Tracking',
        duration: '17:30',
        description: 'Monitor team productivity and collaboration metrics',
        level: 'Advanced',
        views: '1.8K'
      }
    ]
  },
  {
    title: 'Advanced Features',
    description: 'Power user tips and tricks',
    icon: Settings,
    color: 'bg-gray-100 text-gray-800',
    videos: [
      {
        title: 'API Integration & Webhooks',
        duration: '22:40',
        description: 'Integrate with external tools using our API and webhooks',
        level: 'Advanced',
        views: '1.5K'
      },
      {
        title: 'Custom Integrations Development',
        duration: '28:15',
        description: 'Build custom integrations with our SDKs and APIs',
        level: 'Expert',
        views: '980'
      },
      {
        title: 'Enterprise Features & Configuration',
        duration: '19:50',
        description: 'Advanced configuration for enterprise deployments',
        level: 'Expert',
        views: '1.2K'
      }
    ]
  }
]

const featuredVideos = [
  {
    title: 'Complete Platform Walkthrough 2024',
    duration: '45:30',
    description: 'Comprehensive overview of all platform features and capabilities',
    thumbnail: '/videos/thumbnails/platform-walkthrough.jpg',
    level: 'All Levels',
    views: '25.3K',
    featured: true
  },
  {
    title: 'AI Content Creation Masterclass',
    duration: '32:15',
    description: 'Master AI-powered content creation with advanced techniques',
    thumbnail: '/videos/thumbnails/ai-masterclass.jpg',
    level: 'Intermediate',
    views: '18.7K',
    featured: true
  },
  {
    title: 'From Zero to 10K Followers',
    duration: '38:20',
    description: 'Real case study of growing from 0 to 10,000 followers',
    thumbnail: '/videos/thumbnails/growth-case-study.jpg',
    level: 'All Levels',
    views: '22.1K',
    featured: true
  }
]

export default function VideosPage() {
  return (
    <PageLayout>
      <PageHero
        title="Video Tutorials"
        description="Learn Universal Blog Platform with comprehensive video tutorials covering everything from basics to advanced features."
        size="md"
      >
        <div className="max-w-md mx-auto mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search video tutorials..." 
              className="pl-10 h-12"
            />
          </div>
        </div>
      </PageHero>

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Featured Videos */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredVideos.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative group cursor-pointer">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{video.views} views</span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Categories */}
          <div className="space-y-12">
            {videoCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`rounded-lg p-2 ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.videos.map((video, videoIndex) => (
                    <Card key={videoIndex} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-muted relative group cursor-pointer">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-2 group-hover:scale-110 transition-transform">
                              <Play className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={video.level === 'Beginner' ? 'default' : 
                                     video.level === 'Intermediate' ? 'secondary' : 'destructive'} 
                              className="text-xs"
                            >
                              {video.level}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{video.views} views</span>
                          </div>
                          <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Learning Paths */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Beginner's Journey
                  </CardTitle>
                  <CardDescription>
                    Complete learning path for new users (Est. 2-3 hours)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                      <span>Platform Overview & Setup</span>
                      <Badge variant="outline" className="text-xs ml-auto">8:45</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                      <span>Creating Your First Post</span>
                      <Badge variant="outline" className="text-xs ml-auto">6:30</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                      <span>Connecting Social Platforms</span>
                      <Badge variant="outline" className="text-xs ml-auto">12:15</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                      <span>Understanding Analytics</span>
                      <Badge variant="outline" className="text-xs ml-auto">16:55</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Play className="mr-2 h-4 w-4" />
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Advanced User Track
                  </CardTitle>
                  <CardDescription>
                    Advanced features and optimization techniques (Est. 4-5 hours)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                      <span>AI Writing Mastery</span>
                      <Badge variant="outline" className="text-xs ml-auto">15:20</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                      <span>SEO Optimization</span>
                      <Badge variant="outline" className="text-xs ml-auto">18:30</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                      <span>ROI Tracking</span>
                      <Badge variant="outline" className="text-xs ml-auto">20:30</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                      <span>API Integration</span>
                      <Badge variant="outline" className="text-xs ml-auto">22:40</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Play className="mr-2 h-4 w-4" />
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Resources */}
          <Card className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Additional Learning Resources</CardTitle>
              <CardDescription className="text-blue-700">
                Expand your knowledge with these additional resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Training Sessions:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Weekly live Q&A sessions</li>
                    <li>• Monthly feature deep-dives</li>
                    <li>• Quarterly strategy workshops</li>
                    <li>• On-demand webinar library</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Community Resources:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• User-generated tutorials</li>
                    <li>• Community best practices</li>
                    <li>• Success story case studies</li>
                    <li>• Expert tips and tricks</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild>
                  <Link href="/events">
                    <Video className="mr-2 h-4 w-4" />
                    View Live Events
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/community">
                    <Users className="mr-2 h-4 w-4" />
                    Join Community
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://youtube.com/universalblogplatform" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    YouTube Channel
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
