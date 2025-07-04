'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Globe,
  Mail,
  Calendar,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Brain,
  Image,
  Clock,
  Activity,
  Search,
  Bell,
  Send,
  Monitor,
  Zap
} from 'lucide-react'

interface SidebarItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/content', label: 'Content Hub', icon: FileText },
  { href: '/admin/ai', label: 'AI Content Hub', icon: Brain },
  { href: '/admin/publishing', label: 'Publishing Hub', icon: Send, badge: 'New' },
  { href: '/admin/health', label: 'Platform Health', icon: Monitor, badge: 'Live' },
  { href: '/admin/scheduler', label: 'Scheduler', icon: Clock },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/analytics/real-time', label: 'Real-Time', icon: Activity },
  { href: '/admin/seo', label: 'SEO Tools', icon: Search },
  { href: '/admin/ai-insights', label: 'AI Insights', icon: Brain },
  { href: '/admin/platforms', label: 'Platforms', icon: Globe },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { href: '/admin/email', label: 'Email Marketing', icon: Mail },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/scheduled', label: 'Scheduled', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
