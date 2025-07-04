import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Share2,
  Download,
  Palette,
  Image,
  Type,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Social Media Kit - Universal Blog Platform',
  description: 'Complete social media toolkit with templates, graphics, and content ideas for all major platforms.',
}

const platformKits = [
  {
    platform: 'Instagram',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    items: [
      'Story templates (20 designs)',
      'Post templates (15 layouts)',
      'Highlight covers (10 sets)',
      'Carousel templates (8 designs)',
      'IGTV thumbnails (5 styles)'
    ],
    downloads: '45.2k',
    rating: 4.9
  },
  {
    platform: 'LinkedIn',
    color: 'bg-blue-600',
    items: [
      'Professional post templates (12 designs)',
      'Article header graphics (8 styles)',
      'Company page banners (6 templates)',
      'Event graphics (10 designs)',
      'Infographic templates (5 layouts)'
    ],
    downloads: '32.8k',
    rating: 4.8
  },
  {
    platform: 'Twitter',
    color: 'bg-sky-500',
    items: [
      'Tweet graphics (15 templates)',
      'Header banners (8 designs)',
      'Thread templates (10 layouts)',
      'Quote graphics (12 styles)',
      'Poll graphics (6 templates)'
    ],
    downloads: '28.7k',
    rating: 4.7
  },
  {
    platform: 'Facebook',
    color: 'bg-blue-700',
    items: [
      'Post templates (18 designs)',
      'Cover photos (10 templates)',
      'Event graphics (12 layouts)',
      'Story templates (15 designs)',
      'Ad templates (8 styles)'
    ],
    downloads: '38.1k',
    rating: 4.8
  },
  {
    platform: 'TikTok',
    color: 'bg-black',
    items: [
      'Video thumbnails (20 templates)',
      'Text overlays (25 styles)',
      'Transition graphics (15 designs)',
      'Hashtag graphics (10 templates)',
      'Challenge graphics (8 layouts)'
    ],
    downloads: '22.4k',
    rating: 4.6
  },
  {
    platform: 'YouTube',
    color: 'bg-red-600',
    items: [
      'Thumbnail templates (25 designs)',
      'Channel art (8 templates)',
      'End screen graphics (10 layouts)',
      'Video intro templates (5 styles)',
      'Playlist covers (12 designs)'
    ],
    downloads: '41.3k',
    rating: 4.9
  }
]

const contentTypes = [
  {
    icon: Image,
    title: 'Visual Templates',
    description: 'Ready-to-use graphics and design templates',
    count: '200+',
    items: ['Post templates', 'Story designs', 'Banner graphics', 'Icon sets']
  },
  {
    icon: Type,
    title: 'Content Templates',
    description: 'Proven copy templates for different post types',
    count: '150+',
    items: ['Caption templates', 'Bio templates', 'CTA templates', 'Hashtag sets']
  },
  {
    icon: Calendar,
    title: 'Content Calendar',
    description: 'Pre-planned content ideas and posting schedules',
    count: '365',
    items: ['Daily post ideas', 'Seasonal content', 'Holiday posts', 'Trending topics']
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategies',
    description: 'Proven tactics to grow your social media presence',
    count: '50+',
    items: ['Engagement tactics', 'Hashtag strategies', 'Posting schedules', 'Growth hacks']
  }
]

export default function SocialKitPage() {
  return (
    <PageLayout>
      <PageHero
        title="Social Media Kit"
        description="Everything you need to create stunning social media content. Get templates, graphics, content ideas, and growth strategies for all major platforms."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#platforms">
              <Download className="mr-2 h-4 w-4" />
              Download Kit
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources/templates">
              <Palette className="mr-2 h-4 w-4" />
              Browse Templates
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Kit Overview */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What's Included</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive collection of resources for every major social media platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contentTypes.map((type, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <Badge variant="secondary" className="mt-2">{type.count} items</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {type.description}
                </CardDescription>
                <ul className="space-y-2 text-sm">
                  {type.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Platform Kits */}
      <ContentSection id="platforms" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform-Specific Kits</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tailored resources for each social media platform's unique requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformKits.map((kit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`h-20 ${kit.color} flex items-center justify-center relative`}>
                <h3 className="text-2xl font-bold text-white">{kit.platform}</h3>
                <div className="absolute top-2 right-2 flex items-center gap-1 text-white">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm">{kit.rating}</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{kit.platform} Kit</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{kit.downloads}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {kit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download {kit.platform} Kit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Content Calendar Preview */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">30-Day Content Calendar</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Never run out of content ideas with our pre-planned 30-day calendar
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">365</div>
                  <div className="text-lg font-semibold mb-1">Content Ideas</div>
                  <div className="text-sm text-muted-foreground">One for every day</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">12</div>
                  <div className="text-lg font-semibold mb-1">Monthly Themes</div>
                  <div className="text-sm text-muted-foreground">Seasonal content</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-lg font-semibold mb-1">Holidays Covered</div>
                  <div className="text-sm text-muted-foreground">Never miss an opportunity</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-4">Sample Week Preview:</h4>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-sm">
                  {[
                    'Monday: Motivation Quote',
                    'Tuesday: Tutorial Tuesday',
                    'Wednesday: Behind the Scenes',
                    'Thursday: Throwback Thursday',
                    'Friday: Feature Friday',
                    'Saturday: Saturday Spotlight',
                    'Sunday: Sunday Reflection'
                  ].map((day, index) => (
                    <div key={index} className="p-2 bg-background rounded text-center">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* Growth Strategies */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Proven Growth Strategies</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn the tactics that successful creators use to grow their following
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Engagement Optimization',
              strategies: [
                'Best posting times for each platform',
                'Hashtag research and strategy',
                'Community engagement tactics',
                'Cross-platform promotion'
              ]
            },
            {
              title: 'Content Performance',
              strategies: [
                'A/B testing templates',
                'Analytics tracking sheets',
                'Performance benchmarks',
                'Optimization checklists'
              ]
            },
            {
              title: 'Audience Building',
              strategies: [
                'Target audience research templates',
                'Collaboration outreach scripts',
                'Influencer partnership guides',
                'Community building tactics'
              ]
            },
            {
              title: 'Monetization Methods',
              strategies: [
                'Sponsored post templates',
                'Product promotion strategies',
                'Affiliate marketing guides',
                'Service offering templates'
              ]
            }
          ].map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.strategies.map((strategy, strategyIndex) => (
                    <li key={strategyIndex} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* How to Use */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How to Use the Social Kit</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the most out of your social media kit with these simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Download & Customize',
              description: 'Download the templates and customize them with your brand colors, fonts, and content',
              icon: Download
            },
            {
              step: '2',
              title: 'Plan Your Content',
              description: 'Use the content calendar to plan your posts and maintain consistency',
              icon: Calendar
            },
            {
              step: '3',
              title: 'Track & Optimize',
              description: 'Monitor performance and optimize your strategy using our growth tactics',
              icon: TrendingUp
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
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get instant access to our complete social media kit and start creating professional content today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                <Download className="mr-2 h-4 w-4" />
                Download Complete Kit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/resources">
                <ArrowRight className="mr-2 h-4 w-4" />
                Browse All Resources
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
