import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Star,
  Video,
  Mic,
  BookOpen,
  Award,
  Coffee,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events - Universal Blog Platform',
  description: 'Join our community events, workshops, and networking sessions. Learn from experts and connect with fellow creators.',
}

const upcomingEvents = [
  {
    id: 'ai-workshop-dec',
    title: 'AI Content Creation Workshop',
    description: 'Master AI-powered content creation with hands-on exercises and expert guidance',
    date: 'December 15, 2024',
    time: '2:00 PM - 5:00 PM EST',
    duration: '3 hours',
    type: 'Workshop',
    format: 'Virtual',
    price: 'Free',
    attendees: 245,
    maxAttendees: 500,
    instructor: 'Sarah Chen, AI Content Expert',
    featured: true,
    topics: ['AI Prompting', 'Content Optimization', 'Quality Control', 'Best Practices']
  },
  {
    id: 'creator-spotlight-dec',
    title: 'Creator Spotlight: Building Your Brand',
    description: 'Learn from successful creators who built million-follower audiences',
    date: 'December 18, 2024',
    time: '1:00 PM - 2:30 PM EST',
    duration: '90 minutes',
    type: 'Panel',
    format: 'Virtual',
    price: 'Free',
    attendees: 189,
    maxAttendees: 1000,
    instructor: 'Top Creator Panel',
    featured: true,
    topics: ['Personal Branding', 'Audience Building', 'Monetization', 'Content Strategy']
  },
  {
    id: 'office-hours-dec',
    title: 'December Office Hours',
    description: 'Monthly Q&A session with our team and community experts',
    date: 'December 20, 2024',
    time: '3:00 PM - 4:30 PM EST',
    duration: '90 minutes',
    type: 'Q&A',
    format: 'Virtual',
    price: 'Free',
    attendees: 156,
    maxAttendees: 1000,
    instructor: 'Universal Blog Team',
    featured: false,
    topics: ['Platform Updates', 'Feature Requests', 'Technical Support', 'Community Discussion']
  }
]

const eventTypes = [
  {
    icon: Brain,
    title: 'Workshops',
    description: 'Hands-on learning sessions with expert instructors',
    frequency: 'Weekly',
    duration: '2-4 hours',
    format: 'Interactive'
  },
  {
    icon: Users,
    title: 'Networking Events',
    description: 'Connect with fellow creators and industry professionals',
    frequency: 'Monthly',
    duration: '1-2 hours',
    format: 'Social'
  },
  {
    icon: Mic,
    title: 'Expert Talks',
    description: 'Learn from industry leaders and successful creators',
    frequency: 'Bi-weekly',
    duration: '60-90 minutes',
    format: 'Presentation'
  },
  {
    icon: Coffee,
    title: 'Office Hours',
    description: 'Direct access to our team for questions and support',
    frequency: 'Monthly',
    duration: '90 minutes',
    format: 'Open Q&A'
  }
]

const pastEvents = [
  {
    title: 'Content Analytics Masterclass',
    date: 'November 28, 2024',
    attendees: 342,
    rating: 4.9,
    recording: true
  },
  {
    title: 'Social Media Automation Workshop',
    date: 'November 21, 2024',
    attendees: 298,
    rating: 4.8,
    recording: true
  },
  {
    title: 'Creator Success Stories Panel',
    date: 'November 14, 2024',
    attendees: 456,
    rating: 4.7,
    recording: true
  }
]

export default function EventsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Community Events"
        description="Join our workshops, networking events, and expert talks. Learn from industry leaders, connect with fellow creators, and grow your skills."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#upcoming">
              <Calendar className="mr-2 h-4 w-4" />
              View Upcoming Events
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/events/register">
              Register for Events
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Event Types */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Types of Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We offer various types of events to meet different learning needs and interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((type, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <type.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {type.description}
                </CardDescription>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium">{type.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{type.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">{type.format}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Upcoming Events */}
      <ContentSection id="upcoming" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Register for upcoming events and mark your calendar
          </p>
        </div>

        <div className="space-y-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${event.featured ? 'border-primary' : ''}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant={event.featured ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                      <Badge variant="outline">{event.format}</Badge>
                      <Badge variant="outline" className="text-green-700 border-green-500">
                        {event.price}
                      </Badge>
                      {event.featured && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{event.description}</p>
                    <p className="text-sm text-muted-foreground mb-4">Instructor: {event.instructor}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Topics covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {Math.round((event.attendees / event.maxAttendees) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Capacity</div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button className="w-full mb-2" asChild>
                          <Link href={`/events/${event.id}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/events/register">
                            Register Free
                          </Link>
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

      {/* Past Events */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Past Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Catch up on events you missed with recordings and highlights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Recorded</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>{event.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} attended</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Watch Recording
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/help/videos">
              <ArrowRight className="mr-2 h-4 w-4" />
              View All Recordings
            </Link>
          </Button>
        </div>
      </ContentSection>

      {/* Event Benefits */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Attend Our Events?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who've accelerated their growth through our events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: 'Accelerated Learning',
              description: 'Learn from experts and get hands-on experience with advanced techniques'
            },
            {
              icon: Users,
              title: 'Network Building',
              description: 'Connect with like-minded creators and potential collaboration partners'
            },
            {
              icon: Award,
              title: 'Exclusive Access',
              description: 'Get early access to new features and insider tips from our team'
            },
            {
              icon: BookOpen,
              title: 'Practical Skills',
              description: 'Walk away with actionable strategies you can implement immediately'
            },
            {
              icon: Video,
              title: 'Lifetime Access',
              description: 'All events are recorded and available for future reference'
            },
            {
              icon: Zap,
              title: 'Free Resources',
              description: 'Receive exclusive templates, guides, and tools at every event'
            }
          ].map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Next Event?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on valuable learning opportunities and networking with fellow creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/events/register">
                <Calendar className="mr-2 h-4 w-4" />
                Register for Events
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
