import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  backgroundPattern?: boolean
}

export function PageHero({ 
  title, 
  description, 
  children, 
  className,
  size = 'md',
  backgroundPattern = true
}: PageHeroProps) {
  const sizeClasses = {
    sm: 'py-16 md:py-20',
    md: 'py-20 md:py-28',
    lg: 'py-28 md:py-36'
  }

  return (
    <section className={cn(
      "relative overflow-hidden",
      backgroundPattern && "bg-gradient-to-br from-primary/5 via-background to-secondary/5",
      sizeClasses[size],
      className
    )}>
      {backgroundPattern && (
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      )}
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </section>
  )
}
