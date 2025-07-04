import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  ArrowLeft,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Universal Blog Platform password securely.',
}

export default function ForgotPasswordPage() {
  return (
    <PageLayout>
      <ContentSection className="py-12">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reset Your Password</CardTitle>
              <CardDescription>
                Enter the email address associated with your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="pl-10" 
                      required
                    />
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reset Instructions
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Check Your Email</p>
                    <p className="text-xs text-muted-foreground">
                      We'll send reset instructions to your email within 5 minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Click the Link</p>
                    <p className="text-xs text-muted-foreground">
                      Follow the secure link in the email to reset your password
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Create New Password</p>
                    <p className="text-xs text-muted-foreground">
                      Choose a strong, secure password for your account
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                href="/contact" 
                className="text-sm text-primary hover:underline"
              >
                Contact Support
              </Link>
              <Link 
                href="/auth/signin" 
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
