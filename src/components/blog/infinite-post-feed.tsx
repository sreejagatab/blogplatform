"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BlogPostCard } from "./blog-post-card"
import { motion } from "framer-motion"
import { BlogPostCardData } from '@/types/blog'

interface PostsResponse {
  posts: BlogPostCardData[]
  nextCursor: string | null
  hasMore: boolean
}

// API function to fetch posts
const fetchPosts = async ({ pageParam }: { pageParam: string | null }): Promise<PostsResponse> => {
  const params = new URLSearchParams({
    limit: '10'
  })
  
  if (pageParam) {
    params.append('cursor', pageParam)
  }
  
  const response = await fetch(`/api/posts?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return response.json()
}

export function InfinitePostFeed() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="loading-skeleton h-96 rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Failed to load posts'}
        </p>
      </div>
    )
  }

  const posts = data?.pages.flatMap((page: PostsResponse) => page.posts) ?? []

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BlogPostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <LoadingSpinner size="lg" />
        ) : hasNextPage ? (
          <div className="text-muted-foreground">Load more posts...</div>
        ) : posts.length > 0 ? (
          <div className="text-muted-foreground">You've reached the end!</div>
        ) : null}
      </div>

      {/* Background fetching indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-background border rounded-lg p-2 shadow-lg">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      )}
    </div>
  )
}
