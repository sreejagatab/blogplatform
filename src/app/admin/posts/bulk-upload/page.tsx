import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle,
  X,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bulk Upload - Admin',
  description: 'Upload multiple posts at once using CSV files.',
}

export default function BulkUploadPage() {
  return (
    <PageLayout>
      <PageHero
        title="Bulk Upload Posts"
        description="Upload multiple posts at once using CSV files for efficient content management."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/docs/bulk-operations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bulk Operations
              </Link>
            </Button>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing your posts data. Maximum file size: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drop your CSV file here</h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse and select a file
                </p>
                <Button>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href="/docs/bulk-operations/template.csv" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Link>
                </Button>
                <div className="text-sm text-muted-foreground">
                  Supported formats: CSV
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>CSV Template Format</CardTitle>
              <CardDescription>
                Your CSV file should include the following columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Column</th>
                      <th className="text-left p-2 font-medium">Required</th>
                      <th className="text-left p-2 font-medium">Description</th>
                      <th className="text-left p-2 font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono">title</td>
                      <td className="p-2"><Badge variant="destructive" className="text-xs">Required</Badge></td>
                      <td className="p-2">Post title</td>
                      <td className="p-2 text-muted-foreground">My Amazing Blog Post</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">content</td>
                      <td className="p-2"><Badge variant="destructive" className="text-xs">Required</Badge></td>
                      <td className="p-2">Post content (supports markdown)</td>
                      <td className="p-2 text-muted-foreground">This is my post content...</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">excerpt</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">Brief summary</td>
                      <td className="p-2 text-muted-foreground">A brief excerpt...</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">status</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">draft, published, scheduled</td>
                      <td className="p-2 text-muted-foreground">draft</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">category</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">Post category</td>
                      <td className="p-2 text-muted-foreground">Technology</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">tags</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">Comma-separated tags</td>
                      <td className="p-2 text-muted-foreground">tech,ai,automation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">publish_date</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">ISO 8601 format</td>
                      <td className="p-2 text-muted-foreground">2024-12-20T10:00:00Z</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">platforms</td>
                      <td className="p-2"><Badge variant="secondary" className="text-xs">Optional</Badge></td>
                      <td className="p-2">Comma-separated platforms</td>
                      <td className="p-2 text-muted-foreground">twitter,linkedin,facebook</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress (Hidden by default) */}
          <Card className="mb-8 hidden">
            <CardHeader>
              <CardTitle>Upload Progress</CardTitle>
              <CardDescription>
                Processing your CSV file...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uploading file...</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>File validation completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Processing 150 posts...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Creating posts...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results (Hidden by default) */}
          <Card className="mb-8 hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Upload Complete
              </CardTitle>
              <CardDescription>
                Your posts have been successfully processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">145</div>
                  <div className="text-sm text-muted-foreground">Successfully Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <strong>Warning (Row 15):</strong> Missing category, defaulting to "Uncategorized"
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <X className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <strong>Error (Row 23):</strong> Invalid date format in publish_date column
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button>
                  View Created Posts
                </Button>
                <Button variant="outline">
                  Download Error Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Tips for Successful Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Use UTF-8 encoding for special characters</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Escape commas in content with quotes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Test with a small file first</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Keep file size under 10MB for best performance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
