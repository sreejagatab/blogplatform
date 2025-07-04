'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Save, 
  Eye, 
  Send, 
  Copy, 
  Trash2, 
  Plus, 
  Code, 
  Type, 
  Image as ImageIcon, 
  Link,
  Mail,
  Settings,
  Palette,
  Layout
} from 'lucide-react'
import { toast } from 'sonner'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'newsletter' | 'notification' | 'marketing' | 'transactional'
  createdAt: Date
  updatedAt: Date
}

interface TemplateEditorProps {
  template?: EmailTemplate
  onSave?: (template: EmailTemplate) => void
  onCancel?: () => void
}

export default function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    htmlContent: template?.htmlContent || '',
    textContent: template?.textContent || '',
    category: template?.category || 'newsletter' as const,
    variables: template?.variables || []
  })
  const [activeTab, setActiveTab] = useState('design')
  const [previewData, setPreviewData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [newVariable, setNewVariable] = useState('')

  const handleSave = async () => {
    if (!formData.name || !formData.subject) {
      toast.error('Name and subject are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/email/templates', {
        method: template ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(template && { id: template.id }),
          ...formData
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Template ${template ? 'updated' : 'created'} successfully`)
        onSave?.(result.data)
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    // Generate preview with sample data
    const sampleData: any = {}
    formData.variables.forEach(variable => {
      switch (variable) {
        case 'name':
          sampleData[variable] = 'John Doe'
          break
        case 'email':
          sampleData[variable] = 'john@example.com'
          break
        case 'postTitle':
          sampleData[variable] = 'Amazing Blog Post Title'
          break
        case 'unsubscribeUrl':
          sampleData[variable] = '#unsubscribe'
          break
        default:
          sampleData[variable] = `[${variable}]`
      }
    })
    setPreviewData(sampleData)
  }

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }))
      setNewVariable('')
    }
  }

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }))
  }

  const insertVariable = (variable: string) => {
    const placeholder = `{{${variable}}}`
    // Insert into HTML content at cursor position
    setFormData(prev => ({
      ...prev,
      htmlContent: prev.htmlContent + placeholder
    }))
  }

  const generateTextFromHtml = () => {
    // Simple HTML to text conversion
    const textContent = formData.htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    setFormData(prev => ({
      ...prev,
      textContent
    }))
  }

  const insertTemplate = (templateType: string) => {
    const templates = {
      header: `
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">{{siteName}}</h1>
        </div>
      `,
      footer: `
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 {{siteName}}. All rights reserved.</p>
          <p><a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Preferences</a></p>
        </div>
      `,
      button: `
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{buttonUrl}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">{{buttonText}}</a>
        </div>
      `,
      article: `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">{{articleTitle}}</h2>
          <p style="color: #666; font-size: 14px;">{{articleDate}}</p>
          <p>{{articleExcerpt}}</p>
          <a href="{{articleUrl}}" style="color: #007bff; text-decoration: none;">Read more →</a>
        </div>
      `
    }

    setFormData(prev => ({
      ...prev,
      htmlContent: prev.htmlContent + templates[templateType as keyof typeof templates]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {template ? 'Edit Template' : 'Create Template'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Design and customize your email template
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Template Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="newsletter">Newsletter</option>
              <option value="notification">Notification</option>
              <option value="marketing">Marketing</option>
              <option value="transactional">Transactional</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Subject Line</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject"
            />
          </div>
        </div>
      </Card>

      {/* Variables */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Template Variables</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newVariable}
              onChange={(e) => setNewVariable(e.target.value)}
              placeholder="Variable name (e.g., name, email)"
              className="flex-1"
            />
            <Button onClick={addVariable}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.variables.map(variable => (
              <Badge
                key={variable}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => insertVariable(variable)}
              >
                {variable}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeVariable(variable)
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          {formData.variables.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on a variable to insert it into your template
            </p>
          )}
        </div>
      </Card>

      {/* Template Editor */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">
              <Layout className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="html">
              <Code className="h-4 w-4 mr-2" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">Insert Components</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate('header')}
                >
                  Header
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate('footer')}
                >
                  Footer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate('button')}
                >
                  Button
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate('article')}
                >
                  Article
                </Button>
              </div>
            </div>
            <Textarea
              value={formData.htmlContent}
              onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
              placeholder="Enter your HTML content here..."
              className="min-h-[400px] font-mono"
            />
          </TabsContent>

          <TabsContent value="html">
            <Textarea
              value={formData.htmlContent}
              onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
              placeholder="Enter your HTML content here..."
              className="min-h-[400px] font-mono"
            />
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Plain text version for email clients that don't support HTML
              </p>
              <Button variant="outline" size="sm" onClick={generateTextFromHtml}>
                Generate from HTML
              </Button>
            </div>
            <Textarea
              value={formData.textContent}
              onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
              placeholder="Enter your plain text content here..."
              className="min-h-[400px]"
            />
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="border-b pb-2 mb-4">
                <h4 className="font-medium">Subject: {formData.subject}</h4>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: formData.htmlContent.replace(
                    /\{\{(\w+)\}\}/g,
                    (match, variable) => previewData[variable] || match
                  )
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Test Email */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test Email</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter test email address"
            className="flex-1"
          />
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </Card>
    </div>
  )
}
