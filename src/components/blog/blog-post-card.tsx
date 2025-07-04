import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDateRelative } from "@/lib/utils"
import { Clock, Heart, MessageCircle, Eye } from "lucide-react"
import { BlogPostCardData, BlogPostCardProps } from '@/types/blog'

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      )}

      <CardContent className="p-6">
        {/* Category */}
        {post.category && (
          <Badge 
            variant="secondary" 
            className="mb-3"
            style={{ 
              backgroundColor: post.category.color ? post.category.color + '20' : undefined, 
              color: post.category.color || undefined 
            }}
          >
            {post.category.name}
          </Badge>
        )}

        {/* Title */}
        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image || undefined} alt={post.author.name || undefined} />
              <AvatarFallback>
                {post.author.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.publishedAt ? formatDateRelative(post.publishedAt) : 'Draft'}
              </p>
            </div>
          </div>

          {/* Reading Time */}
          {post.readingTime && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {post.readingTime} min read
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {post._count?.likes || 0}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              {post._count?.comments || 0}
            </div>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
