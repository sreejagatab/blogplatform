import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar,
  User,
  Tag
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: {
    id: string
  }
}

// Mock post data - in production, fetch from database
const mockPost = {
  id: '1',
  title: 'AI Content Creation Best Practices',
  slug: 'ai-content-creation-best-practices',
  content: `# AI Content Creation Best Practices

Artificial Intelligence has revolutionized the way we create content. In this comprehensive guide, we'll explore the best practices for leveraging AI tools to enhance your content creation process.

## Understanding AI Content Tools

AI content tools have become increasingly sophisticated, offering capabilities that range from simple text generation to complex content optimization. Here are the key areas where AI can assist:

### 1. Content Generation
- Blog post outlines and drafts
- Social media captions
- Email marketing copy
- Product descriptions

### 2. Content Optimization
- SEO keyword integration
- Readability improvements
- Tone and style adjustments
- Grammar and spelling corrections

## Best Practices for AI Content Creation

### Start with Clear Prompts
The quality of AI-generated content heavily depends on the quality of your prompts. Be specific about:
- Target audience
- Content tone and style
- Key points to cover
- Desired length

### Review and Edit
Never publish AI-generated content without human review. Always:
- Fact-check all information
- Ensure brand voice consistency
- Add personal insights and experiences
- Optimize for your specific audience

### Maintain Authenticity
While AI can help with efficiency, maintaining authenticity is crucial:
- Add personal anecdotes
- Include original research or data
- Ensure the content reflects your brand values
- Keep the human element in your storytelling

## Conclusion

AI is a powerful tool that can significantly enhance your content creation process when used correctly. By following these best practices, you can leverage AI to create high-quality, engaging content while maintaining authenticity and brand consistency.`,
  excerpt: 'Learn how to effectively use AI tools for content creation while maintaining authenticity and quality.',
  status: 'PUBLISHED',
  publishedAt: '2024-12-20T10:00:00Z',
  author: {
    name: 'Sarah Johnson',
    email: 'sarah@universalblog.com'
  },
  category: {
    name: 'AI & Technology',
    slug: 'ai-technology'
  },
  tags: ['AI', 'Content Creation', 'Best Practices', 'Automation'],
  viewCount: 1247,
  likeCount: 89,
  commentCount: 23
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In production, fetch post data here
  return {
    title: `Edit: ${mockPost.title}`,
    description: `Edit the post: ${mockPost.title}`
  }
}

export default function EditPostPage({ params }: Props) {
  // In production, fetch post data based on params.id
  const post = mockPost

  if (!post) {
    notFound()
  }

  return (
    <PageLayout>
      <PageHero
        title="Edit Post"
        description={`Editing: ${post.title}`}
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/admin/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
          </div>

          {/* Post Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Post Information</CardTitle>
                  <CardDescription>Current post details and metadata</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Author: {post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>Category: {post.category.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <form className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Edit the main content and metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    defaultValue={post.title}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    defaultValue={post.slug}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    defaultValue={post.excerpt}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="w-full px-3 py-2 border rounded-md">
                      <option value={post.category.slug}>{post.category.name}</option>
                      <option value="content-strategy">Content Strategy</option>
                      <option value="social-media">Social Media</option>
                      <option value="analytics">Analytics</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" className="w-full px-3 py-2 border rounded-md">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED" selected={post.status === 'PUBLISHED'}>Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input 
                    id="tags" 
                    defaultValue={post.tags.join(', ')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Edit the main post content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea 
                    id="content" 
                    defaultValue={post.content}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting. Use # for headings, ** for bold, * for italic.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input 
                    id="metaTitle" 
                    defaultValue={post.title}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea 
                    id="metaDescription" 
                    defaultValue={post.excerpt}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusKeyword">Focus Keyword</Label>
                  <Input 
                    id="focusKeyword" 
                    placeholder="e.g., AI content creation"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" type="button">
                  Preview Changes
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Update Post
                </Button>
              </div>
            </div>
          </form>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
