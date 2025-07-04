import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Star,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  ExternalLink,
  Award,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Trophy
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Creator Spotlight - Universal Blog Platform',
  description: 'Discover inspiring success stories from our community. Learn from top creators and get featured yourself.',
}

const featuredCreators = [
  {
    name: 'Sarah Chen',
    title: 'Tech Content Creator',
    avatar: '/avatars/sarah-chen.jpg',
    followers: '125k',
    growth: '+340%',
    specialty: 'AI & Machine Learning',
    story: 'From 500 to 125k followers in 18 months using our AI-powered content strategy',
    achievements: ['Top Tech Influencer 2024', '1M+ monthly views', 'Featured in TechCrunch'],
    platforms: ['LinkedIn', 'Twitter', 'Medium', 'YouTube'],
    featured: true
  },
  {
    name: 'Marcus Rodriguez',
    title: 'Marketing Strategist',
    avatar: '/avatars/marcus-rodriguez.jpg',
    followers: '89k',
    growth: '+280%',
    specialty: 'B2B Marketing',
    story: 'Built a 6-figure consulting business through consistent content creation',
    achievements: ['Marketing Week Top 50', '500k+ email subscribers', 'Best-selling author'],
    platforms: ['LinkedIn', 'Newsletter', 'Podcast'],
    featured: true
  },
  {
    name: 'Emma Thompson',
    title: 'Lifestyle Blogger',
    avatar: '/avatars/emma-thompson.jpg',
    followers: '67k',
    growth: '+220%',
    specialty: 'Sustainable Living',
    story: 'Turned passion for sustainability into a thriving content business',
    achievements: ['Eco Blogger of the Year', '2M+ blog views', 'Brand partnerships'],
    platforms: ['Instagram', 'Blog', 'TikTok', 'Pinterest'],
    featured: true
  }
]

const monthlySpotlights = [
  {
    month: 'December 2024',
    creator: 'Alex Kim',
    title: 'Fintech Educator',
    achievement: 'Reached 1M followers across all platforms',
    growth: '+450% in 12 months',
    story: 'Alex transformed complex financial concepts into engaging, accessible content that resonates with millennials and Gen Z.',
    metrics: {
      followers: '1.2M',
      engagement: '8.5%',
      platforms: 6
    }
  },
  {
    month: 'November 2024',
    creator: 'Dr. Lisa Park',
    title: 'Health & Wellness Expert',
    achievement: 'Published bestselling book through content marketing',
    growth: '+320% in 10 months',
    story: 'Dr. Park leveraged our platform to build authority in wellness, leading to a book deal and speaking opportunities.',
    metrics: {
      followers: '890k',
      engagement: '12.3%',
      platforms: 5
    }
  },
  {
    month: 'October 2024',
    creator: 'James Wilson',
    title: 'Startup Founder',
    achievement: 'Raised $2M Series A through thought leadership',
    growth: '+280% in 8 months',
    story: 'James used content marketing to establish credibility and attract investors for his SaaS startup.',
    metrics: {
      followers: '456k',
      engagement: '15.7%',
      platforms: 4
    }
  }
]

const successMetrics = [
  {
    icon: Users,
    label: 'Total Followers',
    value: '2.5M+',
    description: 'Across all featured creators'
  },
  {
    icon: TrendingUp,
    label: 'Average Growth',
    value: '+285%',
    description: 'Year-over-year follower growth'
  },
  {
    icon: Award,
    label: 'Awards Won',
    value: '47',
    description: 'Industry awards and recognitions'
  },
  {
    icon: Trophy,
    label: 'Success Stories',
    value: '150+',
    description: 'Documented success cases'
  }
]

export default function CreatorSpotlightPage() {
  return (
    <PageLayout>
      <PageHero
        title="Creator Spotlight"
        description="Discover inspiring success stories from our community. Learn from top creators who've built amazing audiences and businesses using our platform."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#featured">
              <Star className="mr-2 h-4 w-4" />
              Meet Our Stars
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#nominate">
              Nominate a Creator
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Success Metrics */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Community Success</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our creators are achieving incredible results across all industries and platforms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {successMetrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="font-semibold mb-1">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Featured Creators */}
      <ContentSection id="featured" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Creators</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the creators who are setting the standard for content excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCreators.map((creator, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <Badge className="absolute top-4 right-4" variant="secondary">
                  Featured
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{creator.specialty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{creator.growth}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{creator.name}</CardTitle>
                <CardDescription>{creator.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "{creator.story}"
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Followers:</span>
                    <span className="font-semibold">{creator.followers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platforms:</span>
                    <span className="font-semibold">{creator.platforms.length}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-sm">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {creator.achievements.slice(0, 2).map((achievement, achIndex) => (
                      <li key={achIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                        <Award className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Read Full Story
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Monthly Spotlights */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Monthly Spotlights</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each month we highlight creators who've achieved remarkable milestones
          </p>
        </div>

        <div className="space-y-8">
          {monthlySpotlights.map((spotlight, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{spotlight.month}</Badge>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">{spotlight.growth}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{spotlight.creator}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{spotlight.title}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">{spotlight.achievement}</span>
                    </div>
                    <p className="text-muted-foreground">{spotlight.story}</p>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Followers:</span>
                          <span className="font-semibold">{spotlight.metrics.followers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engagement:</span>
                          <span className="font-semibold">{spotlight.metrics.engagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platforms:</span>
                          <span className="font-semibold">{spotlight.metrics.platforms}</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Profile
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

      {/* Get Featured */}
      <ContentSection id="nominate" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Featured</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Know someone who deserves recognition? Nominate them for our creator spotlight program.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Nomination Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Significant growth using our platform',
                    'Innovative content strategies',
                    'Positive community impact',
                    'Inspiring success story',
                    'Active platform engagement'
                  ].map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Benefits of Being Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Increased visibility and followers',
                    'Professional case study creation',
                    'Speaking opportunity invitations',
                    'Exclusive creator events access',
                    'Priority platform support'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link href="/contact">
                <Star className="mr-2 h-4 w-4" />
                Submit Nomination
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Be Our Next Success Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've transformed their content strategy and built amazing audiences with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                <TrendingUp className="mr-2 h-4 w-4" />
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
