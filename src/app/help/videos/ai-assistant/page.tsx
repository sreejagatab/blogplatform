import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Brain,
  Zap,
  FileText,
  Target
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Assistant Video Tutorials - Universal Blog Platform',
  description: 'Learn to master our AI writing assistant with comprehensive video tutorials. From basics to advanced techniques.',
}

const videoSeries = [
  {
    title: 'Getting Started with AI Assistant',
    description: 'Learn the basics of using our AI writing assistant',
    videos: [
      {
        title: 'Introduction to AI Assistant',
        description: 'Overview of features and capabilities',
        duration: '5:32',
        views: '25.3k',
        difficulty: 'Beginner',
        thumbnail: '/videos/ai-intro.jpg'
      },
      {
        title: 'Setting Up Your First AI Project',
        description: 'Step-by-step setup and configuration',
        duration: '8:15',
        views: '18.7k',
        difficulty: 'Beginner',
        thumbnail: '/videos/ai-setup.jpg'
      },
      {
        title: 'Basic Prompt Writing',
        description: 'How to write effective prompts for better results',
        duration: '12:45',
        views: '22.1k',
        difficulty: 'Beginner',
        thumbnail: '/videos/basic-prompts.jpg'
      }
    ]
  },
  {
    title: 'Content Creation Workflows',
    description: 'Master different content types with AI assistance',
    videos: [
      {
        title: 'Blog Post Creation Workflow',
        description: 'Complete process from idea to published post',
        duration: '15:20',
        views: '16.8k',
        difficulty: 'Intermediate',
        thumbnail: '/videos/blog-workflow.jpg'
      },
      {
        title: 'Social Media Content Generation',
        description: 'Create engaging social media posts with AI',
        duration: '10:35',
        views: '14.2k',
        difficulty: 'Intermediate',
        thumbnail: '/videos/social-content.jpg'
      },
      {
        title: 'Email Marketing with AI',
        description: 'Write compelling emails using AI assistance',
        duration: '13:50',
        views: '11.9k',
        difficulty: 'Intermediate',
        thumbnail: '/videos/email-ai.jpg'
      }
    ]
  },
  {
    title: 'Advanced AI Techniques',
    description: 'Advanced strategies for power users',
    videos: [
      {
        title: 'Advanced Prompt Engineering',
        description: 'Complex prompting techniques for better results',
        duration: '18:25',
        views: '9.7k',
        difficulty: 'Advanced',
        thumbnail: '/videos/advanced-prompts.jpg'
      },
      {
        title: 'Custom AI Workflows',
        description: 'Create custom workflows for your specific needs',
        duration: '22:10',
        views: '7.3k',
        difficulty: 'Advanced',
        thumbnail: '/videos/custom-workflows.jpg'
      },
      {
        title: 'AI Content Optimization',
        description: 'Optimize AI-generated content for maximum impact',
        duration: '16:40',
        views: '8.1k',
        difficulty: 'Advanced',
        thumbnail: '/videos/content-optimization.jpg'
      }
    ]
  }
]

const quickTips = [
  {
    icon: Target,
    title: 'Be Specific',
    description: 'The more specific your prompts, the better the AI results'
  },
  {
    icon: Brain,
    title: 'Provide Context',
    description: 'Give the AI context about your audience and goals'
  },
  {
    icon: Zap,
    title: 'Iterate & Refine',
    description: 'Use the AI\'s output as a starting point and refine'
  },
  {
    icon: CheckCircle,
    title: 'Always Review',
    description: 'Review and fact-check all AI-generated content'
  }
]

export default function AIAssistantVideosPage() {
  return (
    <PageLayout>
      <PageHero
        title="AI Assistant Video Tutorials"
        description="Master our AI writing assistant with comprehensive video tutorials. Learn everything from basic prompting to advanced content optimization techniques."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#videos">
              <Play className="mr-2 h-4 w-4" />
              Start Watching
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              <BookOpen className="mr-2 h-4 w-4" />
              All Help Topics
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Quick Tips */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Tips for Success</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Essential tips to get the most out of our AI assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickTips.map((tip, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tip.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Video Series */}
      <ContentSection id="videos" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Video Tutorial Series</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive video tutorials organized by skill level and topic
          </p>
        </div>

        <div className="space-y-12">
          {videoSeries.map((series, seriesIndex) => (
            <div key={seriesIndex}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{series.title}</h3>
                <p className="text-muted-foreground">{series.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {series.videos.map((video, videoIndex) => (
                  <Card key={videoIndex} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                      <Play className="h-12 w-12 text-primary" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          video.difficulty === 'Beginner' ? 'default' : 
                          video.difficulty === 'Intermediate' ? 'secondary' : 
                          'destructive'
                        }>
                          {video.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{video.views}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {video.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{video.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Learning Path */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recommended Learning Path</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow this path to master the AI assistant step by step
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Start with the Basics',
                description: 'Watch the "Getting Started" series to understand core concepts',
                duration: '26 minutes',
                videos: 3
              },
              {
                step: 2,
                title: 'Practice Content Creation',
                description: 'Follow along with workflow tutorials for different content types',
                duration: '40 minutes',
                videos: 3
              },
              {
                step: 3,
                title: 'Master Advanced Techniques',
                description: 'Learn advanced prompting and optimization strategies',
                duration: '57 minutes',
                videos: 3
              },
              {
                step: 4,
                title: 'Apply Your Knowledge',
                description: 'Create your own content using the techniques you\'ve learned',
                duration: 'Ongoing',
                videos: 'Practice'
              }
            ].map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{step.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          <span>{step.videos} videos</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      Start Step {step.step}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Additional Resources */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complement your video learning with these helpful resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Prompt Library',
              description: 'Collection of proven prompts for different content types',
              icon: FileText,
              href: '/resources/ai-toolkit'
            },
            {
              title: 'Written Tutorials',
              description: 'Step-by-step written guides for AI assistant features',
              icon: BookOpen,
              href: '/help/ai-assistant'
            },
            {
              title: 'Community Forum',
              description: 'Ask questions and share tips with other users',
              icon: Users,
              href: '/community'
            }
          ].map((resource, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <resource.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {resource.description}
                </CardDescription>
                <Button variant="outline" asChild className="w-full">
                  <Link href={resource.href}>
                    Explore Resource
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master AI-Powered Content Creation?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our beginner tutorials and work your way up to advanced techniques. Create better content faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#videos">
                <Play className="mr-2 h-4 w-4" />
                Start Learning Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/resources/ai-toolkit">
                <Brain className="mr-2 h-4 w-4" />
                Get AI Toolkit
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
