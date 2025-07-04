"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        toast.success(data.message)
      } else {
        toast.error(data.error || "Something went wrong. Please try again.")
      }
    } catch (_error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
          You&apos;ve successfully subscribed to our newsletter.
          You&apos;ll receive the latest updates about new features and platform integrations.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <Mail className="h-16 w-16 mx-auto mb-6 text-primary-foreground/80" />
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
        Get the latest updates on new platform integrations, AI features, 
        and content creation tips delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background text-foreground border-primary-foreground/20"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="secondary"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
        <p className="text-sm text-primary-foreground/60 mt-4">
          No spam, unsubscribe at any time.
        </p>
      </form>
    </div>
  )
}
