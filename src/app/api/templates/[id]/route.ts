import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// This would normally come from a database
// For demo purposes, we'll use the same in-memory storage
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
  }]
])

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const template = templates.get(params.id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user can access this template
    if (!template.isPublic && template.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        template
      }
    })
  } catch (error) {
    console.error('Template GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    const template = templates.get(params.id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user can access this template
    if (!template.isPublic && template.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'use':
        // Increment usage count
        const updatedTemplate = {
          ...template,
          usageCount: template.usageCount + 1,
          updatedAt: new Date()
        }
        templates.set(params.id, updatedTemplate)

        return NextResponse.json({
          success: true,
          data: {
            template: updatedTemplate,
            message: 'Template usage recorded'
          }
        })

      case 'favorite':
        // Toggle favorite status (only for template owner)
        if (template.userId !== session.user.id) {
          return NextResponse.json(
            { error: 'Can only favorite your own templates' },
            { status: 403 }
          )
        }

        const toggledTemplate = {
          ...template,
          isFavorite: !template.isFavorite,
          updatedAt: new Date()
        }
        templates.set(params.id, toggledTemplate)

        return NextResponse.json({
          success: true,
          data: {
            template: toggledTemplate,
            message: `Template ${toggledTemplate.isFavorite ? 'added to' : 'removed from'} favorites`
          }
        })

      case 'duplicate':
        // Create a copy of the template
        const duplicateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const duplicatedTemplate = {
          ...template,
          id: duplicateId,
          title: `${template.title} (Copy)`,
          isPublic: false,
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
        templates.set(duplicateId, duplicatedTemplate)

        return NextResponse.json({
          success: true,
          data: {
            template: duplicatedTemplate,
            message: 'Template duplicated successfully'
          }
        }, { status: 201 })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Template action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const template = templates.get(params.id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user owns the template or is admin
    if (template.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updates = await request.json()
    
    const updatedTemplate = {
      ...template,
      ...updates,
      id: params.id, // Ensure ID doesn't change
      userId: template.userId, // Ensure ownership doesn't change
      createdAt: template.createdAt, // Ensure creation date doesn't change
      updatedAt: new Date()
    }

    templates.set(params.id, updatedTemplate)

    return NextResponse.json({
      success: true,
      data: {
        template: updatedTemplate
      }
    })
  } catch (error) {
    console.error('Template PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const template = templates.get(params.id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user owns the template or is admin
    if (template.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    templates.delete(params.id)

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    console.error('Template DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
