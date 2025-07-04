import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users,
  MessageCircle,
  ArrowRight,
  Video,
  HelpCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Monthly Office Hours - December',
  description: 'Join our team for live Q&A, feature demos, and direct support in our monthly office hours.',
}

const topics = [
  'Platform updates and new features',
  'Content strategy best practices',
  'Technical troubleshooting',
  'Integration setup help',
  'Analytics and reporting questions',
  'Team collaboration tips'
]

const pastTopics = [
  { month: 'November', topic: 'AI Writing Assistant Deep Dive', attendees: 180 },
  { month: 'October', topic: 'Multi-Platform Scheduling Strategies', attendees: 165 },
  { month: 'September', topic: 'Analytics and ROI Measurement', attendees: 142 }
]

export default function OfficeHoursPage() {
  return (
    <PageLayout>
      <PageHero
        title="Monthly Office Hours - December"
        description="Get direct access to our team for live Q&A, feature demos, and personalized support."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Event Details */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Badge className="mb-4 bg-green-600">Live Q&A</Badge>
                  <h2 className="text-2xl font-bold mb-4">December Office Hours</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>December 22, 2024</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>3:00 PM - 4:00 PM EST</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-primary" />
                      <span>Live on Zoom (Recording Available)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Open to all users</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button size="lg" className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      Join Office Hours - Free
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    What We'll Cover
                  </h3>
                  <ul className="space-y-3">
                    {topics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>How Office Hours Work</CardTitle>
              <CardDescription>
                Interactive session with our team for direct support and guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Submit Questions</h3>
                  <p className="text-sm text-muted-foreground">Send your questions in advance or ask live</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Join Live Session</h3>
                  <p className="text-sm text-muted-foreground">Participate in real-time Q&A and demos</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Get Direct Help</h3>
                  <p className="text-sm text-muted-foreground">Receive personalized guidance from our team</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Access Recording</h3>
                  <p className="text-sm text-muted-foreground">Watch the recording if you miss the live session</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Questions */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Submit Your Questions</CardTitle>
              <CardDescription className="text-blue-700">
                Send us your questions in advance to ensure we cover what matters most to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea 
                  placeholder="What would you like to discuss during office hours? Be as specific as possible..."
                  className="w-full p-4 border rounded-lg h-32 resize-none"
                />
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Submit Question
                  </Button>
                  <Button variant="outline">
                    View Submitted Questions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Past Office Hours */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Past Office Hours</CardTitle>
              <CardDescription>
                Catch up on previous sessions and popular topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastTopics.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{session.month} 2024: {session.topic}</h3>
                      <p className="text-sm text-muted-foreground">{session.attendees} attendees</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Watch Recording
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Meet the Team</CardTitle>
              <CardDescription>
                Our experts who'll be available during office hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">SC</span>
                  </div>
                  <h3 className="font-semibold">Sarah Chen</h3>
                  <p className="text-sm text-muted-foreground">CEO & Product</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">AC</span>
                  </div>
                  <h3 className="font-semibold">Alex Chen</h3>
                  <p className="text-sm text-muted-foreground">Head of AI</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">MJ</span>
                  </div>
                  <h3 className="font-semibold">Maria Johnson</h3>
                  <p className="text-sm text-muted-foreground">Customer Success</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Join CTA */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Join Us for December Office Hours</h2>
              <p className="mb-6 opacity-90">
                Get direct access to our team and fellow creators for support and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Video className="mr-2 h-4 w-4" />
                  Join Live Session
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Submit Question
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Can't attend live? Recording will be available to all users.
              </p>
            </CardContent>
          </Card>

          {/* More Events */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">More Community Events</h2>
            <p className="text-muted-foreground mb-6">
              Explore our workshops, webinars, and community gatherings.
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
