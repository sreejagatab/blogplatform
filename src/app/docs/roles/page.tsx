import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Shield, 
  Crown, 
  Edit, 
  Eye,
  Settings,
  ArrowRight,
  CheckCircle,
  X,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'User Roles & Permissions - Documentation',
  description: 'Learn how to manage team members, assign roles, and control access permissions in Universal Blog Platform.',
}

const roles = [
  {
    name: 'Owner',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Full access to all features and settings. Can manage billing and delete the account.',
    permissions: {
      content: ['Create', 'Edit', 'Delete', 'Publish', 'Schedule'],
      team: ['Invite', 'Remove', 'Change Roles', 'View All'],
      settings: ['Account', 'Billing', 'Integrations', 'API'],
      analytics: ['View All', 'Export', 'Custom Reports'],
      admin: ['Full Access']
    },
    limitations: 'None - complete access to all features'
  },
  {
    name: 'Admin',
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    description: 'Manage team members and most settings. Cannot access billing or delete the account.',
    permissions: {
      content: ['Create', 'Edit', 'Delete', 'Publish', 'Schedule'],
      team: ['Invite', 'Remove', 'Change Roles', 'View All'],
      settings: ['Integrations', 'API', 'Workflows'],
      analytics: ['View All', 'Export', 'Custom Reports'],
      admin: ['User Management', 'Content Settings']
    },
    limitations: 'Cannot access billing settings or delete account'
  },
  {
    name: 'Editor',
    icon: Edit,
    color: 'bg-blue-100 text-blue-800',
    description: 'Create, edit, and publish content. Can manage content workflows and scheduling.',
    permissions: {
      content: ['Create', 'Edit', 'Publish', 'Schedule'],
      team: ['View Team'],
      settings: ['Content Preferences'],
      analytics: ['Content Performance', 'Basic Reports'],
      admin: ['Content Management']
    },
    limitations: 'Cannot manage team members or account settings'
  },
  {
    name: 'Author',
    icon: Edit,
    color: 'bg-green-100 text-green-800',
    description: 'Create and edit content, but requires approval before publishing.',
    permissions: {
      content: ['Create', 'Edit', 'Submit for Review'],
      team: ['View Team'],
      settings: ['Personal Preferences'],
      analytics: ['Own Content Performance'],
      admin: ['None']
    },
    limitations: 'Cannot publish without approval or access team settings'
  },
  {
    name: 'Viewer',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800',
    description: 'Read-only access to content and basic analytics. Cannot create or edit.',
    permissions: {
      content: ['View Only'],
      team: ['View Team'],
      settings: ['Personal Preferences'],
      analytics: ['Basic View'],
      admin: ['None']
    },
    limitations: 'Read-only access - cannot create, edit, or publish content'
  }
]

const permissionCategories = [
  {
    name: 'Content Management',
    description: 'Control over creating, editing, and publishing content',
    permissions: [
      'Create new posts and content',
      'Edit existing content',
      'Delete content',
      'Publish content immediately',
      'Schedule content for later',
      'Manage content categories and tags',
      'Upload and manage media files'
    ]
  },
  {
    name: 'Team Management',
    description: 'Ability to manage team members and their access',
    permissions: [
      'Invite new team members',
      'Remove team members',
      'Change user roles and permissions',
      'View team member activity',
      'Manage team workflows',
      'Set up approval processes'
    ]
  },
  {
    name: 'Analytics & Reporting',
    description: 'Access to performance data and insights',
    permissions: [
      'View content performance metrics',
      'Access advanced analytics',
      'Create custom reports',
      'Export data and reports',
      'View team performance data',
      'Access ROI tracking'
    ]
  },
  {
    name: 'Account Settings',
    description: 'Control over account configuration and integrations',
    permissions: [
      'Manage account settings',
      'Configure platform integrations',
      'Manage API keys and webhooks',
      'Set up automation workflows',
      'Access billing and subscription',
      'Delete account'
    ]
  }
]

export default function RolesPage() {
  return (
    <PageLayout>
      <PageHero
        title="User Roles & Permissions"
        description="Manage your team effectively with granular role-based access control and permission management."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Team Collaboration Made Simple
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Universal Blog Platform provides flexible role-based access control to help you manage 
                your team effectively. Assign appropriate permissions to team members based on their 
                responsibilities and ensure secure, organized collaboration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can access what with granular permissions
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Team Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamline workflows with appropriate role assignments
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple interface to manage roles and permissions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Roles */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Available Roles</h2>
            <div className="space-y-6">
              {roles.map((role, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg p-2 ${role.color}`}>
                        <role.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {role.name}
                          <Badge variant="outline">{role.name}</Badge>
                        </CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Permissions</h4>
                        <div className="space-y-3">
                          {Object.entries(role.permissions).map(([category, perms]) => (
                            <div key={category}>
                              <h5 className="text-sm font-medium capitalize mb-1">{category}:</h5>
                              <div className="flex flex-wrap gap-1">
                                {perms.map((perm, permIndex) => (
                                  <Badge key={permIndex} variant="secondary" className="text-xs">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Limitations</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {role.limitations}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Permission Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Permission Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {permissionCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.permissions.map((permission, permIndex) => (
                        <li key={permIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Role Comparison */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Role Comparison Matrix</CardTitle>
              <CardDescription>Quick reference for role capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Permission</th>
                      <th className="text-center p-2">Owner</th>
                      <th className="text-center p-2">Admin</th>
                      <th className="text-center p-2">Editor</th>
                      <th className="text-center p-2">Author</th>
                      <th className="text-center p-2">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Create Content',
                      'Edit Content',
                      'Publish Content',
                      'Delete Content',
                      'Manage Team',
                      'View Analytics',
                      'Account Settings',
                      'Billing Access'
                    ].map((permission, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{permission}</td>
                        <td className="text-center p-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center p-2">
                          {permission === 'Billing Access' ? (
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-2">
                          {['Manage Team', 'Account Settings', 'Billing Access'].includes(permission) ? (
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-2">
                          {['Create Content', 'Edit Content'].includes(permission) ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-2">
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Role Assignment Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <div>
                  <h4 className="font-semibold mb-2">Principle of Least Privilege</h4>
                  <p className="text-sm">
                    Assign the minimum permissions necessary for each team member to perform their job effectively.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Regular Permission Reviews</h4>
                  <p className="text-sm">
                    Periodically review and update team member roles, especially when responsibilities change.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Clear Role Definitions</h4>
                  <p className="text-sm">
                    Ensure all team members understand their role limitations and how to request additional access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Manage Your Team</h2>
            <p className="text-muted-foreground mb-6">
              Set up roles and permissions to create an efficient, secure team collaboration environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/team">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Team Members
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/workflows">
                  Learn About Workflows
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
