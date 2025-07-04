import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'



// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}))



describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { 
      name: /Universal Blog Platform for Content Creators/i 
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders the hero section', () => {
    render(<HomePage />)
    
    const description = screen.getByText(/Distribute your content to 1000\+ platforms automatically/i)
    expect(description).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(<HomePage />)
    
    const getStartedButton = screen.getByRole('link', { name: /Get Started Free/i })
    expect(getStartedButton).toBeInTheDocument()
  })

  it('renders the newsletter signup section', () => {
    render(<HomePage />)
    
    const newsletterHeading = screen.getByRole('heading', { name: /Stay Updated/i })
    expect(newsletterHeading).toBeInTheDocument()
  })
})
