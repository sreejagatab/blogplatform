import { ReactNode } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChatButton } from '@/components/support/chat-widget'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  showChat?: boolean
}

export function PageLayout({
  children,
  className,
  showHeader = true,
  showFooter = true,
  showChat = true
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header />}
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      {showFooter && <Footer />}
      {showChat && <ChatButton />}
    </div>
  )
}
