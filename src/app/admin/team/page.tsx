import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  UserPlus, 
  Users, 
  Crown, 
  Shield, 
  Edit, 
  Eye,
  MoreHorizontal,
  Mail,
  Calendar,
  Activity
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Team Management - Admin',
  description: 'Manage team members, roles, and permissions.',
}

const teamMembers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'Owner',
    avatar: '/avatars/john.jpg',
    status: 'active',
    lastActive: '2 hours ago',
    joinedDate: '2024-01-15',
    postsCreated: 45
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Admin',
    avatar: '/avatars/sarah.jpg',
    status: 'active',
    lastActive: '1 day ago',
    joinedDate: '2024-02-20',
    postsCreated: 32
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Editor',
    avatar: '/avatars/mike.jpg',
    status: 'active',
    lastActive: '3 hours ago',
    joinedDate: '2024-03-10',
    postsCreated: 28
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@company.com',
    role: 'Author',
    avatar: '/avatars/emma.jpg',
    status: 'active',
    lastActive: '5 hours ago',
    joinedDate: '2024-04-05',
    postsCreated: 15
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@company.com',
    role: 'Viewer',
    avatar: '/avatars/david.jpg',
    status: 'inactive',
    lastActive: '2 weeks ago',
    joinedDate: '2024-05-12',
    postsCreated: 0
  }
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Owner':
      return Crown
    case 'Admin':
      return Shield
    case 'Editor':
      return Edit
    case 'Author':
      return Edit
    case 'Viewer':
      return Eye
    default:
      return Users
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Owner':
      return 'bg-yellow-100 text-yellow-800'
    case 'Admin':
      return 'bg-red-100 text-red-800'
    case 'Editor':
      return 'bg-blue-100 text-blue-800'
    case 'Author':
      return 'bg-green-100 text-green-800'
    case 'Viewer':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function TeamManagementPage() {
  return (
    <PageLayout>
      <PageHero
        title="Team Management"
        description="Manage your team members, assign roles, and control access permissions."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Edit className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{teamMembers.reduce((sum, m) => sum + m.postsCreated, 0)}</div>
                <div className="text-sm text-muted-foreground">Posts Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <UserPlus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Seats Available</div>
              </CardContent>
            </Card>
          </div>

          {/* Invite New Member */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite Team Member
              </CardTitle>
              <CardDescription>
                Send an invitation to add a new team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input 
                  placeholder="Enter email address"
                  className="flex-1"
                />
                <select className="px-3 py-2 border rounded-md">
                  <option>Author</option>
                  <option>Editor</option>
                  <option>Admin</option>
                  <option>Viewer</option>
                </select>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team members and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const RoleIcon = getRoleIcon(member.role)
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Last active: {member.lastActive}</span>
                            <span>Joined: {new Date(member.joinedDate).toLocaleDateString()}</span>
                            <span>Posts: {member.postsCreated}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`rounded p-1 ${getRoleColor(member.role)}`}>
                            <RoleIcon className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium">{member.role}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Overview of what each role can do
              </CardDescription>
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
                        <td className="text-center p-2">✅</td>
                        <td className="text-center p-2">
                          {permission === 'Billing Access' ? '❌' : '✅'}
                        </td>
                        <td className="text-center p-2">
                          {['Manage Team', 'Account Settings', 'Billing Access'].includes(permission) ? '❌' : '✅'}
                        </td>
                        <td className="text-center p-2">
                          {['Create Content', 'Edit Content'].includes(permission) ? '✅' : '❌'}
                        </td>
                        <td className="text-center p-2">❌</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
