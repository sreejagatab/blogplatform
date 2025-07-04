'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the integrated auth page with demo tab active
    router.replace('/auth/signup?tab=demo')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
