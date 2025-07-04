import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email-service'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
  source: z.string().default('website'),
  preferences: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
    topics: z.array(z.string()).default([])
  }).optional()
})

const unsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, tags, source, preferences } = subscribeSchema.parse(body)

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber && existingSubscriber.subscribed) {
      return NextResponse.json(
        { error: 'Email is already subscribed' },
        { status: 400 }
      )
    }

    // Subscribe using email service
    const result = await emailService.subscribeToNewsletter(email, name, tags)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Subscription failed' },
        { status: 400 }
      )
    }

    // Save/update in database
    const subscriberData = {
      email,
      name,
      subscribed: true,
      subscribedAt: new Date(),
      unsubscribedAt: null,
      source,
      tags,
      preferences: preferences ? JSON.stringify(preferences) : null,
      confirmationToken: generateConfirmationToken(),
      confirmed: false // Require email confirmation
    }

    const subscriber = existingSubscriber
      ? await prisma.newsletterSubscriber.update({
          where: { email },
          data: subscriberData
        })
      : await prisma.newsletterSubscriber.create({
          data: subscriberData
        })

    // Send confirmation email
    await sendConfirmationEmail(email, name || 'Subscriber', subscriber.confirmationToken)

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Please check your email to confirm.',
      data: {
        email: subscriber.email,
        name: subscriber.name,
        subscribed: subscriber.subscribed,
        confirmed: subscriber.confirmed,
        subscribedAt: subscriber.subscribedAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = unsubscribeSchema.parse(body)

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    if (!subscriber.subscribed) {
      return NextResponse.json(
        { error: 'Email is already unsubscribed' },
        { status: 400 }
      )
    }

    // Verify unsubscribe token if provided
    if (token && subscriber.unsubscribeToken !== token) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 400 }
      )
    }

    // Unsubscribe using email service
    const result = await emailService.unsubscribeFromNewsletter(email)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Unsubscribe failed' },
        { status: 400 }
      )
    }

    // Update database
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        subscribed: false,
        unsubscribedAt: new Date(),
        unsubscribeReason: 'user_request'
      }
    })

    // Send goodbye email
    await sendGoodbyeEmail(email, subscriber.name || 'Subscriber')

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (action === 'confirm') {
      if (!email || !token) {
        return NextResponse.json(
          { error: 'Email and token are required' },
          { status: 400 }
        )
      }

      // Find subscriber
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email }
      })

      if (!subscriber) {
        return NextResponse.json(
          { error: 'Subscriber not found' },
          { status: 404 }
        )
      }

      if (subscriber.confirmationToken !== token) {
        return NextResponse.json(
          { error: 'Invalid confirmation token' },
          { status: 400 }
        )
      }

      if (subscriber.confirmed) {
        return NextResponse.json(
          { error: 'Email is already confirmed' },
          { status: 400 }
        )
      }

      // Confirm subscription
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          confirmed: true,
          confirmationToken: null,
          confirmedAt: new Date()
        }
      })

      // Send welcome email
      await sendWelcomeEmail(email, subscriber.name || 'Subscriber')

      return NextResponse.json({
        success: true,
        message: 'Email confirmed successfully! Welcome to our newsletter.'
      })
    }

    if (action === 'status') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
        select: {
          email: true,
          name: true,
          subscribed: true,
          confirmed: true,
          subscribedAt: true,
          unsubscribedAt: true,
          tags: true,
          preferences: true
        }
      })

      if (!subscriber) {
        return NextResponse.json(
          { error: 'Subscriber not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          ...subscriber,
          preferences: subscriber.preferences ? JSON.parse(subscriber.preferences) : null
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Newsletter GET error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function generateConfirmationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

async function sendConfirmationEmail(email: string, name: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`
  
  await emailService.sendEmail(
    email,
    'Please confirm your newsletter subscription',
    {
      html: `
        <h1>Confirm Your Subscription</h1>
        <p>Hi ${name},</p>
        <p>Thank you for subscribing to our newsletter! Please click the link below to confirm your subscription:</p>
        <p><a href="${confirmUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Subscription</a></p>
        <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
        <p>Best regards,<br>The Blog Team</p>
      `,
      text: `
        Hi ${name},
        
        Thank you for subscribing to our newsletter! Please visit the following link to confirm your subscription:
        
        ${confirmUrl}
        
        If you didn't subscribe to our newsletter, you can safely ignore this email.
        
        Best regards,
        The Blog Team
      `
    }
  )
}

async function sendWelcomeEmail(email: string, name: string) {
  await emailService.sendEmail(
    email,
    'Welcome to our newsletter!',
    {
      html: `
        <h1>Welcome to our newsletter!</h1>
        <p>Hi ${name},</p>
        <p>Your subscription has been confirmed! You'll now receive our latest blog posts and updates.</p>
        <p>You can manage your subscription preferences or unsubscribe at any time by visiting your account settings.</p>
        <p>Thank you for joining our community!</p>
        <p>Best regards,<br>The Blog Team</p>
      `,
      text: `
        Hi ${name},
        
        Your subscription has been confirmed! You'll now receive our latest blog posts and updates.
        
        You can manage your subscription preferences or unsubscribe at any time by visiting your account settings.
        
        Thank you for joining our community!
        
        Best regards,
        The Blog Team
      `
    }
  )
}

async function sendGoodbyeEmail(email: string, name: string) {
  await emailService.sendEmail(
    email,
    'Sorry to see you go',
    {
      html: `
        <h1>You've been unsubscribed</h1>
        <p>Hi ${name},</p>
        <p>You have been successfully unsubscribed from our newsletter.</p>
        <p>We're sorry to see you go! If you change your mind, you can always subscribe again on our website.</p>
        <p>Thank you for being part of our community.</p>
        <p>Best regards,<br>The Blog Team</p>
      `,
      text: `
        Hi ${name},
        
        You have been successfully unsubscribed from our newsletter.
        
        We're sorry to see you go! If you change your mind, you can always subscribe again on our website.
        
        Thank you for being part of our community.
        
        Best regards,
        The Blog Team
      `
    }
  )
}
