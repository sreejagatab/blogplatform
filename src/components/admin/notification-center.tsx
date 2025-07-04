'use client'

import { useState, useEffect } from 'react'
import { 
  Bell,
  Check,
  X,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  UserPlus,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Filter,
  MoreHorizontal,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Notification {
  id: string
  type: 'comment' | 'like' | 'share' | 'follow' | 'mention' | 'system' | 'achievement'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  actor?: {
    id: string
    name: string
    avatar?: string
  }
  metadata?: {
    postTitle?: string
    postId?: string
    commentText?: string
  }
  priority: 'low' | 'medium' | 'high'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'New comment on your post',
    message: 'John Doe commented on "The Future of Web Development"',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    actionUrl: '/posts/1#comment-123',
    actor: {
      id: '1',
      name: 'John Doe',
      avatar: '/avatars/john.jpg'
    },
    metadata: {
      postTitle: 'The Future of Web Development',
      postId: '1',
      commentText: 'Great insights! I especially liked the part about AI integration.'
    },
    priority: 'medium'
  },
  {
    id: '2',
    type: 'like',
    title: 'Your post was liked',
    message: 'Jane Smith and 12 others liked your post',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    actionUrl: '/posts/2',
    actor: {
      id: '2',
      name: 'Jane Smith',
      avatar: '/avatars/jane.jpg'
    },
    metadata: {
      postTitle: 'Database Optimization Tips',
      postId: '2'
    },
    priority: 'low'
  },
  {
    id: '3',
    type: 'follow',
    title: 'New follower',
    message: 'Mike Johnson started following you',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/profile/mike-johnson',
    actor: {
      id: '3',
      name: 'Mike Johnson',
      avatar: '/avatars/mike.jpg'
    },
    priority: 'medium'
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly analytics report',
    message: 'Your weekly performance report is ready',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: '/admin/analytics',
    priority: 'low'
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Milestone reached!',
    message: 'Congratulations! You\'ve reached 1,000 total views',
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    priority: 'high'
  }
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notification.read) ||
      (filter === 'unread' && !notification.read)
    
    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter
    
    return matchesReadFilter && matchesTypeFilter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return MessageCircle
      case 'like': return Heart
      case 'share': return Share2
      case 'follow': return UserPlus
      case 'mention': return MessageCircle
      case 'system': return Info
      case 'achievement': return CheckCircle
      default: return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-blue-600'
      case 'like': return 'text-red-600'
      case 'share': return 'text-green-600'
      case 'follow': return 'text-purple-600'
      case 'mention': return 'text-blue-600'
      case 'system': return 'text-gray-600'
      case 'achievement': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
              >
                <option value="all">All Types</option>
                <option value="comment">Comments</option>
                <option value="like">Likes</option>
                <option value="share">Shares</option>
                <option value="follow">Follows</option>
                <option value="system">System</option>
                <option value="achievement">Achievements</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredNotifications.length} notifications
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const Icon = getNotificationIcon(notification.type)
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${
                      getNotificationColor(notification.type)
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>

                          {/* Actor info */}
                          {notification.actor && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={notification.actor.avatar} />
                                <AvatarFallback className="text-xs">
                                  {notification.actor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {notification.actor.name}
                              </span>
                            </div>
                          )}

                          {/* Metadata */}
                          {notification.metadata?.commentText && (
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 mb-2">
                              "{notification.metadata.commentText}"
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.metadata?.postTitle && (
                              <span>in "{notification.metadata.postTitle}"</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {notification.actionUrl && (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.length}
              </p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-red-600">
                {unreadCount}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
              <p className="text-2xl font-bold text-blue-600">
                {notifications.filter(n => n.type === 'comment').length}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Followers</p>
              <p className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => n.type === 'follow').length}
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>
    </div>
  )
}
