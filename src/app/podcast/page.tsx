import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  Play, 
  Calendar,
  Users,
  ArrowRight,
  ExternalLink,
  Star,
  Download
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Content Creator Podcast',
  description: 'Weekly insights, interviews, and strategies for modern content creators and digital marketers.',
}

const recentEpisodes = [
  {
    number: 47,
    title: 'AI-Powered Content Creation: The Future is Now',
    guest: 'Dr. Emily Rodriguez, AI Research Director',
    duration: '42 min',
    date: '2024-12-20',
    description: 'Exploring how AI is revolutionizing content creation and what creators need to know.',
    featured: true
  },
  {
    number: 46,
    title: 'Building a Million-Dollar Personal Brand',
    guest: 'Marcus Thompson, Entrepreneur',
    duration: '38 min',
    date: '2024-12-13',
    description: 'From zero to seven figures: A complete guide to monetizing your personal brand.',
    featured: false
  },
  {
    number: 45,
    title: 'Cross-Platform Content Strategy That Works',
    guest: 'Lisa Park, Social Media Strategist',
    duration: '35 min',
    date: '2024-12-06',
    description: 'How to adapt your content for maximum impact across all major platforms.',
    featured: false
  },
  {
    number: 44,
    title: 'The Psychology of Viral Content',
    guest: 'Dr. James Wilson, Behavioral Psychologist',
    duration: '41 min',
    date: '2024-11-29',
    description: 'Understanding what makes content shareable and how to apply these principles.',
    featured: false
  }
]

const platforms = [
  { name: 'Apple Podcasts', icon: '🎧', url: '#' },
  { name: 'Spotify', icon: '🎵', url: '#' },
  { name: 'Google Podcasts', icon: '📻', url: '#' },
  { name: 'YouTube', icon: '📺', url: '#' }
]

export default function PodcastPage() {
  return (
    <PageLayout>
      <PageHero
        title="The Content Creator Podcast"
        description="Weekly insights, interviews, and strategies for modern content creators and digital marketers."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Podcast Info */}
          <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Mic className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Weekly Episodes</h2>
                      <p className="text-muted-foreground">Every Thursday at 6 AM EST</p>
                    </div>
                  </div>
                  <p className="text-lg mb-6">
                    Join host Sarah Chen as she interviews industry experts, shares actionable strategies, 
                    and explores the latest trends in content creation and digital marketing.
                  </p>
                  <div className="flex gap-4">
                    <Button size="lg">
                      <Play className="mr-2 h-4 w-4" />
                      Listen Now
                    </Button>
                    <Button size="lg" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Subscribe
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-4">Podcast Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">47</div>
                      <p className="text-sm text-muted-foreground">Episodes</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">25k+</div>
                      <p className="text-sm text-muted-foreground">Monthly Listeners</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">4.8</div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">150+</div>
                      <p className="text-sm text-muted-foreground">Countries</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listen On */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Listen On Your Favorite Platform</CardTitle>
              <CardDescription>
                Available on all major podcast platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform, index) => (
                  <Button key={index} variant="outline" className="h-16 flex flex-col gap-2" asChild>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm">{platform.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Episodes */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Recent Episodes</h2>
            <div className="space-y-6">
              {recentEpisodes.map((episode, index) => (
                <Card key={index} className={episode.featured ? 'border-primary shadow-md' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">#{episode.number}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{episode.title}</h3>
                            <p className="text-muted-foreground">with {episode.guest}</p>
                          </div>
                          <div className="flex gap-2">
                            {episode.featured && <Badge>Featured</Badge>}
                            <Badge variant="outline">{episode.duration}</Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{episode.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(episode.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Play className="mr-2 h-3 w-3" />
                              Play
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Host */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Meet Your Host</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">SC</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Sarah Chen</h3>
                  <p className="text-primary font-medium mb-3">CEO & Co-founder, Universal Blog Platform</p>
                  <p className="text-muted-foreground mb-4">
                    Sarah is a serial entrepreneur and content strategist who has helped thousands of creators 
                    build successful businesses. With over 10 years in the industry, she brings deep insights 
                    and practical advice to every episode.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">10+</span>
                      <p className="text-muted-foreground">Years Experience</p>
                    </div>
                    <div>
                      <span className="font-medium">2</span>
                      <p className="text-muted-foreground">Successful Exits</p>
                    </div>
                    <div>
                      <span className="font-medium">50k+</span>
                      <p className="text-muted-foreground">Creators Helped</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribe CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Never Miss an Episode</h2>
              <p className="mb-6 opacity-90">
                Subscribe to get notified when new episodes are released every Thursday.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Mic className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Star className="mr-2 h-4 w-4" />
                  Leave a Review
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Available on Apple Podcasts, Spotify, and all major platforms
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
                <Link href="/docs">
                  Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community">
                  Community Events
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
