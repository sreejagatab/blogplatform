import { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { EventConfirmation } from '@/components/events/event-confirmation'

export const metadata: Metadata = {
  title: 'Registration Confirmed',
  description: 'Your event registration has been confirmed.',
}

export default function EventConfirmationPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <Suspense fallback={<div>Loading confirmation...</div>}>
            <EventConfirmation />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  )
}
