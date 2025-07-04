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
  Send, 
  Upload, 
  User,
  Mail,
  Phone,
  Building,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Apply for Position',
  description: 'Apply for a position at Universal Blog Platform. Join our team and help shape the future of content distribution.',
}

export default function ApplyPage() {
  return (
    <PageLayout>
      <PageHero
        title="Apply for Position"
        description="Ready to join our mission? Submit your application and let's build the future of content distribution together."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Careers
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>
                    Fill out this form to apply for a position at Universal Blog Platform
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
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="firstName" placeholder="John" className="pl-10" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="john@example.com" className="pl-10" required />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="pl-10" required />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" placeholder="City, State/Country" required />
                      </div>
                    </div>

                    {/* Position Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Position Information</h3>
                      
                      <div>
                        <Label htmlFor="position">Position Applied For *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="senior-fullstack">Senior Full-Stack Engineer</SelectItem>
                            <SelectItem value="product-manager">Product Manager</SelectItem>
                            <SelectItem value="ai-ml-engineer">AI/ML Engineer</SelectItem>
                            <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                            <SelectItem value="customer-success">Customer Success Manager</SelectItem>
                            <SelectItem value="content-marketing">Content Marketing Manager</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-3">2-3 years</SelectItem>
                            <SelectItem value="4-6">4-6 years</SelectItem>
                            <SelectItem value="7-10">7-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="salary">Expected Salary Range</Label>
                        <Input id="salary" placeholder="e.g., $80k - $120k" />
                      </div>
                      
                      <div>
                        <Label htmlFor="availability">Availability *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="When can you start?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediately">Immediately</SelectItem>
                            <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                            <SelectItem value="1-month">1 month notice</SelectItem>
                            <SelectItem value="2-months">2+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Cover Letter & Resume */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Application Materials</h3>
                      
                      <div>
                        <Label htmlFor="coverLetter">Cover Letter *</Label>
                        <Textarea 
                          id="coverLetter" 
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resume">Resume/CV *</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, or DOCX (max 5MB)
                          </p>
                          <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                        <Input id="portfolio" placeholder="https://linkedin.com/in/yourname" />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                      
                      <div>
                        <Label htmlFor="referral">How did you hear about us?</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Company Website</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="referral">Employee Referral</SelectItem>
                            <SelectItem value="job-board">Job Board</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="questions">Questions or Additional Comments</Label>
                        <Textarea 
                          id="questions" 
                          placeholder="Any questions about the role or additional information you'd like to share..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="consent" required />
                        <Label htmlFor="consent" className="text-sm">
                          I consent to the processing of my personal data for recruitment purposes *
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox id="updates" />
                        <Label htmlFor="updates" className="text-sm">
                          I would like to receive updates about future job opportunities
                        </Label>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Application Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Application Review</p>
                        <p className="text-xs text-muted-foreground">We'll review your application within 48 hours</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Phone Screen</p>
                        <p className="text-xs text-muted-foreground">30-minute call with our team</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Technical Interview</p>
                        <p className="text-xs text-muted-foreground">Role-specific assessment</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-sm">Final Interview</p>
                        <p className="text-xs text-muted-foreground">Meet the team and discuss next steps</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What We Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Competitive salary and equity</li>
                    <li>• Comprehensive health benefits</li>
                    <li>• Flexible work arrangements</li>
                    <li>• $3,000 learning budget</li>
                    <li>• Unlimited PTO</li>
                    <li>• Top-tier equipment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have questions about the application process?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Contact HR</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
