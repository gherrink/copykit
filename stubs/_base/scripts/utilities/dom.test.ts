import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ready, animate } from './dom'
import { createElement, createTestContainer, cleanupTestContainer } from '@test/utils.ts'

describe('DOM Utilities', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('ready function', () => {
    it('should call callback immediately when DOM is already ready', () => {
      const callback = vi.fn()

      // Mock document.readyState to be 'complete'
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
      })

      ready(callback)

      expect(callback).toHaveBeenCalledOnce()
    })

    it('should add event listener when DOM is still loading', () => {
      const callback = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      // Mock document.readyState to be 'loading'
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
        writable: true,
      })

      ready(callback)

      expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', callback)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should call callback with document context', () => {
      const callback = vi.fn()

      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
      })

      ready(callback)

      expect(callback).toHaveBeenCalledWith()
      expect(callback.mock.instances[0]).toBe(document)
    })
  })

  describe('animate function', () => {
    let element: HTMLElement
    let mockCallback: ReturnType<typeof vi.fn>

    beforeEach(() => {
      element = createElement('div', { id: 'test-element' })
      container.appendChild(element)
      mockCallback = vi.fn()

      // Mock getComputedStyle
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        transition: 'opacity 0.3s ease',
        animationName: 'none',
      } as CSSStyleDeclaration)
    })

    it('should add entering animation classes', () => {
      animate(element, 'fade', true, mockCallback)

      expect(element.classList.contains('fade-enter-active')).toBe(true)
      expect(element.classList.contains('fade-enter-from')).toBe(true)
    })

    it('should add leaving animation classes', () => {
      animate(element, 'slide', false, mockCallback)

      expect(element.classList.contains('slide-leave-active')).toBe(true)
      expect(element.classList.contains('slide-leave-from')).toBe(true)
    })

    it('should remove from class and add to class after first frame', async () => {
      animate(element, 'fade', true, mockCallback)

      // Wait for next frame
      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(element.classList.contains('fade-enter-from')).toBe(false)
      expect(element.classList.contains('fade-enter-to')).toBe(true)
    })

    it('should call callback immediately when no animation is detected', async () => {
      // Mock getComputedStyle to return no animation
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        transition: 'none',
        animationName: 'none',
      } as CSSStyleDeclaration)

      animate(element, 'instant', true, mockCallback)

      // Wait for animation frames
      await new Promise(resolve => requestAnimationFrame(resolve))
      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(mockCallback).toHaveBeenCalledOnce()
    })

    it('should clean up classes after animation ends', () => {
      animate(element, 'fade', true, mockCallback)

      // Simulate animation end
      const event = new Event('animationend')
      element.dispatchEvent(event)

      expect(element.classList.contains('fade-enter-active')).toBe(false)
      expect(element.classList.contains('fade-enter-to')).toBe(false)
      expect(mockCallback).toHaveBeenCalledOnce()
    })

    it('should clean up classes after transition ends', () => {
      animate(element, 'fade', true, mockCallback)

      // Simulate transition end
      const event = new Event('transitionend')
      element.dispatchEvent(event)

      expect(element.classList.contains('fade-enter-active')).toBe(false)
      expect(element.classList.contains('fade-enter-to')).toBe(false)
      expect(mockCallback).toHaveBeenCalledOnce()
    })

    it('should handle animation cancellation', () => {
      animate(element, 'fade', true, mockCallback)

      // Simulate animation cancel
      const event = new Event('animationcancel')
      element.dispatchEvent(event)

      expect(element.classList.contains('fade-enter-active')).toBe(false)
      expect(element.classList.contains('fade-enter-to')).toBe(false)
      expect(mockCallback).toHaveBeenCalledOnce()
    })

    it('should handle transition cancellation', () => {
      animate(element, 'fade', true, mockCallback)

      // Simulate transition cancel
      const event = new Event('transitioncancel')
      element.dispatchEvent(event)

      expect(element.classList.contains('fade-enter-active')).toBe(false)
      expect(element.classList.contains('fade-enter-to')).toBe(false)
      expect(mockCallback).toHaveBeenCalledOnce()
    })

    it('should work without callback', () => {
      expect(() => {
        animate(element, 'fade', true)
      }).not.toThrow()

      // Simulate animation end
      const event = new Event('animationend')
      element.dispatchEvent(event)

      expect(element.classList.contains('fade-enter-active')).toBe(false)
    })
  })
})
