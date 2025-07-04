import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface SocketUser {
  id: string
  name: string
  role: string
  email: string
}

export interface AuthenticatedSocket extends Socket {
  user?: SocketUser
}

let io: SocketIOServer | null = null

export function initializeWebSocketServer(httpServer: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      // Verify token and get user info
      // In a real implementation, you'd verify the JWT token
      const session = await auth()
      if (!session?.user) {
        return next(new Error('Invalid authentication token'))
      }

      socket.user = {
        id: session.user.id,
        name: session.user.name || '',
        role: (session.user as any).role || 'USER',
        email: session.user.email || ''
      }

      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.name} connected`)

    // Join user to their personal room
    if (socket.user) {
      socket.join(`user:${socket.user.id}`)
      
      // Join admin users to admin room
      if (['ADMIN', 'EDITOR'].includes(socket.user.role)) {
        socket.join('admin')
      }
    }

    // Handle joining post rooms for real-time comments
    socket.on('join-post', (postId: string) => {
      socket.join(`post:${postId}`)
      console.log(`User ${socket.user?.name} joined post ${postId}`)
    })

    // Handle leaving post rooms
    socket.on('leave-post', (postId: string) => {
      socket.leave(`post:${postId}`)
      console.log(`User ${socket.user?.name} left post ${postId}`)
    })

    // Handle real-time comment creation
    socket.on('new-comment', async (data: {
      postId: string
      content: string
      parentId?: string
    }) => {
      try {
        if (!socket.user) return

        // Create comment in database
        const comment = await prisma.comment.create({
          data: {
            content: data.content,
            postId: data.postId,
            authorId: socket.user.id,
            parentId: data.parentId,
            approved: true // Auto-approve for now
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        })

        // Broadcast to all users in the post room
        io?.to(`post:${data.postId}`).emit('comment-added', {
          comment,
          postId: data.postId
        })

        // Notify admins of new comment
        io?.to('admin').emit('admin-notification', {
          type: 'new-comment',
          message: `New comment by ${socket.user.name}`,
          data: { comment, postId: data.postId }
        })

      } catch (error) {
        console.error('Error creating real-time comment:', error)
        socket.emit('error', { message: 'Failed to create comment' })
      }
    })

    // Handle typing indicators
    socket.on('typing-start', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('user-typing', {
        userId: socket.user?.id,
        userName: socket.user?.name,
        postId: data.postId
      })
    })

    socket.on('typing-stop', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('user-stopped-typing', {
        userId: socket.user?.id,
        postId: data.postId
      })
    })

    // Handle real-time analytics updates
    socket.on('page-view', async (data: {
      postId?: string
      path: string
      referrer?: string
    }) => {
      try {
        // Record page view
        await prisma.pageView.create({
          data: {
            postId: data.postId,
            path: data.path,
            referrer: data.referrer,
            visitorId: socket.user?.id || 'anonymous',
            userAgent: socket.handshake.headers['user-agent'] || '',
            sessionId: socket.id
          }
        })

        // Update real-time analytics for admins
        if (data.postId) {
          const viewCount = await prisma.pageView.count({
            where: { postId: data.postId }
          })

          io?.to('admin').emit('analytics-update', {
            type: 'page-view',
            postId: data.postId,
            viewCount,
            timestamp: new Date()
          })
        }

      } catch (error) {
        console.error('Error recording page view:', error)
      }
    })

    // Handle notifications
    socket.on('mark-notification-read', async (notificationId: string) => {
      try {
        if (!socket.user) return

        await prisma.notification.update({
          where: {
            id: notificationId,
            userId: socket.user.id
          },
          data: { read: true }
        })

        socket.emit('notification-updated', { id: notificationId, read: true })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.name} disconnected`)
    })
  })

  return io
}

export function getWebSocketServer(): SocketIOServer | null {
  return io
}

// Helper functions to emit events from API routes
export function emitToPost(postId: string, event: string, data: any) {
  if (io) {
    io.to(`post:${postId}`).emit(event, data)
  }
}

export function emitToUser(userId: string, event: string, data: any) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}

export function emitToAdmins(event: string, data: any) {
  if (io) {
    io.to('admin').emit(event, data)
  }
}

export function broadcastAnalyticsUpdate(data: any) {
  if (io) {
    io.to('admin').emit('analytics-update', data)
  }
}
