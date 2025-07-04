interface ContentSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ContentSection({
  title, 
  description, 
  children, 
  className = "" 
}: ContentSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </section>
  )
}

export default ContentSection;
