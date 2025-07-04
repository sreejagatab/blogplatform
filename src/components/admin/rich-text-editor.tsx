'use client'

import { useState } from 'react'
import { 
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Save,
  Eye,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface RichTextEditorProps {
  initialContent?: string
  placeholder?: string
  onSave?: (content: string) => void
}

export default function RichTextEditor({ 
  initialContent = '', 
  placeholder = 'Start writing your amazing content...',
  onSave 
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isPreview, setIsPreview] = useState(false)

  const toolbarButtons = [
    { icon: Undo, action: 'undo', tooltip: 'Undo' },
    { icon: Redo, action: 'redo', tooltip: 'Redo' },
    { type: 'separator' },
    { icon: Heading1, action: 'heading1', tooltip: 'Heading 1' },
    { icon: Heading2, action: 'heading2', tooltip: 'Heading 2' },
    { icon: Heading3, action: 'heading3', tooltip: 'Heading 3' },
    { type: 'separator' },
    { icon: Bold, action: 'bold', tooltip: 'Bold' },
    { icon: Italic, action: 'italic', tooltip: 'Italic' },
    { icon: Underline, action: 'underline', tooltip: 'Underline' },
    { type: 'separator' },
    { icon: AlignLeft, action: 'alignLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, action: 'alignCenter', tooltip: 'Align Center' },
    { icon: AlignRight, action: 'alignRight', tooltip: 'Align Right' },
    { type: 'separator' },
    { icon: List, action: 'unorderedList', tooltip: 'Bullet List' },
    { icon: ListOrdered, action: 'orderedList', tooltip: 'Numbered List' },
    { icon: Quote, action: 'blockquote', tooltip: 'Quote' },
    { type: 'separator' },
    { icon: Link, action: 'link', tooltip: 'Insert Link' },
    { icon: Image, action: 'image', tooltip: 'Insert Image' },
    { icon: Code, action: 'code', tooltip: 'Code Block' },
  ]

  const handleToolbarAction = (action: string) => {
    // In a real implementation, you would integrate with a rich text editor library
    // like TinyMCE, Quill, or implement custom document.execCommand logic
    console.log('Toolbar action:', action)
  }

  const handleAIAssist = () => {
    // AI assistance for content optimization, grammar check, etc.
    console.log('AI assistance requested')
  }

  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex items-center flex-wrap gap-2">
          {/* Left side - formatting tools */}
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => {
              if (button.type === 'separator') {
                return (
                  <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                )
              }

              const Icon = button.icon
              if (!button.action || !Icon) return null
              
              return (
                <Button
                  key={button.action}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToolbarAction(button.action!)}
                  title={button.tooltip}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* Right side - actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIAssist}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Assist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor Area */}
      <Card className="overflow-hidden">
        {isPreview ? (
          <div className="p-6 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content || '<p>No content to preview</p>' }} />
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="w-full h-96 p-6 border-0 resize-none focus:ring-0 focus:outline-none 
                       bg-transparent text-gray-900 dark:text-white"
              style={{ minHeight: '400px' }}
            />
            {!content && (
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
                <p className="text-lg">{placeholder}</p>
                <p className="text-sm mt-2">
                  Use the toolbar above to format your content, or type in Markdown.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Word count and stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>{content.length} characters</span>
          <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
          <span>~{Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Auto-saved 2 minutes ago</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
