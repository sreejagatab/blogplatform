import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Download,
  BookOpen,
  Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Content Strategy Guide - Universal Blog Platform',
  description: 'Master content strategy with our comprehensive guide. Learn to create, distribute, and optimize content that drives real business results.',
}

const strategyModules = [
  {
    icon: Target,
    title: 'Strategy Foundation',
    description: 'Build a solid foundation for your content strategy',
    lessons: 8,
    duration: '2 hours',
    topics: [
      'Defining your content mission and vision',
      'Setting SMART content goals',
      'Understanding your target audience',
      'Competitive content analysis'
    ]
  },
  {
    icon: Users,
    title: 'Audience Research',
    description: 'Deep dive into understanding your audience',
    lessons: 6,
    duration: '1.5 hours',
    topics: [
      'Creating detailed buyer personas',
      'Content consumption patterns',
      'Platform preferences and behaviors',
      'Pain points and content needs'
    ]
  },
  {
    icon: Lightbulb,
    title: 'Content Ideation',
    description: 'Never run out of content ideas again',
    lessons: 7,
    duration: '2 hours',
    topics: [
      'Systematic idea generation methods',
      'Trend monitoring and analysis',
      'Content gap identification',
      'Seasonal content planning'
    ]
  },
  {
    icon: Calendar,
    title: 'Content Planning',
    description: 'Plan and organize your content for maximum impact',
    lessons: 9,
    duration: '2.5 hours',
    topics: [
      'Editorial calendar creation',
      'Content pillar development',
      'Cross-platform content adaptation',
      'Resource allocation and budgeting'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Distribution Strategy',
    description: 'Get your content in front of the right people',
    lessons: 10,
    duration: '3 hours',
    topics: [
      'Platform-specific optimization',
      'Organic vs. paid distribution',
      'Influencer collaboration strategies',
      'Community building tactics'
    ]
  },
  {
    icon: BarChart3,
    title: 'Performance Optimization',
    description: 'Measure, analyze, and improve your content performance',
    lessons: 8,
    duration: '2 hours',
    topics: [
      'Key performance indicators (KPIs)',
      'Analytics setup and tracking',
      'A/B testing methodologies',
      'Continuous improvement processes'
    ]
  }
]

const bonusResources = [
  {
    icon: Download,
    title: 'Content Strategy Template Pack',
    description: 'Ready-to-use templates for planning and executing your strategy',
    type: 'Templates'
  },
  {
    icon: BookOpen,
    title: 'Industry Case Studies',
    description: '10 real-world examples of successful content strategies',
    type: 'Case Studies'
  },
  {
    icon: Zap,
    title: 'Quick-Start Checklist',
    description: 'Step-by-step checklist to implement your strategy in 30 days',
    type: 'Checklist'
  }
]

export default function ContentStrategyPage() {
  return (
    <PageLayout>
      <PageHero
        title="Master Content Strategy"
        description="Learn to create, distribute, and optimize content that drives real business results. Our comprehensive guide covers everything from strategy foundation to performance optimization."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#modules">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources/downloads">
              <Download className="mr-2 h-4 w-4" />
              Download Templates
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Course Overview */}
      <ContentSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">What You'll Learn</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Build a comprehensive content strategy that aligns with your business goals
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Understand your audience deeply and create content that resonates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Develop systematic processes for content ideation and planning
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Master multi-platform distribution and optimization strategies
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Measure and improve your content performance with data-driven insights
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Lessons:</span>
                  <span className="font-semibold">48 lessons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">13 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-semibold">Beginner to Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-semibold">Video + Templates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Access:</span>
                  <span className="font-semibold">Lifetime</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/signup">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Free
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>

      {/* Course Modules */}
      <ContentSection id="modules" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Course Modules</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six comprehensive modules covering every aspect of content strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strategyModules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Module {index + 1}
                    </Badge>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{module.lessons} lessons</span>
                  <span>•</span>
                  <span>{module.duration}</span>
                </div>
                <ul className="space-y-2">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Bonus Resources */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Bonus Resources</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Additional resources to accelerate your content strategy implementation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bonusResources.map((resource, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-secondary">
                    <resource.icon className="h-8 w-8 text-secondary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <Badge variant="outline" className="mt-2">{resource.type}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {resource.description}
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Testimonials */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from content creators who've implemented our strategies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Marketing Director',
              company: 'TechStart Inc.',
              quote: 'This strategy guide transformed our content approach. We saw a 300% increase in engagement within 3 months.',
              avatar: '/avatars/sarah.jpg'
            },
            {
              name: 'Mike Chen',
              role: 'Content Creator',
              company: 'Independent',
              quote: 'The systematic approach to content planning saved me hours every week. My content quality improved dramatically.',
              avatar: '/avatars/mike.jpg'
            },
            {
              name: 'Emily Rodriguez',
              role: 'Brand Manager',
              company: 'Fashion Forward',
              quote: 'The audience research module was a game-changer. We finally understood what our customers really wanted.',
              avatar: '/avatars/emily.jpg'
            }
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of content creators who've already implemented our proven strategies and seen real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Learning Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/resources/downloads">
                <Download className="mr-2 h-4 w-4" />
                Download Templates
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
