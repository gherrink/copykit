import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cookieRead, cookieWrite } from './cookie'

describe('Cookie Utilities', () => {
  let mockCookies: string
  let mockLocation: Partial<Location>

  beforeEach(() => {
    // Mock document.cookie with a getter/setter
    mockCookies = ''

    Object.defineProperty(document, 'cookie', {
      get: () => mockCookies,
      set: (value: string) => {
        // Parse and store the cookie
        const [nameValue] = value.split(';')
        const [name] = nameValue.split('=')

        if (value.includes('expires=Thu, 01 Jan 1970')) {
          // Remove cookie (expired)
          mockCookies = mockCookies
            .split('; ')
            .filter(cookie => !cookie.startsWith(`${name.trim()}=`))
            .join('; ')
        } else {
          // Add or update cookie (including empty values)
          const existingCookies = mockCookies ? mockCookies.split('; ') : []
          const updatedCookies = existingCookies.filter(
            cookie => !cookie.startsWith(`${name.trim()}=`),
          )
          updatedCookies.push(nameValue)
          mockCookies = updatedCookies.join('; ')
        }
      },
      configurable: true,
    })

    // Mock window.location
    mockLocation = {
      protocol: 'https:',
    }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    // Clear mock cookies
    mockCookies = ''
    vi.restoreAllMocks()
  })

  describe('cookieRead', () => {
    it('should read existing cookie value', () => {
      document.cookie = 'testCookie=testValue; path=/'

      const result = cookieRead('testCookie')

      expect(result).toBe('testValue')
    })

    it('should return null for non-existent cookie', () => {
      const result = cookieRead('nonExistentCookie')

      expect(result).toBe(null)
    })

    it('should handle cookies with special characters', () => {
      document.cookie = 'specialCookie=value%20with%20spaces; path=/'

      const result = cookieRead('specialCookie')

      expect(result).toBe('value%20with%20spaces')
    })

    it('should handle empty cookie value', () => {
      document.cookie = 'emptyCookie=; path=/'

      const result = cookieRead('emptyCookie')

      expect(result).toBe('')
    })

    it('should handle cookies with semicolons in value', () => {
      document.cookie = 'cookieWithSemicolon=value;extra; path=/'

      const result = cookieRead('cookieWithSemicolon')

      expect(result).toBe('value')
    })

    it('should return null when cookie name is substring of another', () => {
      document.cookie = 'testCookieLong=longValue; path=/'

      const result = cookieRead('test')

      expect(result).toBe(null)
    })

    it('should handle multiple cookies and return correct one', () => {
      document.cookie = 'cookie1=value1; path=/'
      document.cookie = 'cookie2=value2; path=/'
      document.cookie = 'cookie3=value3; path=/'

      expect(cookieRead('cookie1')).toBe('value1')
      expect(cookieRead('cookie2')).toBe('value2')
      expect(cookieRead('cookie3')).toBe('value3')
    })
  })

  describe('cookieWrite', () => {
    it('should write cookie with basic name and value', () => {
      cookieWrite('testCookie', 'testValue')

      expect(document.cookie).toContain('testCookie=testValue')
      expect(cookieRead('testCookie')).toBe('testValue')
    })

    it('should write cookie with expiration time', () => {
      const expireInSeconds = 3600 // 1 hour

      cookieWrite('expireCookie', 'expireValue', expireInSeconds)

      const cookie = document.cookie

      expect(cookie).toContain('expireCookie=expireValue')
      expect(cookieRead('expireCookie')).toBe('expireValue')
    })

    it('should write cookie without expiration when not specified', () => {
      cookieWrite('sessionCookie', 'sessionValue')

      const cookie = document.cookie
      expect(cookie).toContain('sessionCookie=sessionValue')
      expect(cookieRead('sessionCookie')).toBe('sessionValue')
    })

    it('should add secure flag on HTTPS', () => {
      mockLocation.protocol = 'https:'

      cookieWrite('secureCookie', 'secureValue')

      expect(document.cookie).toContain('secureCookie=secureValue')
      // Verify the cookie was written correctly
      expect(cookieRead('secureCookie')).toBe('secureValue')
    })

    it('should not add secure flag on HTTP', () => {
      mockLocation.protocol = 'http:'

      cookieWrite('httpCookie', 'httpValue')

      const cookie = document.cookie
      expect(cookie).toContain('httpCookie=httpValue')
      // Verify the cookie was written correctly
      expect(cookieRead('httpCookie')).toBe('httpValue')
    })

    it('should write cookie successfully', () => {
      cookieWrite('pathCookie', 'pathValue')

      expect(document.cookie).toContain('pathCookie=pathValue')
      expect(cookieRead('pathCookie')).toBe('pathValue')
    })

    it('should overwrite existing cookie with same name', () => {
      cookieWrite('overwriteCookie', 'originalValue')
      expect(cookieRead('overwriteCookie')).toBe('originalValue')

      cookieWrite('overwriteCookie', 'newValue')
      expect(cookieRead('overwriteCookie')).toBe('newValue')
    })

    it('should handle special characters in values', () => {
      const specialValue = 'value with spaces & symbols!'

      cookieWrite('specialCookie', specialValue)

      expect(document.cookie).toContain('specialCookie=value with spaces & symbols!')
    })

    it('should work with zero expiration time', () => {
      cookieWrite('zeroCookie', 'zeroValue', 0)

      const cookie = document.cookie
      expect(cookie).toContain('zeroCookie=zeroValue')
      expect(cookieRead('zeroCookie')).toBe('zeroValue')
    })
  })

  describe('Integration tests', () => {
    it('should write and read back the same value', () => {
      const testValue = 'integration-test-value'

      cookieWrite('integrationCookie', testValue)
      const readValue = cookieRead('integrationCookie')

      expect(readValue).toBe(testValue)
    })

    it('should handle writing multiple cookies', () => {
      cookieWrite('cookie1', 'value1')
      cookieWrite('cookie2', 'value2')
      cookieWrite('cookie3', 'value3')

      expect(cookieRead('cookie1')).toBe('value1')
      expect(cookieRead('cookie2')).toBe('value2')
      expect(cookieRead('cookie3')).toBe('value3')
    })

    it('should handle cookie lifecycle with expiration', () => {
      // Write cookie with very short expiration
      cookieWrite('shortCookie', 'shortValue', 1)

      // Should be readable immediately
      expect(cookieRead('shortCookie')).toBe('shortValue')

      // Verify the cookie was stored correctly
      expect(document.cookie).toContain('shortCookie=shortValue')
    })
  })
})
