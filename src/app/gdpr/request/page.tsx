import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Shield, 
  Send, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'GDPR Data Request',
  description: 'Submit a GDPR data subject request to exercise your privacy rights under European data protection law.',
}

const requestTypes = [
  {
    value: 'access',
    title: 'Right to Access',
    description: 'Request a copy of your personal data we hold',
    timeframe: '30 days'
  },
  {
    value: 'rectification',
    title: 'Right to Rectification',
    description: 'Correct inaccurate or incomplete personal data',
    timeframe: '30 days'
  },
  {
    value: 'erasure',
    title: 'Right to Erasure',
    description: 'Request deletion of your personal data',
    timeframe: '30 days'
  },
  {
    value: 'restriction',
    title: 'Right to Restrict Processing',
    description: 'Limit how we process your personal data',
    timeframe: '30 days'
  },
  {
    value: 'portability',
    title: 'Right to Data Portability',
    description: 'Receive your data in a machine-readable format',
    timeframe: '30 days'
  },
  {
    value: 'objection',
    title: 'Right to Object',
    description: 'Object to processing based on legitimate interests',
    timeframe: '30 days'
  }
]

export default function GDPRRequestPage() {
  return (
    <PageLayout>
      <PageHero
        title="GDPR Data Subject Request"
        description="Exercise your data protection rights under the General Data Protection Regulation (GDPR)."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Important Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-800">
                <li>• We will respond to your request within 30 days</li>
                <li>• We may need to verify your identity before processing</li>
                <li>• Some requests may require additional time for complex cases</li>
                <li>• You can submit only one request per type every 12 months</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Request</CardTitle>
                  <CardDescription>
                    Fill out this form to exercise your GDPR rights. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" placeholder="Your first name" required />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Your last name" required />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="Your email address" required />
                        <p className="text-xs text-muted-foreground mt-1">
                          Must match the email address associated with your account
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input id="phone" type="tel" placeholder="Your phone number" />
                      </div>
                    </div>

                    {/* Request Type */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Request Type</h3>
                      
                      <div>
                        <Label htmlFor="requestType">Type of Request *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of request" />
                          </SelectTrigger>
                          <SelectContent>
                            {requestTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Request Details</h3>
                      
                      <div>
                        <Label htmlFor="details">Detailed Description *</Label>
                        <Textarea 
                          id="details" 
                          placeholder="Please provide specific details about your request..."
                          rows={4}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Be as specific as possible to help us process your request efficiently
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="reason">Reason for Request (Optional)</Label>
                        <Textarea 
                          id="reason" 
                          placeholder="Why are you making this request? (Optional but helpful)"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Verification</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="identity" required />
                          <Label htmlFor="identity" className="text-sm">
                            I confirm that I am the data subject or have authorization to act on behalf of the data subject *
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="information" required />
                          <Label htmlFor="information" className="text-sm">
                            I understand that providing false information may result in the rejection of this request *
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="processing" required />
                          <Label htmlFor="processing" className="text-sm">
                            I consent to the processing of this request and understand the response timeframes *
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Request Types Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Types</CardTitle>
                  <CardDescription>
                    Learn about your GDPR rights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requestTypes.map((type, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-3">
                        <h4 className="font-medium text-sm">{type.title}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{type.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {type.timeframe}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Acknowledgment</p>
                        <p className="text-xs text-muted-foreground">We'll confirm receipt within 72 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Verification</p>
                        <p className="text-xs text-muted-foreground">We may request additional verification</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Processing</p>
                        <p className="text-xs text-muted-foreground">We'll process your request within 30 days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Response</p>
                        <p className="text-xs text-muted-foreground">You'll receive our response via email</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <CardTitle className="text-lg text-yellow-900">Need Help?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-800 mb-3">
                    If you need assistance with your request, contact our Data Protection Officer:
                  </p>
                  <p className="text-sm text-yellow-800">
                    <strong>Email:</strong> dpo@universalblog.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
