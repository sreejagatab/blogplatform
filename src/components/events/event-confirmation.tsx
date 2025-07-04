'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  Download,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Registration {
  id: string
  firstName: string
  lastName: string
  email: string
  eventTitle: string
  eventPrice: number
  status: string
  paymentStatus: string
  createdAt: string
}

export function EventConfirmation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const registrationId = searchParams.get('registration')
  
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const copyRegistrationId = () => {
    if (registrationId) {
      navigator.clipboard.writeText(registrationId)
      toast.success('Registration ID copied to clipboard')
    }
  }

  const addToCalendar = () => {
    // Mock calendar event creation
    const eventDetails = {
      title: registration?.eventTitle || 'Event',
      start: '2024-12-18T15:00:00Z', // Mock date
      end: '2024-12-18T17:00:00Z',
      description: 'Universal Blog Platform Event',
      location: 'Virtual Event'
    }
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${eventDetails.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`
    
    window.open(calendarUrl, '_blank')
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading confirmation details...</p>
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

  const isConfirmed = registration.status === 'confirmed'
  const isPaid = registration.eventPrice > 0 && registration.paymentStatus === 'completed'
  const isFree = registration.eventPrice === 0

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-green-700 mb-4">
            {isFree 
              ? "You're all set for the event. Check your email for details."
              : "Payment successful! Your spot is secured."
            }
          </p>
          <Badge className="bg-green-600">
            {isConfirmed ? 'Confirmed' : 'Pending'}
          </Badge>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>{registration.eventTitle}</CardTitle>
          <CardDescription>Event details and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span>December 18, 2024</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>10:00 AM - 12:00 PM EST</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Interactive Online Workshop</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <span>Limited to 50 participants</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{registration.firstName} {registration.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{registration.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Registration ID:</span>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs">{registration.id}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyRegistrationId}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium">
                  {isConfirmed ? 'Confirmed' : 'Pending'}
                  {isPaid && ' • Paid'}
                </p>
              </div>
            </div>
          </div>

          {registration.eventPrice > 0 && (
            <>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Paid</span>
                <span className="text-2xl font-bold">${registration.eventPrice}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>Important information and next steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={addToCalendar} className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Check Your Email</p>
                <p className="text-muted-foreground">
                  We've sent a confirmation email with event details and join instructions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ExternalLink className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Join Instructions</p>
                <p className="text-muted-foreground">
                  You'll receive the meeting link 24 hours before the event starts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Community Access</p>
                <p className="text-muted-foreground">
                  Join our exclusive community to connect with other participants.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your registration or the event, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/help">
                  Visit Help Center
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:support@universalblog.com">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* More Events */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Explore More Events</h3>
        <p className="text-muted-foreground mb-6">
          Discover other workshops and learning opportunities.
        </p>
        <Button variant="outline" asChild>
          <Link href="/community">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
