'use client'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import { ChatButton } from '@/components/support/chat-widget'
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  Video,
  Users,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Settings,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react'

// Metadata is handled by the layout since this is a client component

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    availability: 'Mon-Fri, 9AM-6PM EST',
    action: 'Start Chat',
    href: 'javascript:void(0)',
    onClick: 'openChat',
    primary: true
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    availability: 'Response within 24 hours',
    action: 'Send Email',
    href: 'mailto:support@universalblog.com',
    primary: false
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    availability: 'Enterprise customers only',
    action: 'Call Now',
    href: 'tel:+15551234567',
    primary: false
  }
]

const helpCategories = [
  {
    icon: Lightbulb,
    title: 'Getting Started',
    description: 'New to Universal Blog Platform? Start here.',
    articleCount: 12,
    articles: [
      'Quick Start Guide',
      'Setting Up Your Account',
      'Connecting Your First Platform',
      'Publishing Your First Post'
    ]
  },
  {
    icon: Settings,
    title: 'Account & Settings',
    description: 'Manage your account and preferences',
    articleCount: 18,
    articles: [
      'Account Settings',
      'Billing & Subscriptions',
      'Team Management',
      'Security Settings'
    ]
  },
  {
    icon: Zap,
    title: 'Content Creation',
    description: 'Master content creation and AI tools',
    articleCount: 24,
    articles: [
      'Using the AI Writing Assistant',
      'Content Templates',
      'SEO Optimization',
      'Media Management'
    ]
  },
  {
    icon: BookOpen,
    title: 'Publishing & Distribution',
    description: 'Learn about multi-platform publishing',
    articleCount: 20,
    articles: [
      'Platform Connections',
      'Scheduling Content',
      'Bulk Operations',
      'Content Formatting'
    ]
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work effectively with your team',
    articleCount: 15,
    articles: [
      'User Roles & Permissions',
      'Workflow Management',
      'Approval Processes',
      'Team Analytics'
    ]
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'Keep your account and content secure',
    articleCount: 10,
    articles: [
      'Two-Factor Authentication',
      'Data Privacy',
      'GDPR Compliance',
      'Security Best Practices'
    ]
  }
]

const popularArticles = [
  {
    title: 'How to connect your social media accounts',
    category: 'Getting Started',
    views: '15.2k views',
    href: '/help/connect-accounts'
  },
  {
    title: 'Understanding the AI writing assistant',
    category: 'Content Creation',
    views: '12.8k views',
    href: '/help/ai-assistant'
  },
  {
    title: 'Scheduling posts across multiple platforms',
    category: 'Publishing',
    views: '11.5k views',
    href: '/help/scheduling'
  },
  {
    title: 'Managing team permissions and roles',
    category: 'Team Collaboration',
    views: '9.3k views',
    href: '/help/team-permissions'
  },
  {
    title: 'Troubleshooting publishing failures',
    category: 'Publishing',
    views: '8.7k views',
    href: '/help/troubleshooting'
  }
]

const quickActions = [
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    href: '/help/videos'
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with other users',
    href: '/community'
  },
  {
    icon: BookOpen,
    title: 'API Documentation',
    description: 'Technical integration guides',
    href: '/api-docs'
  },
  {
    icon: CreditCard,
    title: 'Billing Support',
    description: 'Payment and subscription help',
    href: '/help/billing'
  }
]

export default function HelpPage() {
  const handleChatClick = () => {
    // This will be handled by the ChatButton component
    const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  return (
    <PageLayout>
      <PageHero
        title="How can we help you?"
        description="Find answers, get support, and learn how to make the most of Universal Blog Platform."
        size="md"
      >
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles, guides, and tutorials..." 
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </PageHero>

      {/* Support Channels */}
      <ContentSection className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportChannels.map((channel, index) => (
            <Card key={index} className={`text-center h-full ${channel.primary ? 'border-primary shadow-md' : ''}`}>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${channel.primary ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                    <channel.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-lg">{channel.title}</CardTitle>
                <CardDescription>{channel.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{channel.availability}</p>
                {channel.onClick === 'openChat' ? (
                  <Button
                    variant={channel.primary ? 'default' : 'outline'}
                    className="w-full"
                    onClick={handleChatClick}
                  >
                    {channel.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant={channel.primary ? 'default' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    <Link href={channel.href}>
                      {channel.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={action.href}>
                <CardContent className="p-6 text-center">
                  <action.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Articles</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <Link href={article.href}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <Card key={index} className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{category.articleCount} articles</Badge>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {category.articles.map((article, idx) => (
                      <li key={idx} className="text-sm">
                        <Link 
                          href={`/help/${article.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      View All Articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Still Need Help */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/community">Join Community</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
