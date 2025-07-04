'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, Users, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function BlogHero() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Content
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Explore the latest insights on web development, AI, technology trends, and more from our expert writers.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, or authors..."
                className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-gray-100"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 border-white/20 text-white p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Articles Published</div>
          </Card>
          
          <Card className="bg-white/10 border-white/20 text-white p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-purple-200" />
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-blue-100">Monthly Readers</div>
          </Card>
          
          <Card className="bg-white/10 border-white/20 text-white p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-indigo-200" />
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-blue-100">Reader Satisfaction</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
