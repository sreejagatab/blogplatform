'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    // Check if user is authenticated
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/admin')
      return
    }

    // Check if user has admin or editor role
    const userRole = (session.user as any).role
    if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
      router.push('/unauthorized')
      return
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session?.user) {
    return null
  }

  const userRole = (session.user as any).role
  if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
    return null
  }

  const user = {
    id: session.user.id,
    name: session.user.name || 'User',
    email: session.user.email || '',
    image: session.user.image,
    role: userRole
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
