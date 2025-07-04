'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/layout/page-layout'
import {
  FileQuestion,
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  HelpCircle,
  Mail
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  const quickLinks = [
    {
      icon: Home,
      title: 'Homepage',
      description: 'Return to our main page',
      href: '/'
    },
    {
      icon: BookOpen,
      title: 'Blog',
      description: 'Browse our latest articles',
      href: '/blog'
    },
    {
      icon: Search,
      title: 'Documentation',
      description: 'Find help and guides',
      href: '/docs'
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Get support and answers',
      href: '/help'
    }
  ]

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              <FileQuestion className="h-32 w-32 text-muted-foreground mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>

            <Button size="lg" variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="mb-4">
                    {link.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={link.href}>
                      Visit {link.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Suggestion */}
          <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg mb-2">
              Looking for something specific?
            </h3>
            <p className="text-muted-foreground mb-4">
              Try searching our documentation or browse our help center for answers to common questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Visit Help Center
                </Link>
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
              {' '}and we'll help you find what you're looking for.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
