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
  Globe, 
  Zap, 
  Heart,
  ArrowRight,
  Target,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Universal Blog Platform - our mission to democratize content distribution and help creators reach global audiences.',
}

const stats = [
  { label: 'Active Users', value: '50K+', icon: Users },
  { label: 'Platforms Connected', value: '1000+', icon: Globe },
  { label: 'Posts Published', value: '2M+', icon: Zap },
  { label: 'Countries Reached', value: '150+', icon: Heart }
]

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We believe every creator deserves a global audience. Our mission is to democratize content distribution and break down barriers to reach.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We leverage cutting-edge AI and automation to solve real problems for content creators, always staying ahead of the curve.'
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your content and data are precious. We maintain the highest standards of security and privacy protection.'
  },
  {
    icon: Heart,
    title: 'Creator-Centric',
    description: 'Every feature we build is designed with creators in mind. Your success is our success, and we never forget that.'
  }
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Product at major social media platform. Passionate about empowering creators.',
    avatar: '/team/sarah.jpg',
    initials: 'SC'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer with 15+ years in distributed systems and AI/ML infrastructure.',
    avatar: '/team/marcus.jpg',
    initials: 'MR'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Product',
    bio: 'Product leader with deep experience in creator tools and content management platforms.',
    avatar: '/team/emily.jpg',
    initials: 'EW'
  },
  {
    name: 'David Kim',
    role: 'Head of Engineering',
    bio: 'Full-stack architect who has built scalable platforms serving millions of users.',
    avatar: '/team/david.jpg',
    initials: 'DK'
  }
]

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'Started with a vision to democratize content distribution'
  },
  {
    year: '2023',
    title: 'Beta Launch',
    description: 'Launched beta with 50 platforms and 1,000 early adopters'
  },
  {
    year: '2024',
    title: 'Series A Funding',
    description: 'Raised $10M to accelerate growth and platform expansion'
  },
  {
    year: '2024',
    title: '1000+ Platforms',
    description: 'Reached milestone of 1000+ connected platforms worldwide'
  }
]

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        title="Empowering Creators Worldwide"
        description="We're on a mission to democratize content distribution and help every creator reach their global audience."
      />

      {/* Stats Section */}
      <ContentSection className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
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

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-center">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Universal Blog Platform was born from a simple frustration: why should great content be limited by platform boundaries? 
              Our founders, experienced in both content creation and technology, saw creators struggling to maintain presence across 
              dozens of platforms while losing their authentic voice in the process.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mt-6">
              We built Universal Blog Platform to solve this problem once and for all. By combining AI-powered content optimization 
              with seamless multi-platform distribution, we're helping creators focus on what they do best: creating amazing content.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Team Section */}
      <ContentSection background="muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Timeline */}
      <ContentSection>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    <Badge variant="outline">{milestone.year}</Badge>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to amplify your content and reach audiences worldwide? Join thousands of creators who trust Universal Blog Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pricing">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/careers">We're Hiring</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
