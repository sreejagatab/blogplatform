'use client'

import { Calendar, Clock, Eye, Heart, MessageCircle, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'

const featuredPosts = [
  {
    id: '1',
    title: 'The Future of Web Development: AI-Powered Coding',
    excerpt: 'Exploring how AI is transforming web development and what the future holds for developers.',
    slug: 'future-of-web-development-ai-powered-coding',
    author: {
      id: '1',
      name: 'Alex Johnson',
      image: '/avatars/alex-johnson.jpg'
    },
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    category: {
      name: 'Technology',
      color: '#3B82F6'
    },
    featuredImage: '/images/ai-coding-future.jpg',
    readingTime: 8,
    viewCount: 12500,
    likeCount: 450,
    commentCount: 89,
    featured: true
  },
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
    likeCount: 320,
    commentCount: 67,
    featured: true
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
    likeCount: 280,
    commentCount: 45,
    featured: true
  }
]

export default function FeaturedPosts() {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Featured Posts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Hand-picked articles from our top contributors
          </p>
        </div>
        <Star className="h-8 w-8 text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Post */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-video">
              <Image
                src={featuredPosts[0].featuredImage}
                alt={featuredPosts[0].title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: featuredPosts[0].category.color }}
                >
                  {featuredPosts[0].category.name}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                <Link 
                  href={`/blog/${featuredPosts[0].slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {featuredPosts[0].title}
                </Link>
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {featuredPosts[0].excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={featuredPosts[0].author.image} alt={featuredPosts[0].author.name} />
                      <AvatarFallback>
                        {featuredPosts[0].author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/blog/author/${featuredPosts[0].author.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {featuredPosts[0].author.name}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(featuredPosts[0].publishedAt)}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{featuredPosts[0].readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {featuredPosts[0].viewCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {featuredPosts[0].likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {featuredPosts[0].commentCount}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Featured Posts */}
        <div className="space-y-6">
          {featuredPosts.slice(1).map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-video">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
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

              <div className="p-4">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.author.image} alt={post.author.name} />
                      <AvatarFallback className="text-xs">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likeCount}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
