'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Mail, 
  ArrowRight,
  ExternalLink,
  Eye
} from 'lucide-react'
import Link from 'next/link'

// Note: Metadata moved to layout.tsx since this is now a client component

const newsletters = [
  {
    title: 'AI Content Revolution: December 2024 Updates',
    date: '2024-12-20',
    type: 'Product Updates',
    excerpt: 'Discover the latest AI writing features, new platform integrations, and year-end insights.',
    views: '2.3k',
    featured: true
  },
  {
    title: 'Creator Spotlight: Building a Million-View Strategy',
    date: '2024-12-15',
    type: 'Creator Tips',
    excerpt: 'Learn from top creators who have achieved massive reach using our platform.',
    views: '1.8k',
    featured: false
  },
  {
    title: 'Platform Expansion: 50+ New Integrations',
    date: '2024-12-10',
    type: 'Product Updates',
    excerpt: 'We\'ve added support for 50+ new platforms including emerging social networks.',
    views: '2.1k',
    featured: false
  },
  {
    title: 'Content Trends Report: What\'s Working in 2024',
    date: '2024-12-05',
    type: 'Industry News',
    excerpt: 'Comprehensive analysis of content performance across all major platforms.',
    views: '3.2k',
    featured: false
  },
  {
    title: 'Team Collaboration Features Launch',
    date: '2024-11-30',
    type: 'Product Updates',
    excerpt: 'New workflow management and approval features for content teams.',
    views: '1.5k',
    featured: false
  },
  {
    title: 'Black Friday Success Stories',
    date: '2024-11-25',
    type: 'Creator Tips',
    excerpt: 'How creators maximized their reach during the holiday shopping season.',
    views: '1.9k',
    featured: false
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Product Updates': return 'bg-blue-100 text-blue-800'
    case 'Creator Tips': return 'bg-green-100 text-green-800'
    case 'Industry News': return 'bg-purple-100 text-purple-800'
    case 'Company News': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function NewsletterArchivePage() {
  return (
    <PageLayout>
      <PageHero
        title="Newsletter Archive"
        description="Browse past issues of our newsletter to catch up on product updates, creator tips, and industry insights."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Subscribe CTA */}
          <Card className="mb-12 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Don't Miss Future Issues
              </CardTitle>
              <CardDescription>
                Subscribe to get the latest updates delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/newsletter">
                  Subscribe Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Newsletter Issues */}
          <div className="space-y-6">
            {newsletters.map((newsletter, index) => (
              <Card key={index} className={newsletter.featured ? 'border-primary shadow-md' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getTypeColor(newsletter.type)}>
                          {newsletter.type}
                        </Badge>
                        {newsletter.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(newsletter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{newsletter.title}</CardTitle>
                      <CardDescription className="text-base">
                        {newsletter.excerpt}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {newsletter.views} views
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/newsletter/archive/${newsletter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                          <Eye className="mr-2 h-3 w-3" />
                          Read Online
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: newsletter.title,
                              text: newsletter.excerpt,
                              url: window.location.href
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.href)
                            alert('Link copied to clipboard!')
                          }
                        }}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                // In a real app, this would load more newsletters from an API
                alert('Loading more newsletters... (This would fetch more data in a real application)')
              }}
            >
              Load More Issues
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Newsletter Stats */}
          <Card className="mt-16">
            <CardHeader>
              <CardTitle>Newsletter Stats</CardTitle>
              <CardDescription>
                Our newsletter by the numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">48</div>
                  <p className="text-sm text-muted-foreground">Issues Published</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">92%</div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
                  <p className="text-sm text-muted-foreground">Reader Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribe Again */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of creators who rely on our newsletter for the latest insights.
            </p>
            <Button size="lg" asChild>
              <Link href="/newsletter">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe to Newsletter
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
