'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Check,
  Github,
  Chrome,
  Shield,
  Eye,
  LogIn,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

const demoUsers = [
  {
    email: 'admin@blogplatform.com',
    name: 'Admin User',
    role: 'ADMIN',
    description: 'Full platform access',
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  {
    email: 'editor@blogplatform.com',
    name: 'Editor User',
    role: 'EDITOR',
    description: 'Content management',
    icon: <User className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    email: 'viewer@blogplatform.com',
    name: 'Viewer User',
    role: 'VIEWER',
    description: 'Read-only access',
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-green-500'
  }
]

const features = [
  'Distribute to 1000+ platforms',
  'AI-powered content creation',
  'Advanced analytics dashboard',
  'Team collaboration tools',
  'Priority customer support',
  '14-day free trial'
]

function AuthContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'signin')

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(demoEmail)
    setError(null)

    try {
      const result = await signIn('demo', {
        email: demoEmail,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Demo login failed. Please ensure the demo data is seeded.')
      } else if (result?.ok) {
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error('Demo login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setLoading(provider)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      setError('OAuth login failed.')
      setLoading(null)
    }
  }

  return (
    <PageLayout>
      <ContentSection className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Auth Forms */}
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome to Universal Blog Platform</h1>
                <p className="text-muted-foreground">
                  Sign in to your account or create a new one to get started
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Authentication</CardTitle>
                  <CardDescription className="text-center">
                    Access your account or create a new one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="signin" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </TabsTrigger>
                      <TabsTrigger value="demo" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Demo
                      </TabsTrigger>
                    </TabsList>

                    {/* Demo Tab */}
                    <TabsContent value="demo" className="space-y-4 mt-6">
                      <div className="text-center mb-4">
                        <h3 className="font-semibold">Demo Accounts</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a demo account to explore features
                        </p>
                      </div>

                      {demoUsers.map((user) => (
                        <Button
                          key={user.email}
                          onClick={() => handleDemoLogin(user.email)}
                          disabled={loading !== null}
                          variant="outline"
                          className="w-full justify-start space-x-3 h-auto p-4"
                        >
                          <div className={`p-2 rounded-full ${user.color} text-white`}>
                            {user.icon}
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.description}</div>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {user.role}
                            </Badge>
                          </div>
                          {loading === user.email && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                          )}
                        </Button>
                      ))}

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <Label htmlFor="demo-email">Or enter demo email</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="demo-email"
                            type="email"
                            placeholder="demo email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading !== null}
                          />
                          <Button
                            onClick={() => handleDemoLogin(email)}
                            disabled={!email || loading !== null}
                            variant="secondary"
                          >
                            Sign In
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Sign In Tab */}
                    <TabsContent value="signin" className="space-y-6 mt-6">
                      {/* OAuth Buttons */}
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleOAuthLogin('google')}
                          disabled={loading !== null}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          <Chrome className="mr-2 h-4 w-4" />
                          Continue with Google
                          {loading === 'google' && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleOAuthLogin('github')}
                          disabled={loading !== null}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Continue with GitHub
                          {loading === 'github' && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                          )}
                        </Button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with email
                          </span>
                        </div>
                      </div>

                      {/* Email Sign In Form */}
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="signin-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="signin-email" type="email" placeholder="john@example.com" className="pl-10" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="signin-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="signin-password" type="password" placeholder="Enter your password" className="pl-10" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <Label htmlFor="remember" className="text-sm">Remember me</Label>
                          </div>
                          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>

                        <Button size="lg" className="w-full">
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>

                      <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <button
                          onClick={() => setActiveTab('signup')}
                          className="text-primary hover:underline"
                        >
                          Sign up
                        </button>
                      </div>
                    </TabsContent>

                    {/* Sign Up Tab */}
                    <TabsContent value="signup" className="space-y-6 mt-6">
                      {/* OAuth Buttons */}
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleOAuthLogin('google')}
                          disabled={loading !== null}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          <Chrome className="mr-2 h-4 w-4" />
                          Continue with Google
                          {loading === 'google' && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleOAuthLogin('github')}
                          disabled={loading !== null}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Continue with GitHub
                          {loading === 'github' && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                          )}
                        </Button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with email
                          </span>
                        </div>
                      </div>

                      {/* Email Sign Up Form */}
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="signup-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="signup-email" type="email" placeholder="john@example.com" className="pl-10" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="signup-password" type="password" placeholder="Create a strong password" className="pl-10" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="company">Company (Optional)</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="company" placeholder="Your Company" className="pl-10" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="plan">Choose Plan</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter (Free)</SelectItem>
                              <SelectItem value="professional">Professional ($29/month)</SelectItem>
                              <SelectItem value="enterprise">Enterprise ($99/month)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing" />
                          <Label htmlFor="marketing" className="text-sm">
                            Send me product updates and marketing emails
                          </Label>
                        </div>

                        <Button size="lg" className="w-full">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>

                      <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <button
                          onClick={() => setActiveTab('signin')}
                          className="text-primary hover:underline"
                        >
                          Sign in
                        </button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right side - Benefits */}
            <div className="lg:pl-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Why Choose Universal Blog Platform?</h2>
                <p className="text-muted-foreground text-lg">
                  Join thousands of content creators who have transformed their reach and engagement with our platform.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">🎯 Free Trial Includes:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Full access to all features</li>
                    <li>• No credit card required</li>
                    <li>• 14 days to explore</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Trusted by 50,000+ content creators worldwide
                </p>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">+50,000 others</span>
                </div>
              </div>

              {/* Demo Info */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Demo Environment</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Use the Demo tab to explore the platform with pre-configured accounts. No registration required!
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
