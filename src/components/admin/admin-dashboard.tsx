"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  PlusCircle,
  FileText,
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  BarChart3,
  Users,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react'
import { AIInsightsWidget } from './ai-insights-widget'

interface AdminDashboardProps {
  data: {
    stats: {
      totalPosts: number
      publishedPosts: number
      draftPosts: number
      totalViews: number
      totalLikes: number
      totalComments: number
    }
    recentPosts: Array<{
      id: string
      title: string
      slug: string
      status: string
      publishedAt: string | null
      updatedAt: string
      viewCount: number
      likeCount: number
      commentCount: number
      author: {
        name: string | null
        image: string | null
      }
      category: {
        name: string
        color: string | null
      } | null
    }>
  }
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { stats, recentPosts } = data
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setDeletingPostId(postId)
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        // Refresh the page to update the list
        window.location.reload()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the post')
    } finally {
      setDeletingPostId(null)
    }
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      description: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
      color: 'text-blue-600'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: 'All-time page views',
      color: 'text-green-600'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      description: 'Across all posts',
      color: 'text-red-600'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      description: 'Community engagement',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your blog content and monitor performance
          </p>
        </div>
        <Link href="/admin/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Insights and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insights Widget */}
        <div className="lg:col-span-1">
          <AIInsightsWidget />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed analytics and insights about your blog performance.
            </p>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your connected social media and publishing platforms.
            </p>
            <Link href="/admin/platforms">
              <Button variant="outline" className="w-full">
                Manage Platforms
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              All Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage all your blog posts in one place.
            </p>
            <Link href="/admin/posts">
              <Button variant="outline" className="w-full">
                Manage Posts
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>
            Your latest blog posts and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.image || ''} />
                    <AvatarFallback>
                      {post.author.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>by {post.author.name}</span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: post.category.color || undefined 
                            }}
                          >
                            {post.category.name}
                          </Badge>
                        </>
                      )}
                      <span>•</span>
                      <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {post.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {recentPosts.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No posts yet. Create your first post to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
