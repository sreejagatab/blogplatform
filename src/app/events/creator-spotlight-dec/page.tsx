import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Users,
  MapPin,
  Star,
  ArrowRight,
  Video,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Creator Spotlight: Building a Personal Brand',
  description: 'Join Sarah Chen, CEO of Universal Blog Platform, for an exclusive webinar on building a personal brand.',
}

export default function CreatorSpotlightPage() {
  return (
    <PageLayout>
      <PageHero
        title="Creator Spotlight: Building a Personal Brand"
        description="Learn from successful creators who have built powerful personal brands using content distribution strategies."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Event Details */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Badge className="mb-4">Upcoming Event</Badge>
                  <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>December 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>2:00 PM - 3:30 PM EST</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Online Webinar (Zoom)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>250 registered attendees</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/events/register?event=creator-spotlight-dec">
                        <Video className="mr-2 h-4 w-4" />
                        Register for Free
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">What You'll Learn</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">How to define your unique brand voice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">Content strategies that build authority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">Cross-platform brand consistency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">Monetizing your personal brand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">Building authentic audience relationships</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Speaker */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Featured Speaker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/speakers/sarah-chen.jpg" alt="Sarah Chen" />
                  <AvatarFallback className="text-lg">SC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Sarah Chen</h3>
                  <p className="text-primary font-medium mb-3">CEO & Co-founder, Universal Blog Platform</p>
                  <p className="text-muted-foreground mb-4">
                    Sarah is a serial entrepreneur and content strategist who has helped thousands of creators 
                    build successful personal brands. She previously founded two successful startups and has 
                    been featured in Forbes, TechCrunch, and Entrepreneur Magazine.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">1M+</span>
                      <p className="text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <span className="font-medium">500+</span>
                      <p className="text-muted-foreground">Creators Mentored</p>
                    </div>
                    <div>
                      <span className="font-medium">10+</span>
                      <p className="text-muted-foreground">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Event Agenda</CardTitle>
              <CardDescription>90 minutes of actionable insights and Q&A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">2:00 PM</div>
                  <div>
                    <h4 className="font-semibold">Welcome & Introductions</h4>
                    <p className="text-sm text-muted-foreground">Event overview and speaker introduction</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">2:10 PM</div>
                  <div>
                    <h4 className="font-semibold">Defining Your Brand Identity</h4>
                    <p className="text-sm text-muted-foreground">Discovering your unique voice and positioning</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">2:30 PM</div>
                  <div>
                    <h4 className="font-semibold">Content Strategy for Brand Building</h4>
                    <p className="text-sm text-muted-foreground">Creating content that reinforces your brand</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">2:50 PM</div>
                  <div>
                    <h4 className="font-semibold">Cross-Platform Consistency</h4>
                    <p className="text-sm text-muted-foreground">Maintaining brand voice across all channels</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">3:10 PM</div>
                  <div>
                    <h4 className="font-semibold">Live Q&A Session</h4>
                    <p className="text-sm text-muted-foreground">Get your questions answered by Sarah</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 text-sm font-medium text-primary">3:30 PM</div>
                  <div>
                    <h4 className="font-semibold">Wrap-up & Next Steps</h4>
                    <p className="text-sm text-muted-foreground">Key takeaways and resources</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration CTA */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Don't Miss This Opportunity</h2>
              <p className="text-muted-foreground mb-6">
                Join 250+ creators for this exclusive session on building a powerful personal brand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/events/register?event=creator-spotlight-dec">
                    <Video className="mr-2 h-4 w-4" />
                    Register Now - Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/community/questions">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Ask Questions
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Can't attend live? Register to receive the recording.
              </p>
            </CardContent>
          </Card>

          {/* More Events */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">More Upcoming Events</h2>
            <p className="text-muted-foreground mb-6">
              Check out our other upcoming events and workshops.
            </p>
            <Button variant="outline" asChild>
              <Link href="/community">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
