import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = subscribeSchema.parse(body)

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter!' },
          { status: 200 }
        )
      }
      
      // Reactivate if previously unsubscribed
      await prisma.newsletter.update({
        where: { email },
        data: {
          isActive: true,
          firstName: name || existingSubscriber.firstName,
          confirmedAt: new Date()
        }
      })

      return NextResponse.json(
        { message: 'Welcome back! You have been resubscribed to our newsletter.' },
        { status: 200 }
      )
    }

    // Create new subscriber
    await prisma.newsletter.create({
      data: {
        email,
        firstName: name,
        isActive: true,
        source: 'website',
        confirmedAt: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Thank you for subscribing to our newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      )
    }

    await prisma.newsletter.update({
      where: { email },
      data: {
        isActive: false
      }
    })

    return NextResponse.json(
      { message: 'You have been successfully unsubscribed from our newsletter.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter unsubscription error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}
