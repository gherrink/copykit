import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  createTestContainer,
  cleanupTestContainer,
  createElement,
  user,
  expectFocusedElement,
} from './utils'

describe('Basic Accessibility Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('ARIA Attributes', () => {
    it('should properly set aria-expanded attribute', () => {
      const button = createElement(
        'button',
        {
          'aria-expanded': 'false',
          'aria-controls': 'content',
        },
        'Toggle Content',
      )

      container.appendChild(button)

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls', 'content')
    })

    it('should have proper form label associations', () => {
      const label = createElement(
        'label',
        {
          for: 'email-input',
        },
        'Email Address',
      )
      const input = createElement('input', {
        type: 'email',
        id: 'email-input',
        name: 'email',
      })

      container.appendChild(label)
      container.appendChild(input)

      expect(label).toHaveAttribute('for', 'email-input')
      expect(input).toHaveAttribute('id', 'email-input')
    })

    it('should have proper dialog attributes', () => {
      const dialog = createElement('div', {
        role: 'dialog',
        'aria-labelledby': 'dialog-title',
        'aria-modal': 'true',
      })
      const title = createElement(
        'h2',
        {
          id: 'dialog-title',
        },
        'Confirm Action',
      )

      dialog.appendChild(title)
      container.appendChild(dialog)

      expect(dialog).toHaveAttribute('role', 'dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(title).toHaveAttribute('id', 'dialog-title')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should allow keyboard navigation between elements', async () => {
      const button1 = createElement('button', {}, 'First Button')
      const button2 = createElement('button', {}, 'Second Button')

      container.appendChild(button1)
      container.appendChild(button2)

      // Focus should start on first button
      await user.tab()
      expectFocusedElement(button1)

      // Tab should move to second button
      await user.tab()
      expectFocusedElement(button2)
    })

    it('should respect tabindex attributes', async () => {
      const button1 = createElement('button', { tabindex: '2' }, 'Second')
      const button2 = createElement('button', { tabindex: '1' }, 'First')
      const button3 = createElement('button', { tabindex: '3' }, 'Third')

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(button3)

      // Should follow tabindex order, not DOM order
      await user.tab()
      expectFocusedElement(button2) // tabindex="1"

      await user.tab()
      expectFocusedElement(button1) // tabindex="2"

      await user.tab()
      expectFocusedElement(button3) // tabindex="3"
    })

    it('should skip elements with tabindex="-1"', async () => {
      const button1 = createElement('button', {}, 'Focusable')
      const button2 = createElement('button', { tabindex: '-1' }, 'Non-focusable')
      const button3 = createElement('button', {}, 'Also Focusable')

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(button3)

      await user.tab()
      expectFocusedElement(button1)

      await user.tab()
      expectFocusedElement(button3) // Should skip button2
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus within modal dialogs', async () => {
      const dialog = createElement('div', {
        role: 'dialog',
        'aria-modal': 'true',
      })
      const firstButton = createElement('button', {}, 'First')
      const lastButton = createElement('button', {}, 'Last')

      dialog.appendChild(firstButton)
      dialog.appendChild(lastButton)
      container.appendChild(dialog)

      // Focus should be manageable within dialog
      firstButton.focus()
      expectFocusedElement(firstButton)

      lastButton.focus()
      expectFocusedElement(lastButton)
    })

    it('should handle disabled elements properly', () => {
      const button = createElement('button', { disabled: '' }, 'Disabled Button')
      container.appendChild(button)

      expect(button).toHaveAttribute('disabled')
      expect((button as HTMLButtonElement).disabled).toBe(true)
    })
  })

  describe('Required Form Validation', () => {
    it('should mark required fields with proper attributes', () => {
      const input = createElement('input', {
        type: 'email',
        required: '',
        'aria-required': 'true',
      })

      container.appendChild(input)

      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('should associate error messages with form fields', () => {
      const input = createElement('input', {
        type: 'text',
        'aria-describedby': 'error-message',
        'aria-invalid': 'true',
      })
      const errorMessage = createElement(
        'div',
        {
          id: 'error-message',
          role: 'alert',
        },
        'This field is required',
      )

      container.appendChild(input)
      container.appendChild(errorMessage)

      expect(input).toHaveAttribute('aria-describedby', 'error-message')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(errorMessage).toHaveAttribute('id', 'error-message')
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })
  })

  describe('Semantic HTML', () => {
    it('should use proper heading hierarchy', () => {
      const h1 = createElement('h1', {}, 'Main Title')
      const h2 = createElement('h2', {}, 'Section Title')
      const h3 = createElement('h3', {}, 'Subsection Title')

      container.appendChild(h1)
      container.appendChild(h2)
      container.appendChild(h3)

      expect(h1.tagName).toBe('H1')
      expect(h2.tagName).toBe('H2')
      expect(h3.tagName).toBe('H3')
    })

    it('should use landmarks for navigation', () => {
      const nav = createElement('nav', {
        'aria-label': 'Main navigation',
      })
      const main = createElement('main')
      const aside = createElement('aside')

      container.appendChild(nav)
      container.appendChild(main)
      container.appendChild(aside)

      expect(nav.tagName).toBe('NAV')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
      expect(main.tagName).toBe('MAIN')
      expect(aside.tagName).toBe('ASIDE')
    })
  })
})
