import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const paymentSchema = z.object({
  registrationId: z.string(),
  paymentData: z.object({
    cardNumber: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    cvv: z.string(),
    cardholderName: z.string(),
    billingAddress: z.string(),
    billingCity: z.string(),
    billingState: z.string(),
    billingZip: z.string(),
    billingCountry: z.string()
  }),
  amount: z.number()
})

// Mock payment storage (in production, use a database)
const payments = new Map()
const registrations = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = paymentSchema.parse(body)
    
    const { registrationId, paymentData, amount } = validatedData
    
    // Check if registration exists
    const registration = registrations.get(registrationId)
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    // Mock payment processing
    // In production, integrate with payment processor (Stripe, PayPal, etc.)
    const paymentResult = await processPayment(paymentData, amount)
    
    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment failed' },
        { status: 400 }
      )
    }
    
    // Generate payment ID
    const paymentId = nanoid()
    
    // Create payment record
    const payment = {
      id: paymentId,
      registrationId,
      amount,
      currency: 'USD',
      status: 'completed',
      transactionId: paymentResult.transactionId,
      paymentMethod: 'card',
      cardLast4: paymentData.cardNumber.slice(-4),
      createdAt: new Date().toISOString(),
      billingAddress: {
        address: paymentData.billingAddress,
        city: paymentData.billingCity,
        state: paymentData.billingState,
        zip: paymentData.billingZip,
        country: paymentData.billingCountry
      }
    }
    
    // Store payment
    payments.set(paymentId, payment)
    
    // Update registration status
    registration.status = 'confirmed'
    registration.paymentStatus = 'completed'
    registration.paymentId = paymentId
    registrations.set(registrationId, registration)
    
    // Send confirmation email
    await sendPaymentConfirmationEmail(registration, payment)
    
    return NextResponse.json({
      success: true,
      paymentId,
      transactionId: paymentResult.transactionId,
      message: 'Payment successful! Your registration is confirmed.'
    })
    
  } catch (error) {
    console.error('Payment error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Payment processing failed. Please try again.' },
      { status: 500 }
    )
  }
}

async function processPayment(paymentData: any, amount: number) {
  // Mock payment processing
  // In production, this would integrate with a real payment processor
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock validation
  const cardNumber = paymentData.cardNumber.replace(/\s/g, '')
  
  // Simulate some basic validation
  if (cardNumber.length < 16) {
    return { success: false, error: 'Invalid card number' }
  }
  
  if (paymentData.cvv.length < 3) {
    return { success: false, error: 'Invalid CVV' }
  }
  
  // Mock successful payment
  return {
    success: true,
    transactionId: `txn_${nanoid()}`,
    amount,
    currency: 'USD'
  }
}

async function sendPaymentConfirmationEmail(registration: any, payment: any) {
  // Mock email sending implementation
  console.log('Sending payment confirmation email to:', registration.email)
  console.log('Payment ID:', payment.id)
  console.log('Transaction ID:', payment.transactionId)
  console.log('Amount:', payment.amount)
  
  // Email would include:
  // - Payment receipt
  // - Event confirmation
  // - Calendar invite
  // - Join instructions
  // - Contact information
  
  return Promise.resolve()
}
