import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if it's a demo user
    const demoEmails = [
      'admin@blogplatform.com',
      'editor@blogplatform.com', 
      'viewer@blogplatform.com'
    ]

    if (!demoEmails.includes(email)) {
      return NextResponse.json(
        { error: 'Demo access is only available for demo accounts' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        bio: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Demo user not found. Please run the seed script first.' },
        { status: 404 }
      )
    }

    // Create a demo session token (in production, use proper JWT)
    const sessionToken = `demo_${user.id}_${Date.now()}`
    
    // Create a session record
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        bio: user.bio
      },
      sessionToken,
      message: `Successfully logged in as ${user.role.toLowerCase()}`
    })

  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
