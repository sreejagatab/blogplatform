'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  author: {
    id: string
    name: string
    image?: string
  }
  publishedAt: Date
  category: {
    id: string
    name: string
    slug: string
    color?: string
  }
  tags: Array<{ id: string; name: string; slug: string }>
  featuredImage?: string
  readingTime: number
  viewCount: number
  likeCount: number
  commentCount: number
}

interface BlogListingProps {
  page: number
  category?: string
  tag?: string
  search?: string
  sort?: string
}

// Mock data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development: AI-Powered Coding',
    excerpt: 'Exploring how AI is transforming web development and what the future holds for developers in an AI-enhanced world.',
    slug: 'future-of-web-development-ai-powered-coding',
    author: {
      id: '1',
      name: 'Alex Johnson',
      image: '/avatars/alex-johnson.jpg'
    },
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    category: {
      id: '1',
      name: 'Technology',
      slug: 'technology',
      color: '#3B82F6'
    },
    tags: [
      { id: '1', name: 'AI', slug: 'ai' },
      { id: '2', name: 'Web Development', slug: 'web-development' },
      { id: '3', name: 'Future Tech', slug: 'future-tech' }
    ],
    featuredImage: '/images/ai-coding-future.jpg',
    readingTime: 8,
    viewCount: 12500,
    likeCount: 450,
    commentCount: 89
  },
  {
    id: '2',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Learn best practices for building large-scale React applications using TypeScript, including architecture patterns and performance optimization.',
    slug: 'building-scalable-react-applications-typescript',
    author: {
      id: '2',
      name: 'Sarah Chen',
      image: '/avatars/sarah-chen.jpg'
    },
    publishedAt: new Date('2024-01-12T14:30:00Z'),
    category: {
      id: '2',
      name: 'Development',
      slug: 'development',
      color: '#10B981'
    },
    tags: [
      { id: '4', name: 'React', slug: 'react' },
      { id: '5', name: 'TypeScript', slug: 'typescript' },
      { id: '6', name: 'Architecture', slug: 'architecture' }
    ],
    featuredImage: '/images/react-typescript.jpg',
    readingTime: 12,
    viewCount: 8900,
    likeCount: 320,
    commentCount: 67
  },
  {
    id: '3',
    title: 'Modern CSS Techniques for Better User Interfaces',
    excerpt: 'Discover the latest CSS features and techniques to create stunning, responsive user interfaces that work across all devices.',
    slug: 'modern-css-techniques-better-user-interfaces',
    author: {
      id: '3',
      name: 'Mike Rodriguez',
      image: '/avatars/mike-rodriguez.jpg'
    },
    publishedAt: new Date('2024-01-10T09:15:00Z'),
    category: {
      id: '3',
      name: 'Design',
      slug: 'design',
      color: '#F59E0B'
    },
    tags: [
      { id: '7', name: 'CSS', slug: 'css' },
      { id: '8', name: 'UI/UX', slug: 'ui-ux' },
      { id: '9', name: 'Responsive Design', slug: 'responsive-design' }
    ],
    featuredImage: '/images/modern-css.jpg',
    readingTime: 6,
    viewCount: 6750,
    likeCount: 280,
    commentCount: 45
  }
]

export default function BlogListing({ page, category, tag, search, sort }: BlogListingProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const postsPerPage = 9

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams({
          limit: postsPerPage.toString(),
          ...(category && { category }),
          ...(tag && { tag }),
          ...(search && { search }),
          ...(sort && { sort })
        })

        // Use search endpoint if there's a search query, otherwise use regular posts endpoint
        const endpoint = search
          ? `/api/posts/search?q=${encodeURIComponent(search)}&page=${page}&${params}`
          : `/api/posts?${params}`

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()

        if (search) {
          // Search API response format
          setPosts(data.posts || [])
          setTotalPages(data.pagination?.totalPages || 1)
        } else {
          // Regular posts API response format
          setPosts(data.posts || [])
          // For regular API, we'll need to implement pagination differently
          // For now, we'll use a simple approach
          setTotalPages(data.hasMore ? page + 1 : page)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to load posts. Please try again.')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, category, tag, search, sort, postsPerPage])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const PostCard = ({ post }: { post: BlogPost }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative aspect-video">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              className="text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Link 
              href={`/blog/author/${post.author.id}`}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              {post.author.name}
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.commentCount}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map(tag => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="secondary" className="text-xs hover:bg-blue-100 dark:hover:bg-blue-900">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )

  const PostListItem = ({ post }: { post: BlogPost }) => (
    <Card className="p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex gap-6">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-48 h-32 flex-shrink-0">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1">
          {/* Category */}
          <div className="mb-2">
            <Badge 
              className="text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            <Link 
              href={`/blog/${post.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback className="text-xs">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              <span>{formatDate(post.publishedAt)}</span>
              <span>{post.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Posts
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Posts Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {search ? `No posts found for "${search}"` :
           category ? `No posts found in category "${category}"` :
           tag ? `No posts found with tag "${tag}"` :
           'No posts available at the moment.'}
        </p>
      </Card>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {category ? `Category: ${category}` : 
             tag ? `Tag: ${tag}` : 
             search ? `Search: "${search}"` : 
             'Latest Posts'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {posts.length} posts found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found matching your criteria.
          </p>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {posts.map(post => (
                <PostListItem key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                asChild
              >
                <Link href={`/blog?page=${page - 1}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}>
                    {pageNum}
                  </Link>
                </Button>
              ))}

              <Button
                variant="outline"
                disabled={page >= totalPages}
                asChild
              >
                <Link href={`/blog?page=${page + 1}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
