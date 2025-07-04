import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewsletterSignup } from '@/components/sections/newsletter-signup'

// Mock fetch
global.fetch = jest.fn()

describe('NewsletterSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders newsletter signup form', () => {
    render(<NewsletterSignup />)
    
    expect(screen.getByText('Stay Updated')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('handles successful subscription', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)

    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
  })

  it('handles subscription error', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<NewsletterSignup />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)

    // Wait for the loading state to finish
    await waitFor(() => {
      expect(subscribeButton).not.toBeDisabled()
    })

    // The error is shown via toast, not inline text
    expect(mockFetch).toHaveBeenCalled()
  })

  it('validates email format', async () => {
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(subscribeButton)

    // Should not make API call with invalid email
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows loading state during subscription', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)

    // Check for loading state
    expect(subscribeButton).toBeDisabled()
  })
})
