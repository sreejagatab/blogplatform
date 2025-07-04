import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Template schema for validation
const templateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  category: z.enum(['blog', 'social', 'email', 'landing']),
  platform: z.array(z.string()).min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).max(10),
  isPublic: z.boolean().default(false)
})

// In-memory storage for demo purposes
// In production, this would be stored in a database
const templates = new Map([
  ['1', {
    id: '1',
    title: 'Product Launch Announcement',
    description: 'Perfect template for announcing new product launches across all platforms',
    category: 'blog',
    platform: ['LinkedIn', 'Twitter', 'Medium'],
    content: '🚀 Exciting News! We\'re thrilled to announce the launch of [Product Name]...',
    tags: ['product-launch', 'announcement', 'marketing'],
    isPublic: true,
    isFavorite: true,
    usageCount: 45,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    author: { name: 'Marketing Team', id: 'user1' },
    userId: 'user1'
  }],
  ['2', {
    id: '2',
    title: 'Weekly Newsletter Template',
    description: 'Engaging weekly newsletter format with sections for news, tips, and updates',
    category: 'email',
    platform: ['Email'],
    content: '📧 Weekly Roundup - [Date]\n\n🔥 This Week\'s Highlights...',
    tags: ['newsletter', 'weekly', 'email-marketing'],
    isPublic: false,
    isFavorite: false,
    usageCount: 23,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    author: { name: 'Content Team', id: 'user2' },
    userId: 'user2'
  }],
  ['3', {
    id: '3',
    title: 'Social Media Contest',
    description: 'Boost engagement with this proven contest template',
    category: 'social',
    platform: ['Instagram', 'Facebook', 'Twitter'],
    content: '🎉 CONTEST TIME! Win amazing prizes by following these simple steps...',
    tags: ['contest', 'engagement', 'social-media'],
    isPublic: true,
    isFavorite: true,
    usageCount: 67,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    author: { name: 'Social Team', id: 'user3' },
    userId: 'user3'
  }]
])

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const search = searchParams.get('search')
    const favorites = searchParams.get('favorites') === 'true'
    const publicOnly = searchParams.get('public') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let filteredTemplates = Array.from(templates.values())

    // Apply filters
    if (category && category !== 'all') {
      filteredTemplates = filteredTemplates.filter(t => t.category === category)
    }

    if (platform && platform !== 'all') {
      filteredTemplates = filteredTemplates.filter(t => t.platform.includes(platform))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTemplates = filteredTemplates.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (favorites) {
      filteredTemplates = filteredTemplates.filter(t => t.isFavorite)
    }

    if (publicOnly) {
      filteredTemplates = filteredTemplates.filter(t => t.isPublic)
    } else {
      // Show user's own templates and public templates
      filteredTemplates = filteredTemplates.filter(t => 
        t.isPublic || t.userId === session.user.id
      )
    }

    // Sort by usage count and updated date
    filteredTemplates.sort((a, b) => {
      if (b.usageCount !== a.usageCount) {
        return b.usageCount - a.usageCount
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        templates: paginatedTemplates,
        pagination: {
          page,
          limit,
          total: filteredTemplates.length,
          totalPages: Math.ceil(filteredTemplates.length / limit)
        },
        stats: {
          total: templates.size,
          public: Array.from(templates.values()).filter(t => t.isPublic).length,
          private: Array.from(templates.values()).filter(t => !t.isPublic).length,
          categories: {
            blog: Array.from(templates.values()).filter(t => t.category === 'blog').length,
            social: Array.from(templates.values()).filter(t => t.category === 'social').length,
            email: Array.from(templates.values()).filter(t => t.category === 'email').length,
            landing: Array.from(templates.values()).filter(t => t.category === 'landing').length
          }
        }
      }
    })
  } catch (error) {
    console.error('Templates GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = templateSchema.parse(body)

    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTemplate = {
      id: templateId,
      ...validatedData,
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        name: session.user.name || 'Unknown User',
        id: session.user.id
      },
      userId: session.user.id
    }

    templates.set(templateId, newTemplate)

    return NextResponse.json({
      success: true,
      data: {
        template: newTemplate
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid template data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Templates POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const existingTemplate = templates.get(templateId)
    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user owns the template or is admin
    if (existingTemplate.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = templateSchema.parse(body)

    const updatedTemplate = {
      ...existingTemplate,
      ...validatedData,
      updatedAt: new Date()
    }

    templates.set(templateId, updatedTemplate)

    return NextResponse.json({
      success: true,
      data: {
        template: updatedTemplate
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid template data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Templates PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const existingTemplate = templates.get(templateId)
    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user owns the template or is admin
    if (existingTemplate.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    templates.delete(templateId)

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    console.error('Templates DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
