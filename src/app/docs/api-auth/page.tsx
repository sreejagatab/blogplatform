import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Key, 
  Shield, 
  Code, 
  Lock, 
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Authentication - Documentation',
  description: 'Learn how to authenticate with the Universal Blog Platform API using API keys, OAuth, and other security methods.',
}

const authMethods = [
  {
    name: 'API Key Authentication',
    description: 'Simple authentication using API keys for server-to-server communication',
    icon: Key,
    security: 'Medium',
    complexity: 'Low',
    useCase: 'Backend integrations, automated scripts, server applications',
    pros: ['Simple to implement', 'No user interaction required', 'Good for automation'],
    cons: ['Keys can be compromised', 'No user-specific permissions', 'Requires secure storage']
  },
  {
    name: 'OAuth 2.0',
    description: 'Industry-standard authorization framework for secure user authentication',
    icon: Shield,
    security: 'High',
    complexity: 'Medium',
    useCase: 'User-facing applications, third-party integrations, mobile apps',
    pros: ['User-specific permissions', 'Secure token exchange', 'Revokable access'],
    cons: ['More complex implementation', 'Requires user interaction', 'Token management needed']
  },
  {
    name: 'JWT Tokens',
    description: 'JSON Web Tokens for stateless authentication and authorization',
    icon: Code,
    security: 'High',
    complexity: 'Medium',
    useCase: 'Single-page applications, microservices, distributed systems',
    pros: ['Stateless authentication', 'Contains user claims', 'Cross-domain support'],
    cons: ['Token size limitations', 'Difficult to revoke', 'Requires careful validation']
  }
]

const securityBestPractices = [
  {
    title: 'Secure Key Storage',
    description: 'Store API keys and secrets securely to prevent unauthorized access',
    practices: [
      'Use environment variables for API keys',
      'Never commit secrets to version control',
      'Use secure key management services',
      'Rotate keys regularly'
    ]
  },
  {
    title: 'Rate Limiting',
    description: 'Implement rate limiting to prevent abuse and ensure fair usage',
    practices: [
      'Set appropriate rate limits per API key',
      'Implement exponential backoff for retries',
      'Monitor usage patterns for anomalies',
      'Provide clear rate limit headers'
    ]
  },
  {
    title: 'Access Control',
    description: 'Implement proper access controls and permission management',
    practices: [
      'Use principle of least privilege',
      'Implement scope-based permissions',
      'Regular access reviews and audits',
      'Immediate revocation capabilities'
    ]
  },
  {
    title: 'Monitoring & Logging',
    description: 'Monitor API usage and maintain comprehensive audit logs',
    practices: [
      'Log all API requests and responses',
      'Monitor for suspicious activity',
      'Set up alerts for unusual patterns',
      'Regular security audits'
    ]
  }
]

const codeExamples = [
  {
    title: 'API Key Authentication',
    language: 'JavaScript',
    code: `// Using API Key in headers
const response = await fetch('https://api.universalblog.com/v1/posts', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`
  },
  {
    title: 'OAuth 2.0 Flow',
    language: 'JavaScript',
    code: `// OAuth 2.0 Authorization Code Flow
const authUrl = 'https://api.universalblog.com/oauth/authorize?' +
  'client_id=YOUR_CLIENT_ID&' +
  'redirect_uri=YOUR_REDIRECT_URI&' +
  'response_type=code&' +
  'scope=read write';

// Redirect user to authUrl
window.location.href = authUrl;

// Exchange code for token
const tokenResponse = await fetch('https://api.universalblog.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE',
    redirect_uri: 'YOUR_REDIRECT_URI'
  })
});`
  }
]

export default function APIAuthPage() {
  return (
    <PageLayout>
      <PageHero
        title="API Authentication"
        description="Secure your API integrations with robust authentication methods and best practices."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6" />
                API Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                The Universal Blog Platform API uses industry-standard authentication methods to ensure 
                secure access to your content and data. Choose the authentication method that best fits 
                your use case and security requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure by Default</h3>
                  <p className="text-sm text-muted-foreground">
                    All API endpoints require authentication
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Key className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Multiple Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for API keys, OAuth 2.0, and JWT tokens
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Granular Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Fine-grained permissions and access control
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Methods */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Authentication Methods</h2>
            <div className="space-y-6">
              {authMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{method.name}</CardTitle>
                          <Badge variant="outline">Security: {method.security}</Badge>
                          <Badge variant="secondary">Complexity: {method.complexity}</Badge>
                        </div>
                        <CardDescription>{method.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Best For:</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                          {method.useCase}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Advantages:</h4>
                        <ul className="space-y-1">
                          {method.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="text-sm text-green-600 flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-orange-700">Considerations:</h4>
                        <ul className="space-y-1">
                          {method.cons.map((con, conIndex) => (
                            <li key={conIndex} className="text-sm text-orange-600 flex items-start gap-1">
                              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Implementation Examples</h2>
            <div className="space-y-6">
              {codeExamples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{example.title}</CardTitle>
                      <Badge variant="outline">{example.language}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => navigator.clipboard.writeText(example.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Security Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityBestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{practice.title}</CardTitle>
                    <CardDescription>{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {practice.practices.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* API Key Management */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-6 w-6" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Manage your API keys securely through the platform dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Generate and revoke API keys instantly</li>
                      <li>• Set custom expiration dates</li>
                      <li>• Configure scope-based permissions</li>
                      <li>• Monitor key usage and activity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Security Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Rate limiting per API key</li>
                      <li>• IP address restrictions</li>
                      <li>• Usage analytics and alerts</li>
                      <li>• Automatic key rotation options</li>
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Security Note</h4>
                      <p className="text-sm text-yellow-700">
                        API keys provide full access to your account. Never share them publicly, 
                        commit them to version control, or use them in client-side applications. 
                        Always store them securely and rotate them regularly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Rate Limits & Quotas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,000</div>
                    <div className="text-sm">Requests per hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">10,000</div>
                    <div className="text-sm">Requests per day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">100,000</div>
                    <div className="text-sm">Requests per month</div>
                  </div>
                </div>
                <Separator className="bg-blue-200" />
                <p className="text-sm">
                  Rate limits are enforced per API key. If you need higher limits, 
                  contact our support team or upgrade to a higher plan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Get Started with API Authentication</h2>
            <p className="text-muted-foreground mb-6">
              Set up secure API access and start integrating with Universal Blog Platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/api-keys">
                  <Key className="mr-2 h-4 w-4" />
                  Manage API Keys
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/api">
                  View API Reference
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
