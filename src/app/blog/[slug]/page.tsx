import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogPostView } from '@/components/blog/blog-post-view'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
      metaTitle: true,
      metaDescription: true,
      featuredImage: true,
    }
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    // Include all fields by not using select/include at the top level
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    }
  })

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: {
      viewCount: {
        increment: 1
      }
    }
  })

  // Adapt the Prisma result to match BlogPost interface
  const blogPost = {
    ...post,
    tags: post.tags?.map(pt => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
    })) || [],
  }

  return <BlogPostView post={blogPost as any} />
}
