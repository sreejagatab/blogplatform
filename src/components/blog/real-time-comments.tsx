'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Reply, Heart, Flag, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  replies?: Comment[]
  parentId?: string
}

interface TypingUser {
  userId: string
  userName: string
}

interface RealTimeCommentsProps {
  postId: string
  initialComments?: Comment[]
}

export default function RealTimeComments({ postId, initialComments = [] }: RealTimeCommentsProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user) return

    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      auth: {
        token: 'session-token' // In production, use actual JWT token
      }
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      socketInstance.emit('join-post', postId)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for new comments
    socketInstance.on('comment-added', (data: { comment: Comment; postId: string }) => {
      if (data.postId === postId) {
        setComments(prev => [data.comment, ...prev])
        toast.success('New comment added!')
      }
    })

    // Listen for typing indicators
    socketInstance.on('user-typing', (data: { userId: string; userName: string; postId: string }) => {
      if (data.postId === postId && data.userId !== session.user.id) {
        setTypingUsers(prev => {
          const existing = prev.find(u => u.userId === data.userId)
          if (!existing) {
            return [...prev, { userId: data.userId, userName: data.userName }]
          }
          return prev
        })
      }
    })

    socketInstance.on('user-stopped-typing', (data: { userId: string; postId: string }) => {
      if (data.postId === postId) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
      }
    })

    socketInstance.on('error', (error: { message: string }) => {
      toast.error(error.message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.emit('leave-post', postId)
      socketInstance.disconnect()
    }
  }, [session, postId])

  // Handle typing indicators
  const handleTypingStart = () => {
    if (socket && isConnected) {
      socket.emit('typing-start', { postId })
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing-stop', { postId })
      }, 3000)
    }
  }

  const handleTypingStop = () => {
    if (socket && isConnected) {
      socket.emit('typing-stop', { postId })
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !socket || !isConnected) return

    setIsSubmitting(true)
    handleTypingStop()

    try {
      socket.emit('new-comment', {
        postId,
        content: newComment.trim()
      })
      
      setNewComment('')
    } catch (error) {
      toast.error('Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !socket || !isConnected || !replyTo) return

    setIsSubmitting(true)

    try {
      socket.emit('new-comment', {
        postId,
        content: replyContent.trim(),
        parentId: replyTo
      })
      
      setReplyContent('')
      setReplyTo(null)
    } catch (error) {
      toast.error('Failed to submit reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.user) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please sign in to view and post comments.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* New Comment Form */}
      <Card className="p-4">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>
                {session.user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value)
                  handleTypingStart()
                }}
                onBlur={handleTypingStop}
                placeholder="Write a comment..."
                className="min-h-[80px]"
                disabled={!isConnected}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {typingUsers.length > 0 && (
                <span>
                  {typingUsers.map(u => u.userName).join(', ')} 
                  {typingUsers.length === 1 ? ' is' : ' are'} typing...
                </span>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting || !isConnected}
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post Comment
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.image || ''} alt={comment.author.name} />
                <AvatarFallback>
                  {comment.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-gray-100 mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </div>

                {/* Reply Form */}
                {replyTo === comment.id && (
                  <form onSubmit={handleSubmitReply} className="mt-4 space-y-3">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={!replyContent.trim() || isSubmitting}>
                        Reply
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setReplyTo(null)
                          setReplyContent('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
