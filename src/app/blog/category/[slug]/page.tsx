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
  Calendar, 
  Clock, 
  User,
  ArrowRight,
  Filter,
  Grid,
  List
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: {
    slug: string
  }
}

const categories = {
  'content-strategy': {
    title: 'Content Strategy',
    description: 'Strategic insights and best practices for content marketing success',
    color: 'bg-blue-100 text-blue-800',
    postCount: 24,
    posts: [
      {
        title: 'The Ultimate Guide to Content Marketing ROI',
        excerpt: 'Learn how to measure and optimize the return on investment of your content marketing efforts with proven strategies and tools.',
        author: 'Sarah Johnson',
        publishDate: '2024-12-15',
        readTime: '12 min read',
        tags: ['ROI', 'Analytics', 'Strategy'],
        featured: true,
        href: '/blog/content-marketing-roi-guide'
      },
      {
        title: 'Building a Content Calendar That Actually Works',
        excerpt: 'Discover how to create and maintain a content calendar that keeps your team organized and your audience engaged.',
        author: 'Mike Chen',
        publishDate: '2024-12-12',
        readTime: '8 min read',
        tags: ['Planning', 'Organization', 'Productivity'],
        featured: false,
        href: '/blog/content-calendar-guide'
      },
      {
        title: 'Content Repurposing: One Post, Multiple Platforms',
        excerpt: 'Maximize your content\'s reach by learning how to effectively repurpose a single piece of content across multiple platforms.',
        author: 'Emma Davis',
        publishDate: '2024-12-10',
        readTime: '10 min read',
        tags: ['Repurposing', 'Multi-platform', 'Efficiency'],
        featured: false,
        href: '/blog/content-repurposing-guide'
      }
    ]
  },
  'ai-tools': {
    title: 'AI Tools & Automation',
    description: 'Harness the power of AI to streamline your content creation process',
    color: 'bg-purple-100 text-purple-800',
    postCount: 18,
    posts: [
      {
        title: 'AI Writing Prompts That Actually Work',
        excerpt: 'Master the art of prompt engineering to get better results from AI writing tools and create more engaging content.',
        author: 'Alex Rodriguez',
        publishDate: '2024-12-14',
        readTime: '15 min read',
        tags: ['AI Writing', 'Prompts', 'Automation'],
        featured: true,
        href: '/blog/ai-writing-prompts'
      },
      {
        title: 'The Future of Content Creation with AI',
        excerpt: 'Explore how artificial intelligence is transforming content creation and what it means for content creators.',
        author: 'Dr. Lisa Park',
        publishDate: '2024-12-11',
        readTime: '11 min read',
        tags: ['Future', 'AI', 'Innovation'],
        featured: false,
        href: '/blog/future-content-creation-ai'
      }
    ]
  },
  'social-media': {
    title: 'Social Media Marketing',
    description: 'Tips, tricks, and strategies for social media success',
    color: 'bg-green-100 text-green-800',
    postCount: 32,
    posts: [
      {
        title: 'LinkedIn Content Strategy for B2B Success',
        excerpt: 'Learn how to create compelling LinkedIn content that drives engagement and generates leads for your B2B business.',
        author: 'Jennifer Kim',
        publishDate: '2024-12-13',
        readTime: '9 min read',
        tags: ['LinkedIn', 'B2B', 'Lead Generation'],
        featured: true,
        href: '/blog/linkedin-b2b-strategy'
      },
      {
        title: 'Instagram Stories That Convert',
        excerpt: 'Discover the secrets to creating Instagram Stories that not only engage your audience but also drive conversions.',
        author: 'Carlos Martinez',
        publishDate: '2024-12-09',
        readTime: '7 min read',
        tags: ['Instagram', 'Stories', 'Conversion'],
        featured: false,
        href: '/blog/instagram-stories-convert'
      }
    ]
  },
  'analytics': {
    title: 'Analytics & Performance',
    description: 'Data-driven insights to optimize your content performance',
    color: 'bg-orange-100 text-orange-800',
    postCount: 15,
    posts: [
      {
        title: 'Content Analytics: Metrics That Matter',
        excerpt: 'Cut through the noise and focus on the content metrics that actually impact your business goals and growth.',
        author: 'David Thompson',
        publishDate: '2024-12-08',
        readTime: '13 min read',
        tags: ['Metrics', 'KPIs', 'Performance'],
        featured: true,
        href: '/blog/content-analytics-metrics'
      }
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories[params.slug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested blog category could not be found.'
    }
  }

  return {
    title: `${category.title} - Blog`,
    description: category.description
  }
}

export default function BlogCategoryPage({ params }: Props) {
  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const featuredPost = category.posts.find(post => post.featured)
  const regularPosts = category.posts.filter(post => !post.featured)

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
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
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
                    <span className="text-sm text-muted-foreground">
                      {category.postCount} articles
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{category.title}</h1>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Post */}
          {featuredPost && (
            <Card className="mb-8 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Badge className="mb-4">Featured Article</Badge>
                      <h2 className="text-2xl font-bold text-primary">
                        {featuredPost.title}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-6">
                  <Badge variant="outline" className="mb-3">Featured</Badge>
                  <h3 className="text-xl font-bold mb-3">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild>
                    <Link href={featuredPost.href}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Regular Posts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                      <Link href={post.href}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
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
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Related Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Other Categories</CardTitle>
              <CardDescription>
                Discover more content across different topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Link href={`/blog/category/${slug}`}>
                        <div className="text-left">
                          <div className="font-medium mb-1">{cat.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {cat.description}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {cat.postCount} articles
                          </Badge>
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
