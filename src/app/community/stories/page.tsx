import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Heart,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Quote,
  Award,
  Target,
  Zap,
  BookOpen,
  MessageCircle,
  Share2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Success Stories - Universal Blog Platform',
  description: 'Real success stories from our community. Discover how creators transformed their content strategy and built amazing audiences.',
}

const featuredStories = [
  {
    name: 'Sarah Chen',
    title: 'Tech Content Creator',
    avatar: '/avatars/sarah-chen.jpg',
    story: 'From 500 to 125k followers in 18 months',
    quote: 'Universal Blog Platform transformed my content strategy. The AI writing assistant helped me create consistent, high-quality content while the analytics showed me exactly what my audience wanted.',
    metrics: {
      followers: '125k',
      growth: '+24,900%',
      revenue: '$85k/month',
      timeframe: '18 months'
    },
    achievements: [
      'Top Tech Influencer 2024',
      '1M+ monthly views',
      'Featured in TechCrunch',
      'Launched successful course'
    ],
    platforms: ['LinkedIn', 'Twitter', 'Medium', 'YouTube'],
    category: 'Tech',
    featured: true
  },
  {
    name: 'Marcus Rodriguez',
    title: 'Marketing Strategist',
    avatar: '/avatars/marcus-rodriguez.jpg',
    story: 'Built a 6-figure consulting business',
    quote: 'The platform\'s automation features saved me 20 hours per week. I could focus on strategy while the platform handled distribution across all my channels.',
    metrics: {
      followers: '89k',
      growth: '+1,680%',
      revenue: '$120k/month',
      timeframe: '14 months'
    },
    achievements: [
      'Marketing Week Top 50',
      '500k+ email subscribers',
      'Best-selling author',
      '6-figure consulting business'
    ],
    platforms: ['LinkedIn', 'Newsletter', 'Podcast', 'Blog'],
    category: 'Marketing',
    featured: true
  },
  {
    name: 'Emma Thompson',
    title: 'Lifestyle Blogger',
    avatar: '/avatars/emma-thompson.jpg',
    story: 'Turned passion into profitable business',
    quote: 'I went from posting randomly to having a strategic content calendar. The templates and scheduling features helped me maintain consistency while growing my audience.',
    metrics: {
      followers: '67k',
      growth: '+1,240%',
      revenue: '$45k/month',
      timeframe: '12 months'
    },
    achievements: [
      'Eco Blogger of the Year',
      '2M+ blog views',
      'Brand partnerships',
      'Product line launch'
    ],
    platforms: ['Instagram', 'Blog', 'TikTok', 'Pinterest'],
    category: 'Lifestyle',
    featured: true
  }
]

const successCategories = [
  {
    category: 'Content Creators',
    count: 45,
    avgGrowth: '+850%',
    icon: Users,
    stories: [
      'YouTuber grew from 1k to 100k subscribers',
      'Blogger increased traffic by 2,000%',
      'Podcaster reached #1 in category'
    ]
  },
  {
    category: 'Business Owners',
    count: 32,
    avgGrowth: '+420%',
    icon: Target,
    stories: [
      'SaaS founder generated 500+ leads/month',
      'E-commerce store increased sales 300%',
      'Consultant built 6-figure business'
    ]
  },
  {
    category: 'Agencies',
    count: 28,
    avgGrowth: '+650%',
    icon: Award,
    stories: [
      'Agency scaled to 50+ clients',
      'Improved client retention by 80%',
      'Increased revenue per client 250%'
    ]
  },
  {
    category: 'Educators',
    count: 38,
    avgGrowth: '+720%',
    icon: BookOpen,
    stories: [
      'Teacher built online course empire',
      'Professor reached 1M+ students',
      'Trainer launched successful academy'
    ]
  }
]

const transformationMetrics = [
  {
    metric: 'Average Follower Growth',
    value: '+680%',
    description: 'Across all success stories'
  },
  {
    metric: 'Time Saved Weekly',
    value: '15+ hours',
    description: 'Through automation features'
  },
  {
    metric: 'Revenue Increase',
    value: '+340%',
    description: 'Average business growth'
  },
  {
    metric: 'Content Consistency',
    value: '95%',
    description: 'Users posting regularly'
  }
]

export default function SuccessStoriesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Success Stories"
        description="Real stories from real creators who transformed their content strategy and built amazing audiences using Universal Blog Platform."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#stories">
              <Heart className="mr-2 h-4 w-4" />
              Read Success Stories
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/community/spotlight">
              <Star className="mr-2 h-4 w-4" />
              Creator Spotlight
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Transformation Metrics */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The results speak for themselves - our community is achieving incredible growth
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {transformationMetrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="font-semibold mb-1">{metric.metric}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Featured Success Stories */}
      <ContentSection id="stories" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the creators who transformed their content strategy and achieved remarkable results
          </p>
        </div>

        <div className="space-y-12">
          {featuredStories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Story Content */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{story.name}</h3>
                        <p className="text-lg text-muted-foreground">{story.title}</p>
                        <Badge variant="secondary" className="mt-1">{story.category}</Badge>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-primary mb-2">{story.story}</h4>
                      <div className="flex items-start gap-3">
                        <Quote className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground italic text-lg leading-relaxed">
                          {story.quote}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">Key Achievements:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {story.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">Platforms Used:</h5>
                        <div className="flex flex-wrap gap-2">
                          {story.platforms.map((platform, platIndex) => (
                            <Badge key={platIndex} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Success Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{story.metrics.followers}</div>
                          <div className="text-sm text-muted-foreground">Total Followers</div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Growth:</span>
                            <span className="font-semibold text-green-600">{story.metrics.growth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="font-semibold">{story.metrics.revenue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timeframe:</span>
                            <span className="font-semibold">{story.metrics.timeframe}</span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Read Full Story
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Success by Category */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Across Industries</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform works for creators and businesses across all industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {successCategories.map((category, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary">{category.count} stories</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-500">
                    {category.avgGrowth}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {category.stories.map((story, storyIndex) => (
                    <li key={storyIndex} className="flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>{story}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Share Your Story */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Share Your Success Story</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have you achieved great results with our platform? We'd love to feature your story!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What We're Looking For:</h3>
                  <ul className="space-y-3">
                    {[
                      'Significant growth in followers or engagement',
                      'Successful business outcomes or revenue growth',
                      'Creative use of platform features',
                      'Inspiring transformation stories',
                      'Willingness to share insights with the community'
                    ].map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Benefits of Being Featured:</h3>
                  <ul className="space-y-3">
                    {[
                      'Increased visibility and exposure',
                      'Professional case study creation',
                      'Social media promotion',
                      'Speaking opportunity invitations',
                      'Exclusive creator events access'
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    <Share2 className="mr-2 h-4 w-4" />
                    Submit Your Story
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've transformed their content strategy and achieved remarkable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                <Zap className="mr-2 h-4 w-4" />
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/community">
                <Users className="mr-2 h-4 w-4" />
                Join Community
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
