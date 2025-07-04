import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  User,
  ArrowRight,
  Plus,
  Pin
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: {
    slug: string
  }
}

const categories = {
  'general-discussion': {
    title: 'General Discussion',
    description: 'Open discussions about content creation, platform features, and community topics',
    color: 'bg-blue-100 text-blue-800',
    memberCount: 1247,
    postCount: 3892,
    posts: [
      {
        title: 'Welcome to the Universal Blog Platform Community!',
        content: 'Introduce yourself and let us know what brings you to our platform. Share your content creation goals and connect with fellow creators.',
        author: 'Community Team',
        replies: 156,
        views: 2847,
        lastActivity: '2 hours ago',
        pinned: true,
        href: '/community/posts/welcome-post'
      },
      {
        title: 'What\'s your biggest content creation challenge?',
        content: 'Let\'s discuss the common challenges we face as content creators and share solutions that have worked for us.',
        author: 'Sarah M.',
        replies: 43,
        views: 892,
        lastActivity: '4 hours ago',
        pinned: false,
        href: '/community/posts/content-challenges'
      }
    ]
  },
  'feature-requests': {
    title: 'Feature Requests',
    description: 'Suggest new features and improvements for the platform',
    color: 'bg-purple-100 text-purple-800',
    memberCount: 892,
    postCount: 567,
    posts: [
      {
        title: 'Request: Advanced Analytics Dashboard',
        content: 'It would be great to have more detailed analytics with custom date ranges and comparison features.',
        author: 'Mike R.',
        replies: 28,
        views: 445,
        lastActivity: '1 day ago',
        pinned: false,
        href: '/community/posts/analytics-request'
      },
      {
        title: 'Bulk editing for scheduled posts',
        content: 'Would love the ability to edit multiple scheduled posts at once, especially for changing publication times.',
        author: 'Emma L.',
        replies: 15,
        views: 234,
        lastActivity: '2 days ago',
        pinned: false,
        href: '/community/posts/bulk-editing-request'
      }
    ]
  },
  'tips-and-tricks': {
    title: 'Tips & Tricks',
    description: 'Share your best practices, workflows, and creative solutions',
    color: 'bg-green-100 text-green-800',
    memberCount: 1534,
    postCount: 2156,
    posts: [
      {
        title: 'My 5-step content creation workflow',
        content: 'Here\'s the workflow that helped me increase my content output by 300% while maintaining quality.',
        author: 'Alex C.',
        replies: 67,
        views: 1234,
        lastActivity: '6 hours ago',
        pinned: true,
        href: '/community/posts/content-workflow'
      },
      {
        title: 'AI prompt templates that actually work',
        content: 'Sharing my collection of AI writing prompts that consistently produce high-quality content.',
        author: 'Jennifer K.',
        replies: 89,
        views: 1567,
        lastActivity: '8 hours ago',
        pinned: false,
        href: '/community/posts/ai-prompts'
      }
    ]
  },
  'showcase': {
    title: 'Content Showcase',
    description: 'Share your best content and get feedback from the community',
    color: 'bg-orange-100 text-orange-800',
    memberCount: 743,
    postCount: 1289,
    posts: [
      {
        title: 'My viral LinkedIn post breakdown',
        content: 'This post got 50K+ views and 500+ comments. Here\'s what made it work and how you can apply these principles.',
        author: 'David P.',
        replies: 34,
        views: 678,
        lastActivity: '12 hours ago',
        pinned: false,
        href: '/community/posts/viral-linkedin'
      }
    ]
  },
  'technical-support': {
    title: 'Technical Support',
    description: 'Get help with technical issues and platform troubleshooting',
    color: 'bg-red-100 text-red-800',
    memberCount: 456,
    postCount: 892,
    posts: [
      {
        title: 'Publishing to Instagram not working',
        content: 'My posts are failing to publish to Instagram. Getting an error about authentication. Anyone else experiencing this?',
        author: 'Lisa W.',
        replies: 12,
        views: 234,
        lastActivity: '3 hours ago',
        pinned: false,
        href: '/community/posts/instagram-issue'
      }
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories[params.slug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested community category could not be found.'
    }
  }

  return {
    title: `${category.title} - Community`,
    description: category.description
  }
}

export default function CommunityCategoryPage({ params }: Props) {
  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const pinnedPosts = category.posts.filter(post => post.pinned)
  const regularPosts = category.posts.filter(post => !post.pinned)

  return (
    <PageLayout>
      <PageHero
        title={category.title}
        description={category.description}
        size="md"
      >
        <div className="max-w-md mx-auto mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={`Search ${category.title.toLowerCase()}...`}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </PageHero>

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
              </Link>
            </Button>
          </div>

          {/* Category Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={category.color}>
                      {category.title}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{category.title}</h1>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{category.memberCount.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{category.postCount.toLocaleString()} posts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Very active</span>
                    </div>
                  </div>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Pin className="h-5 w-5" />
                Pinned Posts
              </h2>
              <div className="space-y-4">
                {pinnedPosts.map((post, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Pin className="h-4 w-4 text-primary" />
                            <Badge variant="outline">Pinned</Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                            <Link href={post.href}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{post.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Sort: Recent
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {regularPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                          <Link href={post.href}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{post.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mb-12">
            <Button variant="outline" size="lg">
              Load More Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Related Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Other Categories</CardTitle>
              <CardDescription>
                Join discussions in other community areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categories)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 3)
                  .map(([slug, cat]) => (
                    <Button
                      key={slug}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      asChild
                    >
                      <Link href={`/community/category/${slug}`}>
                        <div className="text-left">
                          <div className="font-medium mb-1">{cat.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {cat.description}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{cat.memberCount} members</span>
                            <span>{cat.postCount} posts</span>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }))
}
