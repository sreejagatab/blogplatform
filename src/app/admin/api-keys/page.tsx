import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Keys - Admin',
  description: 'Manage your API keys for integrations and automation.',
}

const apiKeys = [
  {
    id: '1',
    name: 'Production Integration',
    key: 'ubp_live_1234567890abcdef',
    created: '2024-11-15',
    lastUsed: '2 hours ago',
    permissions: ['read', 'write', 'publish'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Development Testing',
    key: 'ubp_test_abcdef1234567890',
    created: '2024-12-01',
    lastUsed: '1 day ago',
    permissions: ['read', 'write'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    key: 'ubp_live_fedcba0987654321',
    created: '2024-10-20',
    lastUsed: 'Never',
    permissions: ['read'],
    status: 'inactive'
  }
]

export default function APIKeysPage() {
  return (
    <PageLayout>
      <PageHero
        title="API Keys"
        description="Manage your API keys for integrations, automation, and third-party applications."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Create New Key */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New API Key
              </CardTitle>
              <CardDescription>
                Generate a new API key for your integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input 
                    id="keyName" 
                    placeholder="e.g., Production Integration"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permissions">Permissions</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer">Read</Badge>
                    <Badge variant="outline" className="cursor-pointer">Write</Badge>
                    <Badge variant="outline" className="cursor-pointer">Publish</Badge>
                  </div>
                </div>
              </div>
              <Button className="mt-4">
                <Key className="mr-2 h-4 w-4" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys and monitor their usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{key.name}</h3>
                          <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                            {key.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-muted-foreground">API Key:</Label>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                {key.key.substring(0, 20)}...
                              </code>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Created {key.created}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              <span>Last used {key.lastUsed}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {key.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                Monitor your API usage and rate limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">Requests Today</div>
                  <div className="text-xs text-green-600 mt-1">Within limits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                  <div className="text-xs text-green-600 mt-1">Excellent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Active Keys</div>
                  <div className="text-xs text-muted-foreground mt-1">5 max allowed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertTriangle className="h-5 w-5" />
                Security Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-orange-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span className="text-sm">Store API keys securely and never commit them to version control</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span className="text-sm">Use environment variables to manage keys in production</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span className="text-sm">Rotate keys regularly and revoke unused ones</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span className="text-sm">Use the minimum required permissions for each key</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
