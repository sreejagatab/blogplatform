import { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { EventPaymentForm } from '@/components/forms/event-payment-form'

export const metadata: Metadata = {
  title: 'Event Payment',
  description: 'Complete your event registration payment.',
}

export default function EventPaymentPage() {
  return (
    <PageLayout>
      <PageHero
        title="Complete Your Registration"
        description="Secure your spot by completing the payment process."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div>Loading payment form...</div>}>
            <EventPaymentForm />
          </Suspense>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
