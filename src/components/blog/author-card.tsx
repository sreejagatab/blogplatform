'use client'

import { Twitter, Linkedin, Github, Globe, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface Author {
  id: string
  name: string
  bio?: string
  avatar?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
    email?: string
  }
}

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: author.social?.linkedin ? `https://linkedin.com/in/${author.social.linkedin}` : null,
      color: 'hover:text-blue-600'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: author.social?.github ? `https://github.com/${author.social.github}` : null,
      color: 'hover:text-gray-700 dark:hover:text-gray-300'
    },
    {
      name: 'Website',
      icon: Globe,
      url: author.social?.website,
      color: 'hover:text-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: author.social?.email ? `mailto:${author.social.email}` : null,
      color: 'hover:text-red-600'
    }
  ].filter(link => link.url)

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="text-lg">
            {author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {author.name}
            </h3>
            <Link href={`/blog/author/${author.id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
          </div>

          {author.bio && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {author.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Connect:
              </span>
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 dark:text-gray-400 transition-colors ${link.color}`}
                    aria-label={`${author.name} on ${link.name}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Author Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Articles
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(Math.floor(Math.random() * 500) + 100).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Followers
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(Math.floor(Math.random() * 10000) + 1000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Views
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
