import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PlatformHealthMonitor from '@/components/admin/platform-health-monitor'

export const metadata: Metadata = {
  title: 'Platform Health Monitor - Admin Dashboard',
  description: 'Real-time monitoring of platform APIs and system health',
}

export default async function HealthPage() {
  const session = await auth()
  
  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get user data and check if admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { 
      id: true, 
      role: true,
      platformConnections: {
        where: { isActive: true },
        select: {
          platform: true,
          isActive: true,
          lastSyncAt: true
        }
      }
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Only admins can access health monitoring
  if (user.role !== 'ADMIN') {
    redirect('/admin')
  }

  return (
    <div className="container mx-auto py-6">
      <PlatformHealthMonitor />
    </div>
  )
}
