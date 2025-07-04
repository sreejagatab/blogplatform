'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  ArrowLeft,
  Home,
  Mail,
  AlertTriangle,
  Lock,
  User,
  Key
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="relative">
              <Shield className="h-24 w-24 text-red-500 mx-auto mb-4" />
              <Lock className="h-8 w-8 text-red-600 absolute top-8 left-1/2 transform -translate-x-1/2" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Access Denied
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Please contact an administrator if you believe this is an error.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Common Reasons
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    You're not signed in to your account
                  </li>
                  <li className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Your account doesn't have the required permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    The page requires a higher access level
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Your session may have expired
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Contact Support:</p>
                    <a href="mailto:support@universalblog.com" className="text-blue-600 hover:text-blue-700">
                      support@universalblog.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Admin Contact:</p>
                    <a href="mailto:admin@universalblog.com" className="text-blue-600 hover:text-blue-700">
                      admin@universalblog.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Help Center:</p>
                    <Link href="/help" className="text-blue-600 hover:text-blue-700">
                      Visit Help Center →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/auth/signin">
                <Shield className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>

            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Request Access
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              If you need access to this resource, please contact your administrator with the following information:
            </p>
            <div className="text-left bg-white dark:bg-gray-800 p-4 rounded border text-xs font-mono">
              <div>Requested URL: {typeof window !== 'undefined' ? window.location.href : '/unauthorized'}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
              <div>User Agent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Quick Links:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-blue-600 hover:text-blue-700">
                About Us
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                Contact
              </Link>
              <Link href="/help" className="text-blue-600 hover:text-blue-700">
                Help Center
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}


