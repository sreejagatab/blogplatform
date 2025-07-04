'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BlogSearchProps {
  initialSearch?: string
  initialCategory?: string
  initialTag?: string
  initialSort?: string
}

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  _count?: {
    posts: number
  }
}

interface Tag {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'liked', label: 'Most Liked' }
]

export default function BlogSearch({
  initialSearch = '',
  initialCategory = '',
  initialTag = '',
  initialSort = 'newest'
}: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTag, setSelectedTag] = useState(initialTag)
  const [selectedSort, setSelectedSort] = useState(initialSort)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories?withCounts=true'),
          fetch('/api/tags?popular=true&limit=20')
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setTags(tagsData)
        }
      } catch (error) {
        console.error('Error fetching categories and tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    // Always reset to page 1 when filters change
    newSearchParams.delete('page')

    const queryString = newSearchParams.toString()
    const newURL = queryString ? `/blog?${queryString}` : '/blog'
    
    router.push(newURL)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({
      search: searchQuery,
      category: selectedCategory,
      tag: selectedTag,
      sort: selectedSort
    })
  }

  const handleCategorySelect = (categorySlug: string) => {
    const newCategory = selectedCategory === categorySlug ? '' : categorySlug
    setSelectedCategory(newCategory)
    updateURL({
      search: searchQuery,
      category: newCategory,
      tag: selectedTag,
      sort: selectedSort
    })
  }

  const handleTagSelect = (tagSlug: string) => {
    const newTag = selectedTag === tagSlug ? '' : tagSlug
    setSelectedTag(newTag)
    updateURL({
      search: searchQuery,
      category: selectedCategory,
      tag: newTag,
      sort: selectedSort
    })
  }

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue)
    updateURL({
      search: searchQuery,
      category: selectedCategory,
      tag: selectedTag,
      sort: sortValue
    })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTag('')
    setSelectedSort('newest')
    router.push('/blog')
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag || selectedSort !== 'newest'

  return (
    <Card className="p-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {[searchQuery, selectedCategory, selectedTag, selectedSort !== 'newest' ? selectedSort : ''].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active filters:
          </span>
          
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('')
                  updateURL({
                    search: '',
                    category: selectedCategory,
                    tag: selectedTag,
                    sort: selectedSort
                  })
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.slug === selectedCategory)?.name}
              <button
                onClick={() => handleCategorySelect(selectedCategory)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedTag && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tag: {selectedTag}
              <button
                onClick={() => handleTagSelect(selectedTag)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedSort !== 'newest' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {sortOptions.find(s => s.value === selectedSort)?.label}
              <button
                onClick={() => handleSortChange('newest')}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              Sort By
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <Button
                  key={option.value}
                  variant={selectedSort === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategorySelect(category.slug)}
                  className={selectedCategory === category.slug ? 'text-white' : ''}
                  style={selectedCategory === category.slug ? { backgroundColor: category.color } : {}}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                return (
                  <Button
                    key={tag}
                    variant={selectedTag === tagSlug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTagSelect(tagSlug)}
                  >
                    {tag}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
