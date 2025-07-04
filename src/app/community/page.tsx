import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  ArrowRight,
  ExternalLink,
  Heart,
  Star,
  Zap,
  BookOpen,
  Video,
  Mic,
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Universal Blog Platform community. Connect with creators, share knowledge, and grow together.',
}

const communityStats = [
  { label: 'Active Members', value: '25K+', icon: Users },
  { label: 'Monthly Posts', value: '5K+', icon: MessageCircle },
  { label: 'Events Hosted', value: '150+', icon: Calendar },
  { label: 'Success Stories', value: '500+', icon: Trophy }
]

const communityChannels = [
  {
    icon: MessageCircle,
    title: 'Discord Server',
    description: 'Real-time chat with creators and our team',
    members: '15K+ members',
    activity: 'Very Active',
    href: 'https://discord.gg/universalblog',
    primary: true
  },
  {
    icon: Users,
    title: 'Facebook Group',
    description: 'Share tips, ask questions, and network',
    members: '8K+ members',
    activity: 'Active',
    href: 'https://facebook.com/groups/universalblog',
    primary: false
  },
  {
    icon: Globe,
    title: 'Reddit Community',
    description: 'Discussions, AMAs, and community support',
    members: '12K+ members',
    activity: 'Active',
    href: 'https://reddit.com/r/universalblog',
    primary: false
  },
  {
    icon: Video,
    title: 'YouTube Channel',
    description: 'Tutorials, webinars, and creator spotlights',
    members: '20K+ subscribers',
    activity: 'Weekly uploads',
    href: 'https://youtube.com/universalblog',
    primary: false
  }
]

const upcomingEvents = [
  {
    title: 'Creator Spotlight: Building a Personal Brand',
    date: 'Dec 15, 2024',
    time: '2:00 PM EST',
    type: 'Webinar',
    speaker: 'Sarah Chen, CEO',
    attendees: 250,
    href: '/events/creator-spotlight-dec'
  },
  {
    title: 'AI Content Creation Workshop',
    date: 'Dec 20, 2024',
    time: '1:00 PM EST',
    type: 'Workshop',
    speaker: 'Marcus Rodriguez, CTO',
    attendees: 150,
    href: '/events/ai-workshop-dec'
  },
  {
    title: 'Community Office Hours',
    date: 'Dec 22, 2024',
    time: '3:00 PM EST',
    type: 'Q&A',
    speaker: 'Community Team',
    attendees: 100,
    href: '/events/office-hours-dec'
  }
]

const featuredMembers = [
  {
    name: 'Alex Thompson',
    role: 'Tech Blogger',
    achievement: 'Reached 1M+ views across platforms',
    avatar: '/community/alex.jpg',
    initials: 'AT',
    platforms: ['Medium', 'LinkedIn', 'Twitter'],
    quote: 'Universal Blog Platform helped me scale my content to audiences I never thought possible.'
  },
  {
    name: 'Maria Garcia',
    role: 'Lifestyle Creator',
    achievement: 'Built 50K+ follower community',
    avatar: '/community/maria.jpg',
    initials: 'MG',
    platforms: ['Instagram', 'TikTok', 'Pinterest'],
    quote: 'The AI writing assistant has transformed how I create content. It\'s like having a co-writer!'
  },
  {
    name: 'David Kim',
    role: 'Business Coach',
    achievement: 'Generated $100K+ from content',
    avatar: '/community/david.jpg',
    initials: 'DK',
    platforms: ['YouTube', 'LinkedIn', 'Newsletter'],
    quote: 'The analytics insights helped me understand my audience better and create more engaging content.'
  }
]

const communityResources = [
  {
    icon: BookOpen,
    title: 'Creator Playbook',
    description: 'Comprehensive guide to content creation and distribution',
    type: 'Guide',
    href: '/resources/creator-playbook'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for all features',
    type: 'Videos',
    href: '/help/videos'
  },
  {
    icon: Mic,
    title: 'Creator Podcast',
    description: 'Weekly interviews with successful creators',
    type: 'Podcast',
    href: '/podcast'
  },
  {
    icon: TrendingUp,
    title: 'Industry Reports',
    description: 'Latest trends and insights in content creation',
    type: 'Reports',
    href: '/resources/reports'
  }
]

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Webinar': return 'bg-blue-100 text-blue-800'
    case 'Workshop': return 'bg-green-100 text-green-800'
    case 'Q&A': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function CommunityPage() {
  return (
    <PageLayout>
      <PageHero
        title="Join Our Creator Community"
        description="Connect with 25,000+ creators, share knowledge, get support, and grow your content together."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://discord.gg/universalblog" target="_blank">
              Join Discord
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#events">View Events</Link>
          </Button>
        </div>
      </PageHero>

      {/* Community Stats */}
      <ContentSection className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {communityStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Community Channels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Join the Conversation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityChannels.map((channel, index) => (
              <Card key={index} className={`h-full ${channel.primary ? 'border-primary shadow-md' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${channel.primary ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      <channel.icon className="h-6 w-6" />
                    </div>
                    {channel.primary && <Badge>Most Active</Badge>}
                  </div>
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <CardDescription className="text-base">
                    {channel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{channel.members}</span>
                    <Badge variant="outline">{channel.activity}</Badge>
                  </div>
                  <Button 
                    variant={channel.primary ? 'default' : 'outline'} 
                    className="w-full"
                    asChild
                  >
                    <Link href={channel.href} target="_blank">
                      Join Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Members */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Community Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMembers.map((member, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {member.role}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{member.achievement}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {member.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <blockquote className="text-sm text-muted-foreground italic">
                    "{member.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Upcoming Events */}
      <ContentSection background="muted" id="events">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees} registered
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Speaker:</span> {event.speaker}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={event.href}>
                        Register
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Community Resources */}
      <ContentSection>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Community Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityResources.map((resource, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <Link href={resource.href}>
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <resource.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{resource.type}</Badge>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who are growing their audience and sharing knowledge in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="https://discord.gg/universalblog" target="_blank">
                Join Discord Community
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/help">Get Support</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
