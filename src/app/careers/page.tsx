import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
  Briefcase,
  DollarSign,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Universal Blog Platform and help shape the future of content distribution. Explore open positions and grow your career with us.',
}

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance plus wellness stipend'
  },
  {
    icon: Coffee,
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and unlimited PTO'
  },
  {
    icon: Laptop,
    title: 'Equipment & Setup',
    description: 'Top-tier equipment and $2,000 home office setup budget'
  },
  {
    icon: Plane,
    title: 'Travel & Events',
    description: 'Annual team retreats and conference attendance budget'
  },
  {
    icon: GraduationCap,
    title: 'Learning & Growth',
    description: '$3,000 annual learning budget and mentorship programs'
  },
  {
    icon: DollarSign,
    title: 'Equity & Bonuses',
    description: 'Competitive equity package and performance bonuses'
  }
]

const openPositions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Build scalable systems that power content distribution to 1000+ platforms.',
    requirements: ['5+ years full-stack experience', 'React/Next.js expertise', 'Node.js/Python backend', 'Database design'],
    salary: '$140k - $180k'
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote / New York',
    type: 'Full-time',
    experience: 'Mid-Senior',
    description: 'Drive product strategy and roadmap for our creator tools and platform integrations.',
    requirements: ['3+ years product management', 'B2B SaaS experience', 'Data-driven mindset', 'Creator economy knowledge'],
    salary: '$120k - $160k'
  },
  {
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Develop AI systems for content optimization, personalization, and automated distribution.',
    requirements: ['ML/AI expertise', 'Python/TensorFlow', 'NLP experience', 'Production ML systems'],
    salary: '$150k - $200k'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: 'Mid-Senior',
    description: 'Scale our infrastructure to handle millions of content distributions daily.',
    requirements: ['AWS/GCP expertise', 'Kubernetes/Docker', 'CI/CD pipelines', 'Monitoring & observability'],
    salary: '$130k - $170k'
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote / London',
    type: 'Full-time',
    experience: 'Mid-level',
    description: 'Help enterprise customers maximize value from our platform and drive expansion.',
    requirements: ['B2B customer success', 'SaaS experience', 'Excellent communication', 'Data analysis skills'],
    salary: '$80k - $120k'
  },
  {
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: 'Mid-level',
    description: 'Create compelling content that educates and engages our creator community.',
    requirements: ['Content marketing experience', 'Creator economy knowledge', 'SEO expertise', 'Analytics skills'],
    salary: '$90k - $130k'
  }
]

const values = [
  'Remote-first culture with global team',
  'Transparent communication and feedback',
  'Ownership and autonomy in your work',
  'Continuous learning and growth mindset',
  'Diversity, equity, and inclusion focus',
  'Work-life balance and mental health support'
]

const getExperienceColor = (level: string) => {
  switch (level) {
    case 'Junior': return 'bg-green-100 text-green-800'
    case 'Mid-level': return 'bg-blue-100 text-blue-800'
    case 'Mid-Senior': return 'bg-purple-100 text-purple-800'
    case 'Senior': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function CareersPage() {
  return (
    <PageLayout>
      <PageHero
        title="Join Our Mission"
        description="Help us democratize content distribution and empower creators worldwide. Build the future of content with a passionate, global team."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#positions">
              View Open Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn About Us</Link>
          </Button>
        </div>
      </PageHero>

      {/* Company Culture */}
      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're building something special - a platform that empowers millions of creators to reach global audiences. 
            Join us in shaping the future of content distribution.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Open Positions */}
      <ContentSection background="muted" id="positions">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <Badge className={getExperienceColor(position.experience)}>
                          {position.experience}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {position.salary}
                        </div>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/careers/apply?position=${encodeURIComponent(position.title)}`}>
                        Apply Now
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Requirements:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Application Process */}
      <ContentSection>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Hiring Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Application</h3>
              <p className="text-sm text-muted-foreground">Submit your application and we'll review it within 48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Phone Screen</h3>
              <p className="text-sm text-muted-foreground">30-minute call to discuss your background and the role</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Technical Interview</h3>
              <p className="text-sm text-muted-foreground">Role-specific interview to assess technical skills</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Final Interview</h3>
              <p className="text-sm text-muted-foreground">Meet the team and discuss culture fit and next steps</p>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't see a perfect fit? We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/careers/apply">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
