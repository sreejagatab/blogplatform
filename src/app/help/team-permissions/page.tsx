import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Shield, 
  Settings,
  Crown,
  ArrowRight,
  CheckCircle,
  X,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Managing Team Permissions',
  description: 'Learn how to set up and manage team member roles and permissions effectively.',
}

const roles = [
  {
    name: 'Owner',
    icon: Crown,
    description: 'Full access to all features and settings',
    permissions: [
      'Manage all content',
      'Add/remove team members',
      'Change billing settings',
      'Access all analytics',
      'Manage integrations',
      'Delete account'
    ],
    restrictions: []
  },
  {
    name: 'Admin',
    icon: Shield,
    description: 'Manage content and team members',
    permissions: [
      'Manage all content',
      'Add/remove team members',
      'View all analytics',
      'Manage integrations',
      'Configure settings'
    ],
    restrictions: [
      'Cannot change billing',
      'Cannot delete account'
    ]
  },
  {
    name: 'Editor',
    icon: Users,
    description: 'Create and edit content',
    permissions: [
      'Create content',
      'Edit own content',
      'Schedule posts',
      'View analytics',
      'Use AI tools'
    ],
    restrictions: [
      'Cannot manage team',
      'Cannot change settings',
      'Cannot delete others\' content'
    ]
  },
  {
    name: 'Viewer',
    icon: Settings,
    description: 'View-only access to content and analytics',
    permissions: [
      'View all content',
      'View analytics',
      'Export reports'
    ],
    restrictions: [
      'Cannot create content',
      'Cannot edit content',
      'Cannot manage team',
      'Cannot change settings'
    ]
  }
]

const managementSteps = [
  {
    step: 1,
    title: 'Invite Team Members',
    description: 'Send invitations via email with appropriate role assignment'
  },
  {
    step: 2,
    title: 'Set Permissions',
    description: 'Choose the right role based on their responsibilities'
  },
  {
    step: 3,
    title: 'Monitor Activity',
    description: 'Track team member actions and content contributions'
  },
  {
    step: 4,
    title: 'Adjust as Needed',
    description: 'Update roles and permissions as your team evolves'
  }
]

export default function TeamPermissionsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Managing Team Permissions"
        description="Learn how to effectively manage team member roles and permissions for secure collaboration."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Guide */}
          <Card className="mb-12 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Team Management Quick Guide</CardTitle>
              <CardDescription className="text-purple-700">
                Follow these steps to set up your team permissions properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {managementSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-2">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-purple-700">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Breakdown */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Team Roles & Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roles.map((role, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">✅ Can Do:</h4>
                        <ul className="space-y-1">
                          {role.permissions.map((permission, permIndex) => (
                            <li key={permIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{permission}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {role.restrictions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">❌ Cannot Do:</h4>
                          <ul className="space-y-1">
                            {role.restrictions.map((restriction, restIndex) => (
                              <li key={restIndex} className="flex items-start gap-2">
                                <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{restriction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Manage Team */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>How to Manage Your Team</CardTitle>
              <CardDescription>
                Step-by-step guide to adding and managing team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Adding Team Members</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      Go to Settings → Team Management
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      Click "Invite Team Member"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      Enter their email address
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      Select appropriate role
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">5.</span>
                      Send invitation
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Changing Permissions</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      Find the team member in your team list
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      Click the "Edit" button next to their name
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      Select new role from dropdown
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      Confirm the change
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Removing Team Members</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      Go to team member's profile
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      Click "Remove from Team"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      Confirm removal (this cannot be undone)
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Team Management Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Start with minimal permissions and add as needed</li>
                    <li>• Regularly review team member access</li>
                    <li>• Use descriptive role names</li>
                    <li>• Document team responsibilities</li>
                    <li>• Remove access when team members leave</li>
                    <li>• Train team members on their roles</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Give everyone admin access</li>
                    <li>• Share login credentials</li>
                    <li>• Ignore permission requests</li>
                    <li>• Forget to remove former team members</li>
                    <li>• Skip role explanations</li>
                    <li>• Allow unauthorized access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
                  <h4 className="font-semibold mb-2">Can I have multiple owners?</h4>
                  <p className="text-sm text-muted-foreground">
                    No, there can only be one owner per account. However, you can have multiple admins with similar permissions.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-green-400 bg-green-50">
                  <h4 className="font-semibold mb-2">How many team members can I add?</h4>
                  <p className="text-sm text-muted-foreground">
                    The number of team members depends on your plan. Check your billing page for current limits.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                  <h4 className="font-semibold mb-2">Can team members see each other's content?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, all team members can see content created by others, but editing permissions depend on their role.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with Team Management?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team can help you set up the perfect team structure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/roles">
                  Read Full Team Guide
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
