import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  MessageCircle,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Mic,
  Video,
  HelpCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Q&A Sessions - Universal Blog Platform',
  description: 'Join our live Q&A sessions with experts and community members. Get your questions answered and learn from others.',
}

const upcomingSessions = [
  {
    title: 'AI Content Creation Masterclass',
    host: 'Sarah Chen, AI Content Expert',
    date: 'December 15, 2024',
    time: '2:00 PM EST',
    duration: '60 minutes',
    attendees: 245,
    maxAttendees: 500,
    topics: ['Advanced AI prompting', 'Content optimization', 'Quality control', 'Best practices'],
    type: 'Expert Session',
    featured: true
  },
  {
    title: 'Building Your Personal Brand',
    host: 'Marcus Rodriguez, Brand Strategist',
    date: 'December 18, 2024',
    time: '1:00 PM EST',
    duration: '45 minutes',
    attendees: 189,
    maxAttendees: 300,
    topics: ['Brand positioning', 'Content strategy', 'Audience building', 'Monetization'],
    type: 'Strategy Session',
    featured: true
  },
  {
    title: 'Community Office Hours',
    host: 'Universal Blog Team',
    date: 'December 20, 2024',
    time: '3:00 PM EST',
    duration: '90 minutes',
    attendees: 156,
    maxAttendees: 1000,
    topics: ['Platform updates', 'Feature requests', 'Technical support', 'Open discussion'],
    type: 'Office Hours',
    featured: false
  }
]

const pastSessions = [
  {
    title: 'Social Media Automation Strategies',
    host: 'Emma Thompson',
    date: 'November 28, 2024',
    attendees: 342,
    rating: 4.9,
    recording: true,
    highlights: ['Automation workflows', 'Platform-specific strategies', 'ROI measurement']
  },
  {
    title: 'Content Analytics Deep Dive',
    host: 'Dr. Lisa Park',
    date: 'November 21, 2024',
    attendees: 298,
    rating: 4.8,
    recording: true,
    highlights: ['KPI selection', 'Data interpretation', 'Performance optimization']
  },
  {
    title: 'Beginner\'s Guide to Content Planning',
    host: 'James Wilson',
    date: 'November 14, 2024',
    attendees: 456,
    rating: 4.7,
    recording: true,
    highlights: ['Editorial calendars', 'Content pillars', 'Batch creation']
  }
]

const sessionTypes = [
  {
    icon: Lightbulb,
    title: 'Expert Sessions',
    description: 'Deep dives with industry experts on specialized topics',
    frequency: 'Weekly',
    duration: '60-90 minutes',
    format: 'Presentation + Q&A'
  },
  {
    icon: Users,
    title: 'Community Discussions',
    description: 'Open discussions led by community members',
    frequency: 'Bi-weekly',
    duration: '45 minutes',
    format: 'Discussion + Networking'
  },
  {
    icon: HelpCircle,
    title: 'Office Hours',
    description: 'Direct access to our team for questions and support',
    frequency: 'Monthly',
    duration: '90 minutes',
    format: 'Open Q&A'
  },
  {
    icon: TrendingUp,
    title: 'Success Stories',
    description: 'Learn from creators who\'ve achieved remarkable results',
    frequency: 'Monthly',
    duration: '30 minutes',
    format: 'Interview + Q&A'
  }
]

export default function QASessionsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Community Q&A Sessions"
        description="Join our live Q&A sessions with experts and community members. Get your questions answered, learn from others, and connect with fellow creators."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#upcoming">
              <Calendar className="mr-2 h-4 w-4" />
              View Upcoming Sessions
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#recordings">
              <Play className="mr-2 h-4 w-4" />
              Watch Recordings
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Session Types */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Types of Sessions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We offer different types of sessions to meet various learning needs and interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessionTypes.map((type, index) => (
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

      {/* Upcoming Sessions */}
      <ContentSection id="upcoming" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Sessions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Register for upcoming Q&A sessions and mark your calendar
          </p>
        </div>

        <div className="space-y-6">
          {upcomingSessions.map((session, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${session.featured ? 'border-primary' : ''}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant={session.featured ? 'default' : 'secondary'}>
                        {session.type}
                      </Badge>
                      {session.featured && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{session.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4">Hosted by {session.host}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{session.attendees}/{session.maxAttendees}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Topics to be covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic, topicIndex) => (
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
                            {Math.round((session.attendees / session.maxAttendees) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Capacity</div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(session.attendees / session.maxAttendees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button className="w-full mb-2">
                          <Calendar className="mr-2 h-4 w-4" />
                          Register Free
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Ask Question
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

      {/* Past Sessions */}
      <ContentSection id="recordings">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Session Recordings</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Catch up on sessions you missed with our comprehensive recording library
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastSessions.map((session, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <Play className="h-12 w-12 text-primary" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Recorded</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{session.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{session.attendees}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{session.title}</CardTitle>
                <CardDescription>
                  {session.host} • {session.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-sm">Key Highlights:</h4>
                  <ul className="space-y-1">
                    {session.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
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

      {/* How to Participate */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How to Participate</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting involved in our Q&A sessions is easy and free for all community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Register for Sessions',
              description: 'Browse upcoming sessions and register for those that interest you',
              icon: Calendar
            },
            {
              step: '2',
              title: 'Submit Questions',
              description: 'Submit your questions in advance or ask them live during the session',
              icon: MessageCircle
            },
            {
              step: '3',
              title: 'Join & Learn',
              description: 'Attend the live session or watch the recording at your convenience',
              icon: Video
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
          <h2 className="text-3xl font-bold mb-4">Join Our Next Q&A Session</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on valuable insights and direct access to experts. Register for our upcoming sessions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#upcoming">
                <Calendar className="mr-2 h-4 w-4" />
                Register Now
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
