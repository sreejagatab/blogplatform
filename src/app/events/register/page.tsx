import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { EventRegistrationForm } from '@/components/forms/event-registration-form'

export const metadata: Metadata = {
  title: 'Event Registration',
  description: 'Register for Universal Blog Platform events and workshops.',
}

export default function EventRegistrationPage() {
  return (
    <PageLayout>
      <PageHero
        title="Event Registration"
        description="Complete your registration for our upcoming events and workshops."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-2xl mx-auto">
          <EventRegistrationForm />
        </div>
      </ContentSection>
    </PageLayout>
  )
}
