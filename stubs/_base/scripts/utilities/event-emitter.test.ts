import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter } from './event-emitter'

// Define test event interfaces for type safety testing
interface TestEvents {
  simpleEvent: () => void
  eventWithString: (message: string) => void
  eventWithMultipleArgs: (id: number, name: string, active: boolean) => void
  eventWithObject: (data: { id: number; name: string }) => void
}

interface UserEvents {
  login: (user: { id: number; email: string }) => void
  logout: () => void
  update: (field: string, value: string) => void
}

describe('EventEmitter', () => {
  let emitter: EventEmitter<TestEvents>
  let userEmitter: EventEmitter<UserEvents>

  beforeEach(() => {
    emitter = new EventEmitter<TestEvents>()
    userEmitter = new EventEmitter<UserEvents>()
  })

  describe('Basic Functionality', () => {
    it('should create an empty EventEmitter', () => {
      expect(emitter).toBeDefined()
      expect(emitter).toBeInstanceOf(EventEmitter)
    })

    it('should register event listeners with on()', () => {
      const listener = vi.fn()

      emitter.on('simpleEvent', listener)
      emitter.emit('simpleEvent')

      expect(listener).toHaveBeenCalledOnce()
    })

    it('should call multiple listeners for the same event', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const listener3 = vi.fn()

      emitter.on('simpleEvent', listener1)
      emitter.on('simpleEvent', listener2)
      emitter.on('simpleEvent', listener3)

      emitter.emit('simpleEvent')

      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).toHaveBeenCalledOnce()
      expect(listener3).toHaveBeenCalledOnce()
    })

    it('should not call listeners for different events', () => {
      const simpleListener = vi.fn()
      const stringListener = vi.fn()

      emitter.on('simpleEvent', simpleListener)
      emitter.on('eventWithString', stringListener)

      emitter.emit('simpleEvent')

      expect(simpleListener).toHaveBeenCalledOnce()
      expect(stringListener).not.toHaveBeenCalled()
    })
  })

  describe('Event Arguments', () => {
    it('should pass string arguments correctly', () => {
      const listener = vi.fn()

      emitter.on('eventWithString', listener)
      emitter.emit('eventWithString', 'test message')

      expect(listener).toHaveBeenCalledWith('test message')
    })

    it('should pass multiple arguments correctly', () => {
      const listener = vi.fn()

      emitter.on('eventWithMultipleArgs', listener)
      emitter.emit('eventWithMultipleArgs', 42, 'John', true)

      expect(listener).toHaveBeenCalledWith(42, 'John', true)
    })

    it('should pass object arguments correctly', () => {
      const listener = vi.fn()
      const testData = { id: 123, name: 'Test User' }

      emitter.on('eventWithObject', listener)
      emitter.emit('eventWithObject', testData)

      expect(listener).toHaveBeenCalledWith(testData)
    })

    it('should handle complex event scenarios', () => {
      const loginListener = vi.fn()
      const logoutListener = vi.fn()

      userEmitter.on('login', loginListener)
      userEmitter.on('logout', logoutListener)

      const user = { id: 1, email: 'test@example.com' }
      userEmitter.emit('login', user)
      userEmitter.emit('logout')

      expect(loginListener).toHaveBeenCalledWith(user)
      expect(logoutListener).toHaveBeenCalledOnce()
    })
  })

  describe('Listener Removal', () => {
    it('should remove specific listener with off()', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      emitter.on('simpleEvent', listener1)
      emitter.on('simpleEvent', listener2)

      emitter.off('simpleEvent', listener1)
      emitter.emit('simpleEvent')

      expect(listener1).not.toHaveBeenCalled()
      expect(listener2).toHaveBeenCalledOnce()
    })

    it('should handle removing non-existent listener gracefully', () => {
      const listener = vi.fn()

      expect(() => {
        emitter.off('simpleEvent', listener)
      }).not.toThrow()
    })

    it('should handle removing from non-existent event gracefully', () => {
      const listener = vi.fn()

      expect(() => {
        emitter.off('eventWithString', listener)
      }).not.toThrow()
    })

    it('should only remove the specified listener instance', () => {
      const sharedFunction = vi.fn()

      emitter.on('simpleEvent', sharedFunction)
      emitter.on('simpleEvent', sharedFunction)

      emitter.off('simpleEvent', sharedFunction)
      emitter.emit('simpleEvent')

      // Should still have one instance of the listener
      expect(sharedFunction).toHaveBeenCalledOnce()
    })
  })

  describe('One-time Listeners', () => {
    it('should call once() listener only once', () => {
      const listener = vi.fn()

      emitter.once('simpleEvent', listener)

      emitter.emit('simpleEvent')
      emitter.emit('simpleEvent')
      emitter.emit('simpleEvent')

      expect(listener).toHaveBeenCalledOnce()
    })

    it('should pass arguments correctly to once() listeners', () => {
      const listener = vi.fn()

      emitter.once('eventWithString', listener)
      emitter.emit('eventWithString', 'test message')

      expect(listener).toHaveBeenCalledWith('test message')
    })

    it('should work with multiple once() listeners', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      emitter.once('simpleEvent', listener1)
      emitter.once('simpleEvent', listener2)

      emitter.emit('simpleEvent')

      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).toHaveBeenCalledOnce()

      emitter.emit('simpleEvent')

      // Should not be called again
      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).toHaveBeenCalledOnce()
    })

    it('should mix regular and once() listeners correctly', () => {
      const regularListener = vi.fn()
      const onceListener = vi.fn()

      emitter.on('simpleEvent', regularListener)
      emitter.once('simpleEvent', onceListener)

      emitter.emit('simpleEvent')
      emitter.emit('simpleEvent')

      expect(regularListener).toHaveBeenCalledTimes(2)
      expect(onceListener).toHaveBeenCalledOnce()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle emitting events with no listeners', () => {
      expect(() => {
        emitter.emit('simpleEvent')
      }).not.toThrow()
    })

    it('should handle listeners that throw errors', () => {
      const goodListener = vi.fn()
      const errorListener = vi.fn(() => {
        throw new Error('Listener error')
      })
      const anotherGoodListener = vi.fn()

      emitter.on('simpleEvent', goodListener)
      emitter.on('simpleEvent', errorListener)
      emitter.on('simpleEvent', anotherGoodListener)

      expect(() => {
        emitter.emit('simpleEvent')
      }).toThrow('Listener error')

      // The first listener should have been called
      expect(goodListener).toHaveBeenCalledOnce()
      // The error listener should have been called
      expect(errorListener).toHaveBeenCalledOnce()
      // The third listener might not be called due to the error
    })

    it('should handle rapid event emissions', () => {
      const listener = vi.fn()

      emitter.on('eventWithString', listener)

      for (let i = 0; i < 100; i++) {
        emitter.emit('eventWithString', `message-${i}`)
      }

      expect(listener).toHaveBeenCalledTimes(100)
    })

    it('should handle many listeners for same event', () => {
      const listeners = Array.from({ length: 50 }, () => vi.fn())

      listeners.forEach(listener => {
        emitter.on('simpleEvent', listener)
      })

      emitter.emit('simpleEvent')

      listeners.forEach(listener => {
        expect(listener).toHaveBeenCalledOnce()
      })
    })
  })

  describe('Memory Management', () => {
    it('should not retain references to removed listeners', () => {
      const listener = vi.fn()

      emitter.on('simpleEvent', listener)
      emitter.off('simpleEvent', listener)

      // The listener should be removed from internal storage
      emitter.emit('simpleEvent')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should clean up once() listeners after execution', () => {
      const listener = vi.fn()

      emitter.once('simpleEvent', listener)
      emitter.emit('simpleEvent')

      // Internal cleanup should prevent memory leaks
      emitter.emit('simpleEvent')
      expect(listener).toHaveBeenCalledOnce()
    })
  })

  describe('Type Safety', () => {
    it('should enforce correct event names at compile time', () => {
      // These should compile without errors
      emitter.on('simpleEvent', () => {})
      emitter.on('eventWithString', (_msg: string) => {})
      emitter.on('eventWithMultipleArgs', (_id: number, _name: string, _active: boolean) => {})

      // This test primarily validates TypeScript compilation
      expect(true).toBe(true)
    })

    it('should enforce correct listener signatures at compile time', () => {
      // These should compile without errors
      emitter.on('eventWithString', (message: string) => {
        expect(typeof message).toBe('string')
      })

      emitter.on('eventWithObject', (data: { id: number; name: string }) => {
        expect(typeof data.id).toBe('number')
        expect(typeof data.name).toBe('string')
      })

      expect(true).toBe(true)
    })
  })

  describe('Real-world Usage Scenarios', () => {
    it('should handle user authentication flow', () => {
      const loginHandler = vi.fn()
      const logoutHandler = vi.fn()
      const updateHandler = vi.fn()

      userEmitter.on('login', loginHandler)
      userEmitter.on('logout', logoutHandler)
      userEmitter.on('update', updateHandler)

      // Simulate user login
      const user = { id: 123, email: 'user@example.com' }
      userEmitter.emit('login', user)

      // Simulate profile update
      userEmitter.emit('update', 'email', 'newemail@example.com')

      // Simulate logout
      userEmitter.emit('logout')

      expect(loginHandler).toHaveBeenCalledWith(user)
      expect(updateHandler).toHaveBeenCalledWith('email', 'newemail@example.com')
      expect(logoutHandler).toHaveBeenCalledOnce()
    })

    it('should handle component lifecycle events', () => {
      interface ComponentEvents {
        mount: (element: HTMLElement) => void
        unmount: () => void
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        update: (props: Record<string, any>) => void
      }

      const componentEmitter = new EventEmitter<ComponentEvents>()
      const mountHandler = vi.fn()
      const unmountHandler = vi.fn()
      const updateHandler = vi.fn()

      componentEmitter.on('mount', mountHandler)
      componentEmitter.on('unmount', unmountHandler)
      componentEmitter.on('update', updateHandler)

      const element = document.createElement('div')
      const props = { title: 'Test Component', visible: true }

      componentEmitter.emit('mount', element)
      componentEmitter.emit('update', props)
      componentEmitter.emit('unmount')

      expect(mountHandler).toHaveBeenCalledWith(element)
      expect(updateHandler).toHaveBeenCalledWith(props)
      expect(unmountHandler).toHaveBeenCalledOnce()
    })
  })
})
