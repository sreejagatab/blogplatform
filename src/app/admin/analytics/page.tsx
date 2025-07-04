/**
 * Analytics Admin Page
 * Advanced analytics dashboard with comprehensive metrics
 */

import AnalyticsDashboard from '@/components/admin/analytics-dashboard';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}

export const metadata = {
  title: 'Analytics - Universal Blog Platform',
  description: 'Comprehensive analytics dashboard with real-time insights and performance metrics',
};
