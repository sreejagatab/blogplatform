'use client'

import { useState } from 'react'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Mail,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.log('Error copying to clipboard:', error)
    }
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + url)}`
  }

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareUrls.linkedin,
      color: 'hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareUrls.email,
      color: 'hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      color: 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20'
    }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Share this article
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Native Share (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}

        {/* Social Media Buttons */}
        {shareButtons.map(button => {
          const Icon = button.icon
          return (
            <Button
              key={button.name}
              variant="outline"
              size="sm"
              asChild
              className={`flex items-center gap-2 ${button.color}`}
            >
              <a
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${button.name}`}
              >
                <Icon className="h-4 w-4" />
                {button.name}
              </a>
            </Button>
          )
        })}

        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      {/* Share Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Help others discover this content by sharing it with your network
        </p>
      </div>
    </Card>
  )
}
