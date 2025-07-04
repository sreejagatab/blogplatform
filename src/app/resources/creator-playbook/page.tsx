import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Download, 
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Target
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Ultimate Creator Playbook',
  description: 'Comprehensive guide to building, growing, and monetizing your content creation business.',
}

const chapters = [
  {
    number: 1,
    title: 'Foundation: Setting Up for Success',
    pages: 24,
    topics: ['Defining your niche', 'Brand identity creation', 'Goal setting framework', 'Essential tools setup']
  },
  {
    number: 2,
    title: 'Content Strategy & Planning',
    pages: 32,
    topics: ['Content pillars', 'Editorial calendar', 'Audience research', 'Platform-specific strategies']
  },
  {
    number: 3,
    title: 'Creation & Optimization',
    pages: 28,
    topics: ['Content creation workflows', 'AI-powered tools', 'SEO optimization', 'Visual design principles']
  },
  {
    number: 4,
    title: 'Distribution & Growth',
    pages: 35,
    topics: ['Multi-platform publishing', 'Community building', 'Collaboration strategies', 'Viral content tactics']
  },
  {
    number: 5,
    title: 'Analytics & Optimization',
    pages: 22,
    topics: ['Performance tracking', 'Data interpretation', 'A/B testing', 'ROI measurement']
  },
  {
    number: 6,
    title: 'Monetization Strategies',
    pages: 30,
    topics: ['Revenue streams', 'Sponsorship deals', 'Product creation', 'Service offerings']
  }
]

const bonuses = [
  {
    title: 'Content Calendar Templates',
    description: '12 months of pre-planned content ideas and posting schedules',
    format: 'Excel & Google Sheets'
  },
  {
    title: 'Brand Kit Templates',
    description: 'Professional design templates for logos, banners, and social media',
    format: 'Figma & Canva'
  },
  {
    title: 'Email Scripts Library',
    description: 'Proven email templates for outreach, partnerships, and sales',
    format: 'PDF & Text'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Custom spreadsheet for tracking all your key metrics',
    format: 'Excel & Google Sheets'
  }
]

export default function CreatorPlaybookPage() {
  return (
    <PageLayout>
      <PageHero
        title="The Ultimate Creator Playbook"
        description="Your complete guide to building, growing, and monetizing a successful content creation business."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Playbook Overview */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-blue-600">Free Resource</Badge>
                  <h2 className="text-3xl font-bold mb-4">171-Page Comprehensive Guide</h2>
                  <p className="text-lg mb-6">
                    Everything you need to know about building a successful content creation business, 
                    from strategy to monetization. Written by industry experts and successful creators.
                  </p>
                  <div className="flex gap-4">
                    <Button size="lg">
                      <Download className="mr-2 h-4 w-4" />
                      Download Free
                    </Button>
                    <Button size="lg" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-4">What's Inside</h3>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">171</div>
                      <p className="text-sm text-muted-foreground">Pages</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">6</div>
                      <p className="text-sm text-muted-foreground">Chapters</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <p className="text-sm text-muted-foreground">Templates</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">25+</div>
                      <p className="text-sm text-muted-foreground">Case Studies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">4.9/5</span>
                    <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter Breakdown */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Chapter Breakdown</h2>
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {chapter.number}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold">{chapter.title}</h3>
                          <Badge variant="outline">{chapter.pages} pages</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                          {chapter.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bonus Materials */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Bonus Materials Included</CardTitle>
              <CardDescription>
                Additional resources to accelerate your success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{bonus.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{bonus.description}</p>
                    <Badge variant="outline">{bonus.format}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Who It's For */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Who This Playbook Is For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">New Creators</h3>
                  <p className="text-sm text-muted-foreground">
                    Just starting your content creation journey and need a roadmap to success
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Growing Creators</h3>
                  <p className="text-sm text-muted-foreground">
                    Have some traction but want to scale and optimize your content strategy
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Business Owners</h3>
                  <p className="text-sm text-muted-foreground">
                    Want to leverage content marketing to grow your business and brand
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="mb-16 bg-muted/30">
            <CardHeader>
              <CardTitle>What Creators Are Saying</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm mb-3">
                    "This playbook completely transformed my approach to content creation. 
                    I went from 1K to 50K followers in 6 months using these strategies."
                  </p>
                  <p className="text-sm font-medium">- Jessica M., Lifestyle Creator</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm mb-3">
                    "The monetization chapter alone paid for itself 10x over. 
                    Clear, actionable advice that actually works."
                  </p>
                  <p className="text-sm font-medium">- David L., Tech Reviewer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your Creator Journey Today</h2>
              <p className="mb-6 opacity-90">
                Download the Ultimate Creator Playbook and get everything you need to build a successful content business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Free Playbook
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Preview First Chapter
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                No email required • Instant download • 171 pages of actionable content
              </p>
            </CardContent>
          </Card>

          {/* More Resources */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">More Creator Resources</h2>
            <p className="text-muted-foreground mb-6">
              Explore our other resources to accelerate your content creation journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/podcast">
                  Creator Podcast
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community">
                  Join Community
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
