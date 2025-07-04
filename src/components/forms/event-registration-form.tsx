'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Calendar, Users, MapPin, Clock } from 'lucide-react'
import { toast } from 'sonner'

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  specialRequests: z.string().optional(),
  marketingConsent: z.boolean(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
})

type RegistrationFormData = z.infer<typeof registrationSchema>

const events = {
  'ai-workshop-dec': {
    title: 'AI Content Creation Workshop',
    date: 'December 18, 2024',
    time: '10:00 AM - 12:00 PM EST',
    location: 'Interactive Online Workshop',
    price: 49,
    capacity: 50,
    type: 'Workshop'
  },
  'creator-spotlight-dec': {
    title: 'Creator Spotlight Series',
    date: 'December 20, 2024',
    time: '2:00 PM - 3:30 PM EST',
    location: 'Virtual Event',
    price: 0,
    capacity: 200,
    type: 'Webinar'
  },
  'office-hours-dec': {
    title: 'Office Hours with the Team',
    date: 'December 22, 2024',
    time: '11:00 AM - 12:00 PM EST',
    location: 'Virtual Meeting',
    price: 0,
    capacity: 25,
    type: 'Q&A Session'
  }
}

const interestOptions = [
  'AI Content Creation',
  'Social Media Strategy',
  'SEO Optimization',
  'Content Automation',
  'Analytics & Reporting',
  'Team Collaboration',
  'Platform Integration',
  'Monetization Strategies'
]

function EventRegistrationFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event') || 'ai-workshop-dec'
  const event = events[eventId as keyof typeof events] || events['ai-workshop-dec']

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      interests: [],
      marketingConsent: false,
      termsAccepted: false
    }
  })

  const handleInterestChange = (interest: string, checked: boolean) => {
    const newInterests = checked 
      ? [...selectedInterests, interest]
      : selectedInterests.filter(i => i !== interest)
    
    setSelectedInterests(newInterests)
    setValue('interests', newInterests)
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          eventId,
          eventTitle: event.title,
          eventPrice: event.price
        }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const result = await response.json()
      
      if (event.price > 0) {
        // Redirect to payment
        router.push(`/events/payment?registration=${result.registrationId}`)
      } else {
        // Free event - show success
        toast.success('Registration successful! Check your email for event details.')
        router.push('/events/confirmation?registration=' + result.registrationId)
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Event Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {event.title}
                <Badge variant={event.price > 0 ? 'default' : 'secondary'}>
                  {event.type}
                </Badge>
              </CardTitle>
              <CardDescription>Complete your registration below</CardDescription>
            </div>
            {event.price > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold">${event.price}</div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Limited to {event.capacity} participants</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
          <CardDescription>Please provide your details to complete registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                <Input
                  id="jobTitle"
                  {...register('jobTitle')}
                  placeholder="Your job title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level *</Label>
              <Select onValueChange={(value) => setValue('experience', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience && (
                <p className="text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label>Areas of Interest *</Label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                    />
                    <Label htmlFor={interest} className="text-sm font-normal">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-600">{errors.interests.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests or Questions (Optional)</Label>
              <Textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Any special accommodations or questions about the event"
                rows={3}
              />
            </div>

            <Separator />

            {/* Consent and Terms */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketingConsent"
                  {...register('marketingConsent')}
                />
                <Label htmlFor="marketingConsent" className="text-sm font-normal">
                  I would like to receive updates about future events and content creation tips
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  {...register('termsAccepted')}
                />
                <Label htmlFor="termsAccepted" className="text-sm font-normal">
                  I accept the <a href="/terms" className="text-primary hover:underline">terms and conditions</a> and <a href="/privacy" className="text-primary hover:underline">privacy policy</a> *
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : event.price > 0 ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Continue to Payment - ${event.price}
                </>
              ) : (
                'Complete Free Registration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function EventRegistrationForm() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <EventRegistrationFormContent />
    </Suspense>
  )
}
