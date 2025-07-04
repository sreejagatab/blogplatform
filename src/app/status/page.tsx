import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Activity,
  Server,
  Database,
  Globe,
  Zap,
  Shield,
  ExternalLink,
  TrendingUp,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Real-time status of Universal Blog Platform services and infrastructure.',
}

const systemStatus = {
  overall: 'operational', // operational, degraded, outage
  lastUpdated: '2024-12-26 14:30 UTC'
}

const services = [
  {
    name: 'API Services',
    status: 'operational',
    uptime: 99.98,
    description: 'Core API endpoints and authentication',
    icon: Server
  },
  {
    name: 'Content Publishing',
    status: 'operational',
    uptime: 99.95,
    description: 'Multi-platform content distribution',
    icon: Globe
  },
  {
    name: 'AI Writing Assistant',
    status: 'operational',
    uptime: 99.92,
    description: 'AI-powered content generation',
    icon: Zap
  },
  {
    name: 'Analytics Dashboard',
    status: 'operational',
    uptime: 99.97,
    description: 'Real-time analytics and reporting',
    icon: TrendingUp
  },
  {
    name: 'Database Systems',
    status: 'operational',
    uptime: 99.99,
    description: 'Primary and backup databases',
    icon: Database
  },
  {
    name: 'Authentication',
    status: 'operational',
    uptime: 99.96,
    description: 'User login and security services',
    icon: Shield
  }
]

const recentIncidents = [
  {
    title: 'Scheduled Maintenance - Database Optimization',
    status: 'resolved',
    date: '2024-12-20',
    duration: '2 hours',
    impact: 'No service disruption',
    description: 'Routine database optimization and performance improvements completed successfully.'
  },
  {
    title: 'Intermittent API Timeouts',
    status: 'resolved',
    date: '2024-12-15',
    duration: '45 minutes',
    impact: 'Some users experienced delays',
    description: 'Resolved high traffic load causing API timeouts. Additional capacity provisioned.'
  },
  {
    title: 'Social Media Platform Integration Issue',
    status: 'resolved',
    date: '2024-12-10',
    duration: '3 hours',
    impact: 'LinkedIn publishing affected',
    description: 'LinkedIn API changes caused publishing failures. Integration updated and restored.'
  }
]

const upcomingMaintenance = [
  {
    title: 'Infrastructure Upgrade',
    date: '2024-12-30',
    time: '02:00 - 04:00 UTC',
    impact: 'Brief service interruptions possible',
    description: 'Upgrading server infrastructure for improved performance and reliability.'
  }
]

const metrics = [
  {
    name: 'API Response Time',
    value: '145ms',
    trend: 'stable',
    target: '< 200ms'
  },
  {
    name: 'Success Rate',
    value: '99.97%',
    trend: 'up',
    target: '> 99.9%'
  },
  {
    name: 'Posts Published/Hour',
    value: '12,450',
    trend: 'up',
    target: 'N/A'
  },
  {
    name: 'Active Connections',
    value: '8,234',
    trend: 'stable',
    target: 'N/A'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'text-green-600 bg-green-100'
    case 'degraded': return 'text-yellow-600 bg-yellow-100'
    case 'outage': return 'text-red-600 bg-red-100'
    case 'maintenance': return 'text-blue-600 bg-blue-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return CheckCircle
    case 'degraded': return AlertTriangle
    case 'outage': return XCircle
    case 'maintenance': return Clock
    default: return Activity
  }
}

const getIncidentStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return 'text-green-600 bg-green-100'
    case 'investigating': return 'text-yellow-600 bg-yellow-100'
    case 'identified': return 'text-orange-600 bg-orange-100'
    case 'monitoring': return 'text-blue-600 bg-blue-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export default function StatusPage() {
  const StatusIcon = getStatusIcon(systemStatus.overall)
  
  return (
    <PageLayout>
      <PageHero
        title="System Status"
        description="Real-time status and performance metrics for Universal Blog Platform services."
        size="md"
      />

      {/* Overall Status */}
      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-12">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${getStatusColor(systemStatus.overall)}`}>
                  <StatusIcon className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                All Systems {systemStatus.overall === 'operational' ? 'Operational' : 'Status'}
              </CardTitle>
              <CardDescription>
                Last updated: {systemStatus.lastUpdated}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Service Status */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Service Status</h2>
            <div className="space-y-4">
              {services.map((service, index) => {
                const ServiceIcon = service.icon
                const StatusIcon = getStatusIcon(service.status)
                
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <ServiceIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{service.uptime}% uptime</div>
                            <Progress value={service.uptime} className="w-20 h-2 mt-1" />
                          </div>
                          <Badge className={getStatusColor(service.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {metric.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className={`h-3 w-3 ${
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <span>Target: {metric.target}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {recentIncidents.map((incident, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {incident.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {incident.duration}
                      </div>
                      <span>Impact: {incident.impact}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          {upcomingMaintenance.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Scheduled Maintenance</h2>
              <div className="space-y-4">
                {upcomingMaintenance.map((maintenance, index) => (
                  <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{maintenance.date}</span>
                            <span>{maintenance.time}</span>
                            <span>Impact: {maintenance.impact}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{maintenance.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </ContentSection>

      {/* Subscribe to Updates */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get notified about service updates, maintenance windows, and incident reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/status/subscribe">
                Subscribe to Updates
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://status.universalblog.com" target="_blank">
                Status Page RSS
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
