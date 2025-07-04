import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from '../../components/admin/admin-dashboard'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your blog posts and content',
}

export default async function AdminPage() {
  const session = await auth()
  
  // Check if user is authenticated and is an admin
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Fetch dashboard data
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalComments,
    recentPosts
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.post.aggregate({ _sum: { likeCount: true } }),
    prisma.post.aggregate({ _sum: { commentCount: true } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        category: {
          select: {
            name: true,
            color: true,
          }
        }
      }
    })
  ])

  const dashboardData = {
    stats: {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0,
      totalComments: totalComments._sum.commentCount || 0,
    },
    recentPosts: recentPosts.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      updatedAt: post.updatedAt.toISOString(),
    }))
  }

  return <AdminDashboard data={dashboardData} />
}
