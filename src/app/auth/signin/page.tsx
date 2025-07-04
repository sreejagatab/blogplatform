'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SignInRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Preserve any callback URL or other parameters
    const callbackUrl = searchParams.get('callbackUrl')
    const params = new URLSearchParams()

    if (callbackUrl) {
      params.set('callbackUrl', callbackUrl)
    }

    // Redirect to the integrated auth page
    const redirectUrl = `/auth/signup${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(redirectUrl)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

export default function SignInRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <SignInRedirectContent />
    </Suspense>
  )
}
