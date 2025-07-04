import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UniversalPublishingHub from '@/components/admin/universal-publishing-hub'

export const metadata: Metadata = {
  title: 'Universal Publishing Hub - Admin Dashboard',
  description: 'Distribute your content across multiple platforms with one click',
}

export default async function PublishingPage() {
  const session = await auth()
  
  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      platformConnections: {
        where: { isActive: true }
      }
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Get recent posts for publishing
  const recentPosts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: user.id },
        { status: 'PUBLISHED' } // Allow admins to republish any published post
      ]
    },
    take: 10,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      status: true,
      publishedAt: true,
      updatedAt: true
    }
  })

  // Get publishing jobs
  const publishingJobs = await prisma.publishingJob.findMany({
    where: { userId: user.id },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      }
    }
  })

  return (
    <div className="container mx-auto py-6">
      <UniversalPublishingHub 
        initialPosts={recentPosts}
        initialJobs={publishingJobs}
        userConnections={user.platformConnections}
      />
    </div>
  )
}
