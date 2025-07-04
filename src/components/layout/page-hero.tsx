interface PageHeroProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-xl md:text-2xl text-blue-100 mb-8">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageHero;
