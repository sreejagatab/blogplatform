'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Lock, Calendar, Users, MapPin, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  expiryMonth: z.string().min(2, 'Required'),
  expiryYear: z.string().min(4, 'Required'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
  billingAddress: z.string().min(5, 'Billing address is required'),
  billingCity: z.string().min(2, 'City is required'),
  billingState: z.string().min(2, 'State is required'),
  billingZip: z.string().min(5, 'ZIP code is required'),
  billingCountry: z.string().min(2, 'Country is required')
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface Registration {
  id: string
  firstName: string
  lastName: string
  email: string
  eventTitle: string
  eventPrice: number
  status: string
}

export function EventPaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registration')
  
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      billingCountry: 'US'
    }
  })

  useEffect(() => {
    if (!registrationId) {
      router.push('/events')
      return
    }

    fetchRegistration()
  }, [registrationId])

  const fetchRegistration = async () => {
    try {
      const response = await fetch(`/api/events/register?id=${registrationId}`)
      if (!response.ok) {
        throw new Error('Registration not found')
      }
      
      const data = await response.json()
      setRegistration(data.registration)
    } catch (error) {
      toast.error('Registration not found')
      router.push('/events')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setValue('cardNumber', formatted)
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true)
    
    try {
      // Mock payment processing
      // In production, integrate with Stripe, PayPal, or other payment processor
      
      const response = await fetch('/api/events/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          paymentData: data,
          amount: registration?.eventPrice
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      const result = await response.json()
      
      toast.success('Payment successful! Your registration is confirmed.')
      router.push(`/events/confirmation?registration=${registrationId}`)
      
    } catch (error) {
      toast.error('Payment failed. Please check your card details and try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading registration details...</p>
        </CardContent>
      </Card>
    )
  }

  if (!registration) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Registration not found.</p>
          <Button className="mt-4" onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Registration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Registration Summary
          </CardTitle>
          <CardDescription>Review your registration details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{registration.eventTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {registration.firstName} {registration.lastName} • {registration.email}
                </p>
              </div>
              <Badge>Pending Payment</Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-2xl font-bold">${registration.eventPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  {...register('cardNumber')}
                  onChange={handleCardNumberChange}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select onValueChange={(value) => setValue('expiryMonth', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryMonth && (
                    <p className="text-sm text-red-600">{errors.expiryMonth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select onValueChange={(value) => setValue('expiryYear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryYear && (
                    <p className="text-sm text-red-600">{errors.expiryYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    {...register('cvv')}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-600">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  {...register('cardholderName')}
                />
                {errors.cardholderName && (
                  <p className="text-sm text-red-600">{errors.cardholderName.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="font-semibold">Billing Address</h3>
              
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Main Street"
                  {...register('billingAddress')}
                />
                {errors.billingAddress && (
                  <p className="text-sm text-red-600">{errors.billingAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    placeholder="New York"
                    {...register('billingCity')}
                  />
                  {errors.billingCity && (
                    <p className="text-sm text-red-600">{errors.billingCity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingState">State</Label>
                  <Input
                    id="billingState"
                    placeholder="NY"
                    {...register('billingState')}
                  />
                  {errors.billingState && (
                    <p className="text-sm text-red-600">{errors.billingState.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingZip">ZIP Code</Label>
                  <Input
                    id="billingZip"
                    placeholder="10001"
                    {...register('billingZip')}
                  />
                  {errors.billingZip && (
                    <p className="text-sm text-red-600">{errors.billingZip.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingCountry">Country</Label>
                  <Select onValueChange={(value) => setValue('billingCountry', value)} defaultValue="US">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.billingCountry && (
                    <p className="text-sm text-red-600">{errors.billingCountry.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Processing Payment...'
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Complete Payment - ${registration.eventPrice}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By completing this payment, you agree to our terms of service and confirm your event registration.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
