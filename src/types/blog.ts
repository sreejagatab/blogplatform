// Centralized blog types to avoid duplications and ensure consistency

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt: Date | null
  scheduledAt?: Date | null
  readingTime?: number | null
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  status: string
  featured: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  seoScore?: number | null
  aiOptimized: boolean
  aiSuggestions?: string | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    bio?: string | null
  }
  category?: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  _count?: {
    comments: number
    likes: number
  }
}

export interface BlogPostCardProps {
  post: BlogPostCardData
}

export interface BlogPostViewProps {
  post: BlogPost
}

// Platform-specific blog post interface for platform adapters
export interface PlatformBlogPost {
  id: string
  title: string
  content: string
  excerpt?: string
  featuredImage?: string
  author: {
    name: string
    bio?: string
    avatar?: string
  }
  category?: {
    name: string
    slug: string
  }
  tags: string[]
  publishedAt?: Date
  updatedAt: Date
  readingTime?: number
  url?: string
}

// Comment types
export interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  approved: boolean
  author: {
    id: string
    name: string | null
    image: string | null
  }
  replies?: Comment[]
}

// Like types  
export interface PostLike {
  id: string
  createdAt: Date
  user: {
    id: string
    name: string | null
  }
}

// Newsletter types
export interface NewsletterSubscriber {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  isActive: boolean
  confirmedAt?: Date | null
  source?: string | null
  createdAt: Date
  updatedAt: Date
}

// Category types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

// Tag types
export interface Tag {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

// Simplified interface for blog post cards/lists to avoid Prisma type complexity
export interface BlogPostCardData {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt: Date | null
  readingTime?: number | null
  viewCount?: number
  likeCount?: number
  commentCount?: number
  author: {
    name: string | null
    image?: string | null
  }
  category?: {
    name: string
    color?: string | null
  } | null
  _count?: {
    likes: number
    comments: number
  }
}
