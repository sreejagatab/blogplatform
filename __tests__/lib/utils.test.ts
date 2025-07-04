import { cn, formatDate, slugify, excerpt, readingTime } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/January 15, 2024/)
    })

    it('handles string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/January 15, 2024/)
    })

    it('handles invalid dates gracefully', () => {
      const formatted = formatDate('invalid-date')
      expect(formatted).toBe('Invalid Date')
    })
  })

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(slugify('Hello, World! How are you?')).toBe('hello-world-how-are-you')
    })

    it('handles multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world')
    })

    it('handles leading and trailing spaces', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('excerpt', () => {
    it('truncates text to specified length', () => {
      const text = 'This is a long text that should be truncated'
      expect(excerpt(text, 20)).toBe('This is a long text...')
    })

    it('returns original text if shorter than limit', () => {
      const text = 'Short text'
      expect(excerpt(text, 20)).toBe('Short text')
    })

    it('handles empty string', () => {
      expect(excerpt('', 10)).toBe('')
    })

    it('uses default length when not specified', () => {
      const text = 'This is a very long text that should be truncated to the default length of 160 characters which is quite long and should definitely exceed the default limit set by the function'
      const result = excerpt(text)
      expect(result.length).toBeLessThanOrEqual(163) // 160 + '...'
      expect(result.endsWith('...')).toBe(true)
    })
  })

  describe('readingTime', () => {
    it('calculates reading time for text', () => {
      const text = 'This is a sample text with multiple words to test reading time calculation. '.repeat(10)
      const time = readingTime(text)
      expect(time).toBeGreaterThan(0)
      expect(typeof time).toBe('number')
    })

    it('returns minimum 1 minute for short text', () => {
      const text = 'Short text'
      const time = readingTime(text)
      expect(time).toBe(1)
    })

    it('handles empty text', () => {
      const time = readingTime('')
      expect(time).toBe(1)
    })

    it('calculates correctly for longer text', () => {
      // Assuming average reading speed of 200 words per minute
      const words = new Array(400).fill('word').join(' ')
      const time = readingTime(words)
      expect(time).toBe(2) // 400 words / 200 wpm = 2 minutes
    })
  })
})
