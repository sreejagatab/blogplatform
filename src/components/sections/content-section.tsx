"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  background?: 'default' | 'muted' | 'primary' | 'secondary'
  padding?: 'sm' | 'md' | 'lg'
}

export function ContentSection({ 
  children, 
  className,
  containerClassName,
  background = 'default',
  padding = 'md'
}: ContentSectionProps) {
  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground'
  }

  const paddingClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-24'
  }

  return (
    <section className={cn(
      backgroundClasses[background],
      paddingClasses[padding],
      className
    )}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  )
}
