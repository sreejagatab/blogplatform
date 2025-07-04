"use client"

import { useQuery } from "@tanstack/react-query"
import { BlogPostCard } from "@/components/blog/blog-post-card"

import { BlogPostCardData } from '@/types/blog'

const fetchFeaturedPosts = async (): Promise<BlogPostCardData[]> => {
  const response = await fetch('/api/posts?featured=true&limit=3')
  
  if (!response.ok) {
    throw new Error('Failed to fetch featured posts')
  }
  
  const data = await response.json()
  return data.posts
}

export function FeaturedPosts() {
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: fetchFeaturedPosts,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="loading-skeleton h-96 rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured posts available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
