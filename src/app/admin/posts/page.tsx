import { Suspense } from 'react'
import { Metadata } from 'next'
import { PostManagement } from '@/components/admin/post-management'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Post Management - Admin',
  description: 'Manage blog posts and content',
}

export default function AdminPostsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Post Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage your blog posts
        </p>
      </div>
      
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostManagement />
      </Suspense>
    </div>
  )
}
