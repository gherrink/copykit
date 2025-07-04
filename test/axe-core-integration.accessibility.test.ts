import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { axe } from 'vitest-axe'
import { createTestContainer, cleanupTestContainer, createElement, user } from './utils'

// Helper function for accessibility testing
async function expectAccessible(element: HTMLElement): Promise<void> {
  const results = await axe(element)
  expect(results).toHaveNoViolations()
}

describe('Accessibility Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('Button Accessibility', () => {
    it('should have proper ARIA attributes for expandable buttons', async () => {
      const button = createElement(
        'button',
        {
          'aria-expanded': 'false',
          'aria-controls': 'content',
          id: 'toggle-button',
        },
        'Toggle Content',
      )

      const content = createElement(
        'div',
        {
          id: 'content',
          'aria-labelledby': 'toggle-button',
        },
        'Expandable content',
      )

      container.appendChild(button)
      container.appendChild(content)

      await expectAccessible(container)
    })

    it('should have no accessibility violations for basic button', async () => {
      const button = createElement(
        'button',
        {
          type: 'button',
          'aria-label': 'Close dialog',
        },
        'Close',
      )

      container.appendChild(button)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper labels for form inputs', async () => {
      const form = createElement('form')
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
        required: '',
      })

      form.appendChild(label)
      form.appendChild(input)
      container.appendChild(form)

      await expectAccessible(container)
    })

    it('should have proper error messages', async () => {
      const form = createElement('form')
      const label = createElement(
        'label',
        {
          for: 'username',
        },
        'Username',
      )
      const input = createElement('input', {
        type: 'text',
        id: 'username',
        name: 'username',
        'aria-describedby': 'username-error',
        'aria-invalid': 'true',
      })
      const error = createElement(
        'div',
        {
          id: 'username-error',
          role: 'alert',
        },
        'Username is required',
      )

      form.appendChild(label)
      form.appendChild(input)
      form.appendChild(error)
      container.appendChild(form)

      await expectAccessible(container)
    })
  })

  describe('Navigation Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const nav = createElement('nav', {
        'aria-label': 'Main navigation',
      })
      const heading = createElement('h1', {}, 'Main Page')
      const subheading = createElement('h2', {}, 'Section')

      nav.appendChild(heading)
      nav.appendChild(subheading)
      container.appendChild(nav)

      await expectAccessible(container)
    })

    it('should have keyboard navigation support', async () => {
      const nav = createElement('nav')
      const list = createElement('ul', {
        role: 'menubar',
      })
      const item1 = createElement('li', {
        role: 'menuitem',
      })
      const link1 = createElement(
        'a',
        {
          href: '#',
          tabindex: '0',
        },
        'Home',
      )

      item1.appendChild(link1)
      list.appendChild(item1)
      nav.appendChild(list)
      container.appendChild(nav)

      // Test keyboard navigation
      await user.tab()
      expect(document.activeElement).toBe(link1)

      await expectAccessible(container)
    })
  })

  describe('Dialog Accessibility', () => {
    it('should have proper dialog attributes', async () => {
      const dialog = createElement('div', {
        role: 'dialog',
        'aria-labelledby': 'dialog-title',
        'aria-describedby': 'dialog-description',
        'aria-modal': 'true',
      })
      const title = createElement(
        'h2',
        {
          id: 'dialog-title',
        },
        'Confirm Action',
      )
      const description = createElement(
        'p',
        {
          id: 'dialog-description',
        },
        'Are you sure you want to proceed?',
      )
      const closeButton = createElement(
        'button',
        {
          type: 'button',
          'aria-label': 'Close dialog',
        },
        'Close',
      )

      dialog.appendChild(title)
      dialog.appendChild(description)
      dialog.appendChild(closeButton)
      container.appendChild(dialog)

      await expectAccessible(container)
    })
  })

  describe('Color Contrast', () => {
    it('should not violate color contrast rules', async () => {
      const div = createElement(
        'div',
        {
          style: 'background-color: #ffffff; color: #000000; padding: 10px;',
        },
        'High contrast text',
      )

      container.appendChild(div)

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Focus Management', () => {
    it('should have visible focus indicators', async () => {
      const button = createElement(
        'button',
        {
          style: 'outline: 2px solid blue; outline-offset: 2px;',
        },
        'Focusable Button',
      )

      container.appendChild(button)

      await user.tab()
      expect(document.activeElement).toBe(button)

      await expectAccessible(container)
    })

    it('should maintain proper tab order', async () => {
      const button1 = createElement(
        'button',
        {
          tabindex: '0',
        },
        'First',
      )
      const button2 = createElement(
        'button',
        {
          tabindex: '0',
        },
        'Second',
      )
      const button3 = createElement(
        'button',
        {
          tabindex: '0',
        },
        'Third',
      )

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(button3)

      // Test tab order
      await user.tab()
      expect(document.activeElement).toBe(button1)

      await user.tab()
      expect(document.activeElement).toBe(button2)

      await user.tab()
      expect(document.activeElement).toBe(button3)

      await expectAccessible(container)
    })
  })
})
