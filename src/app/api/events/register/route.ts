import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const registrationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()).min(1),
  specialRequests: z.string().optional(),
  marketingConsent: z.boolean(),
  termsAccepted: z.boolean(),
  eventId: z.string(),
  eventTitle: z.string(),
  eventPrice: z.number()
})

// In-memory storage for demo purposes
// In production, this would be stored in a database
const registrations = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = registrationSchema.parse(body)
    
    // Check if terms are accepted
    if (!validatedData.termsAccepted) {
      return NextResponse.json(
        { error: 'Terms and conditions must be accepted' },
        { status: 400 }
      )
    }

    // Generate registration ID
    const registrationId = nanoid()
    
    // Create registration record
    const registration = {
      id: registrationId,
      ...validatedData,
      status: validatedData.eventPrice > 0 ? 'pending_payment' : 'confirmed',
      createdAt: new Date().toISOString(),
      paymentStatus: validatedData.eventPrice > 0 ? 'pending' : 'not_required'
    }
    
    // Store registration (in production, save to database)
    registrations.set(registrationId, registration)
    
    // Send confirmation email (mock implementation)
    await sendConfirmationEmail(registration)
    
    return NextResponse.json({
      success: true,
      registrationId,
      status: registration.status,
      message: validatedData.eventPrice > 0 
        ? 'Registration created. Please complete payment to confirm your spot.'
        : 'Registration confirmed! Check your email for event details.'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const registrationId = searchParams.get('id')
  
  if (!registrationId) {
    return NextResponse.json(
      { error: 'Registration ID is required' },
      { status: 400 }
    )
  }
  
  const registration = registrations.get(registrationId)
  
  if (!registration) {
    return NextResponse.json(
      { error: 'Registration not found' },
      { status: 404 }
    )
  }
  
  // Return registration details (excluding sensitive information)
  const { termsAccepted, ...publicData } = registration
  
  return NextResponse.json({
    success: true,
    registration: publicData
  })
}

async function sendConfirmationEmail(registration: any) {
  // Mock email sending implementation
  // In production, integrate with email service like SendGrid, Mailgun, etc.
  
  console.log('Sending confirmation email to:', registration.email)
  console.log('Event:', registration.eventTitle)
  console.log('Registration ID:', registration.id)
  
  // Email content would include:
  // - Event details
  // - Registration confirmation
  // - Calendar invite
  // - Join instructions (for virtual events)
  // - Contact information
  
  return Promise.resolve()
}
