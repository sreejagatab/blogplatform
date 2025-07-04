import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const withCounts = searchParams.get('withCounts') === 'true'
    const popular = searchParams.get('popular') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    let tags
    
    if (popular) {
      // Get popular tags based on post count
      tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  post: {
                    status: 'PUBLISHED'
                  }
                }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: limit
      })
    } else {
      tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
        take: limit,
        ...(withCounts && {
          include: {
            _count: {
              select: {
                posts: {
                  where: {
                    post: {
                      status: 'PUBLISHED'
                    }
                  }
                }
              }
            }
          }
        })
      })
    }

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
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
    const { name, slug, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    if (slug) {
      const existingTag = await prisma.tag.findUnique({
        where: { slug }
      })
      
      if (existingTag) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
