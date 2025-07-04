import { Metadata } from 'next'
import BlogListing from '@/components/blog/blog-listing'
import BlogHero from '@/components/blog/blog-hero'
import FeaturedPosts from '@/components/blog/featured-posts'
import BlogCategories from '@/components/blog/blog-categories'
import BlogSearch from '@/components/blog/blog-search'

export const metadata: Metadata = {
  title: 'Blog - Universal Blog Platform',
  description: 'Discover the latest insights on web development, AI, technology trends, and more from our expert writers.',
  keywords: ['blog', 'web development', 'AI', 'technology', 'programming', 'tutorials'],
  openGraph: {
    title: 'Blog - Universal Blog Platform',
    description: 'Discover the latest insights on web development, AI, technology trends, and more.',
    type: 'website',
    images: ['/images/blog-og.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Universal Blog Platform',
    description: 'Discover the latest insights on web development, AI, technology trends, and more.',
    images: ['/images/blog-og.jpg']
  }
}

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    tag?: string
    search?: string
    sort?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const category = searchParams.category
  const tag = searchParams.tag
  const search = searchParams.search
  const sort = searchParams.sort || 'newest'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <BlogHero />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <BlogSearch 
            initialSearch={search}
            initialCategory={category}
            initialTag={tag}
            initialSort={sort}
          />
        </div>

        {/* Featured Posts (only on first page without filters) */}
        {currentPage === 1 && !category && !tag && !search && (
          <div className="mb-12">
            <FeaturedPosts />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogListing 
              page={currentPage}
              category={category}
              tag={tag}
              search={search}
              sort={sort}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <BlogCategories />

              {/* Popular Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {/* Mock popular posts */}
                  {[
                    {
                      title: 'Getting Started with Next.js 14',
                      slug: 'getting-started-nextjs-14',
                      views: 15420
                    },
                    {
                      title: 'AI-Powered Development Tools',
                      slug: 'ai-powered-development-tools',
                      views: 12350
                    },
                    {
                      title: 'Modern CSS Techniques',
                      slug: 'modern-css-techniques',
                      views: 9870
                    }
                  ].map((post, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <a 
                          href={`/blog/${post.slug}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                        >
                          {post.title}
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {post.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Stay Updated
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-md text-gray-900 text-sm"
                  />
                  <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS',
                    'Node.js', 'AI', 'Machine Learning', 'Web Development',
                    'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Testing'
                  ].map(tag => (
                    <a
                      key={tag}
                      href={`/blog?tag=${tag.toLowerCase().replace('.', '').replace(' ', '-')}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
