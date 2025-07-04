// Database types that match Prisma model outputs
import { BlogPost } from './blog'

// Type for BlogPost with partial fields (like in cards/lists)
export interface BlogPostCardData {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt: Date | null
  readingTime?: number | null
  viewCount: number
  likeCount: number
  commentCount: number
  author: {
    name: string | null
    image?: string | null
  }
  category?: {
    name: string
    color?: string | null
  } | null
  _count: {
    likes: number
    comments: number
  }
}

// Type to adapt Prisma results to BlogPost interface
export function adaptPrismaPostToBlogPost(prismaPost: any): BlogPost {
  return {
    ...prismaPost,
    // Map any missing or differently named fields here
    tags: prismaPost.tags?.map((t: any) => ({
      id: t.tag?.id || t.id,
      name: t.tag?.name || t.name,
      slug: t.tag?.slug || t.slug
    })) || [],
    _count: prismaPost._count || { comments: 0, likes: 0 },
  }
}
