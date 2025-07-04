import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { InfinitePostFeed } from '@/components/blog/infinite-post-feed'
import { NewsletterSignup } from '@/components/sections/newsletter-signup'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Posts */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Articles
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedPosts />
            </Suspense>
          </div>
        </section>
        
        {/* Infinite Scroll Blog Feed */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Latest Articles
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <InfinitePostFeed />
            </Suspense>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <NewsletterSignup />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
