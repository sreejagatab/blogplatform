'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  senderName?: string
}

interface ChatWidgetProps {
  isOpen: boolean
  onToggle: () => void
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! I\'m here to help you with Universal Blog Platform. How can I assist you today?',
    sender: 'bot',
    timestamp: new Date(),
    senderName: 'Support Bot'
  }
]

const quickReplies = [
  'How do I connect my social media accounts?',
  'I need help with billing',
  'How do I schedule posts?',
  'I\'m having trouble publishing content'
]

export function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [chatStatus, setChatStatus] = useState<'online' | 'offline' | 'busy'>('online')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'Support Bot'
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
      return 'I can help you with billing questions! You can manage your subscription and payment methods in your account settings. For specific billing issues, I\'ll connect you with our billing team. Would you like me to do that?'
    }
    
    if (lowerMessage.includes('connect') || lowerMessage.includes('social media')) {
      return 'To connect your social media accounts, go to Settings > Platform Connections. Click "Add Platform" and follow the authorization steps. We support Twitter, LinkedIn, Facebook, Instagram, and many more platforms!'
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('scheduling')) {
      return 'You can schedule posts by clicking the calendar icon when creating content. Set your desired date and time, and we\'ll automatically publish to your connected platforms. You can also set up recurring schedules!'
    }
    
    if (lowerMessage.includes('publish') || lowerMessage.includes('publishing')) {
      return 'If you\'re having trouble publishing, first check that your platforms are properly connected in Settings. Also verify that your content meets each platform\'s requirements. Would you like me to help troubleshoot a specific platform?'
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help you get the most out of Universal Blog Platform. What can I assist you with today?'
    }
    
    return 'Thanks for your message! I\'m a basic support bot, but I can help with common questions about platform connections, scheduling, billing, and publishing. For more complex issues, I can connect you with a human agent. What specific area would you like help with?'
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm">Support Chat</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    chatStatus === 'online' ? 'bg-green-400' :
                    chatStatus === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <CardDescription className="text-xs text-primary-foreground/80">
                    {chatStatus === 'online' ? 'Online' : 
                     chatStatus === 'busy' ? 'Busy' : 'Offline'}
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg p-3`}>
                    {message.sender !== 'user' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs font-medium">{message.senderName}</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs font-medium">Support Bot</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="space-y-1">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto p-2"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </>
  )
}
