'use client'

import { Calendar, Clock, Eye, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedPostsProps {
  currentPostId: string
  tags: string[]
  categories: string[]
}

const mockRelatedPosts = [
  {
    id: '2',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Learn best practices for building large-scale React applications using TypeScript.',
    slug: 'building-scalable-react-applications-typescript',
    author: {
      id: '2',
      name: 'Sarah Chen',
      image: '/avatars/sarah-chen.jpg'
    },
    publishedAt: new Date('2024-01-12T14:30:00Z'),
    category: {
      name: 'Development',
      color: '#10B981'
    },
    featuredImage: '/images/react-typescript.jpg',
    readingTime: 12,
    viewCount: 8900,
    likeCount: 320
  },
  {
    id: '3',
    title: 'Modern CSS Techniques for Better User Interfaces',
    excerpt: 'Discover the latest CSS features and techniques to create stunning, responsive user interfaces.',
    slug: 'modern-css-techniques-better-user-interfaces',
    author: {
      id: '3',
      name: 'Mike Rodriguez',
      image: '/avatars/mike-rodriguez.jpg'
    },
    publishedAt: new Date('2024-01-10T09:15:00Z'),
    category: {
      name: 'Design',
      color: '#F59E0B'
    },
    featuredImage: '/images/modern-css.jpg',
    readingTime: 6,
    viewCount: 6750,
    likeCount: 280
  },
  {
    id: '4',
    title: 'Getting Started with Next.js 14 and App Router',
    excerpt: 'A comprehensive guide to building modern web applications with Next.js 14.',
    slug: 'getting-started-nextjs-14-app-router',
    author: {
      id: '4',
      name: 'Emma Wilson',
      image: '/avatars/emma-wilson.jpg'
    },
    publishedAt: new Date('2024-01-08T16:45:00Z'),
    category: {
      name: 'Development',
      color: '#10B981'
    },
    featuredImage: '/images/nextjs-14.jpg',
    readingTime: 10,
    viewCount: 5420,
    likeCount: 195
  }
]

export default function RelatedPosts({ currentPostId, tags, categories }: RelatedPostsProps) {
  // Filter out the current post and get related posts
  const relatedPosts = mockRelatedPosts.filter(post => post.id !== currentPostId)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Related Articles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <div key={post.id} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="space-y-3">
                {/* Featured Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className="text-white text-xs"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={post.author.image} alt={post.author.name} />
                        <AvatarFallback className="text-xs">
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.viewCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likeCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link 
          href="/blog"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View all articles →
        </Link>
      </div>
    </Card>
  )
}
