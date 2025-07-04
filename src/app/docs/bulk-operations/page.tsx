import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Upload, 
  Calendar,
  Edit,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bulk Operations Guide',
  description: 'Learn how to manage multiple posts efficiently with bulk operations and batch processing.',
}

const bulkFeatures = [
  {
    icon: Upload,
    title: 'Bulk Upload',
    description: 'Upload multiple posts at once from CSV or spreadsheet',
    capabilities: [
      'Import from CSV/Excel files',
      'Batch image upload',
      'Automatic content parsing',
      'Error validation and reporting'
    ]
  },
  {
    icon: Calendar,
    title: 'Bulk Scheduling',
    description: 'Schedule multiple posts across different times and platforms',
    capabilities: [
      'Smart time distribution',
      'Platform-specific scheduling',
      'Recurring post patterns',
      'Timezone management'
    ]
  },
  {
    icon: Edit,
    title: 'Bulk Editing',
    description: 'Edit multiple posts simultaneously with batch operations',
    capabilities: [
      'Find and replace text',
      'Add/remove hashtags',
      'Update platform settings',
      'Modify scheduling times'
    ]
  },
  {
    icon: Package,
    title: 'Bulk Actions',
    description: 'Perform actions on multiple posts at once',
    capabilities: [
      'Publish/unpublish posts',
      'Delete multiple posts',
      'Archive old content',
      'Export post data'
    ]
  }
]

const csvFormat = [
  { field: 'title', description: 'Post title or headline', required: true },
  { field: 'content', description: 'Main post content/body', required: true },
  { field: 'platforms', description: 'Target platforms (comma-separated)', required: true },
  { field: 'schedule_time', description: 'When to publish (YYYY-MM-DD HH:MM)', required: false },
  { field: 'hashtags', description: 'Hashtags (comma-separated)', required: false },
  { field: 'image_url', description: 'URL to image file', required: false },
  { field: 'category', description: 'Content category', required: false }
]

export default function BulkOperationsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Bulk Operations Guide"
        description="Efficiently manage large volumes of content with powerful bulk operations and batch processing tools."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bulk Operations Center
              </CardTitle>
              <CardDescription>
                Manage multiple posts efficiently with batch operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/admin/posts/bulk-upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Upload
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs/bulk-operations/template.csv" download>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Template
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Bulk Operation Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bulkFeatures.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Capabilities:</h4>
                    <ul className="space-y-1">
                      {feature.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CSV Upload Format */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>CSV Upload Format</CardTitle>
              <CardDescription>
                Use this format when uploading multiple posts via CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-3 text-left">Field</th>
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                      <th className="border border-gray-300 p-3 text-left">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvFormat.map((field, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3 font-mono text-sm">{field.field}</td>
                        <td className="border border-gray-300 p-3 text-sm">{field.description}</td>
                        <td className="border border-gray-300 p-3">
                          <Badge variant={field.required ? 'destructive' : 'secondary'}>
                            {field.required ? 'Required' : 'Optional'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Example CSV Row:</h4>
                <code className="text-sm">
                  "How to boost productivity","5 proven strategies to increase your daily productivity...","twitter,linkedin","2024-12-25 09:00","#productivity,#tips","https://example.com/image.jpg","Business"
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Operations Workflow */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Bulk Operations Workflow</CardTitle>
              <CardDescription>
                Step-by-step process for efficient bulk content management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Prepare Content</h3>
                  <p className="text-sm text-muted-foreground">Create your content in spreadsheet or prepare individual posts</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Upload & Validate</h3>
                  <p className="text-sm text-muted-foreground">Upload your file and review validation results</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Configure Settings</h3>
                  <p className="text-sm text-muted-foreground">Set scheduling, platforms, and other bulk settings</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Execute & Monitor</h3>
                  <p className="text-sm text-muted-foreground">Run bulk operations and monitor progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Bulk Operations Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Test with small batches first</li>
                    <li>• Validate data before uploading</li>
                    <li>• Use consistent formatting</li>
                    <li>• Schedule posts at optimal times</li>
                    <li>• Review content for quality</li>
                    <li>• Keep backups of your data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Upload without validation</li>
                    <li>• Schedule too many posts at once</li>
                    <li>• Ignore error messages</li>
                    <li>• Use inconsistent data formats</li>
                    <li>• Forget to check platform limits</li>
                    <li>• Skip content quality review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Advanced Bulk Features
              </CardTitle>
              <CardDescription>
                Powerful features for enterprise-level content management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Smart Scheduling</h3>
                  <p className="text-sm text-muted-foreground">AI-powered optimal time distribution across your content calendar</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Content Variations</h3>
                  <p className="text-sm text-muted-foreground">Automatically generate platform-specific variations of your content</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bulk Analytics</h3>
                  <p className="text-sm text-muted-foreground">Analyze performance across all your bulk-uploaded content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Bulk Operations</h2>
            <p className="text-muted-foreground mb-6">
              Streamline your content management with powerful bulk operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/posts/bulk">
                  <Package className="mr-2 h-4 w-4" />
                  Open Bulk Operations
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/scheduling">
                  Learn About Scheduling
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
