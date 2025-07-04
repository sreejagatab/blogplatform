"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Clock, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from './comment-section'
import { toast } from 'sonner'
import { BlogPost, BlogPostViewProps } from '@/types/blog'

export function BlogPostView({ post }: BlogPostViewProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (session?.user) {
      checkLikeStatus()
    }
  }, [session, post.id])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`)
      const data = await response.json()
      setIsLiked(data.liked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (!session?.user) {
      toast.error('Please sign in to like posts')
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsLiked(data.liked)
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Failed to toggle like')
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {post.featuredImage && (
          <div className="relative w-full h-[60vh] overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {post.category && (
              <Badge 
                variant="secondary" 
                className="mb-4"
                style={{ backgroundColor: post.category.color || '#3B82F6' }}
              >
                {post.category.name}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author.image || ''} />
                  <AvatarFallback>
                    {post.author.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount}
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {post.commentCount}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />
          
          <Separator className="my-12" />
          
          {/* Author Bio */}
          <div className="flex items-start gap-4 p-6 bg-muted rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage src={post.author.image || ''} />
              <AvatarFallback className="text-lg">
                {post.author.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg mb-2">{post.author.name}</h3>
              {post.author.bio && (
                <p className="text-muted-foreground">{post.author.bio}</p>
              )}
            </div>
          </div>
          
          <Separator className="my-12" />
          
          {/* Comments Section */}
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  )
}
