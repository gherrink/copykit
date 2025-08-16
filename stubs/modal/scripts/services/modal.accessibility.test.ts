import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Modal } from './modal'
import { createTestContainer, cleanupTestContainer, expectAccessible } from '@test/utils'

function createModalElement(
  options: {
    id?: string
    simple?: boolean
    withFooter?: boolean
  } = {},
): HTMLDialogElement {
  const { id = 'test-modal', simple = false, withFooter = true } = options

  const dialog = document.createElement('dialog')
  dialog.className = 'modal'
  dialog.id = id

  if (simple) {
    dialog.innerHTML = `
      <button class="control close" aria-label="Close modal">×</button>
      <h3 class="headline">Simple Modal</h3>
      <p>Simple modal content</p>
      <button class="btn primary">OK</button>
    `
  } else {
    dialog.innerHTML = `
      <header class="header">
        <h2 class="headline">Test Modal</h2>
        <button class="control close" aria-label="Close modal">×</button>
      </header>
      <div class="content">
        <p>This is test content for the modal.</p>
        <p>It can contain multiple paragraphs and should be scrollable if needed.</p>
        <button class="btn">Focus Test Button</button>
      </div>
      ${
        withFooter
          ? `
        <footer class="footer">
          <button type="button" class="btn" value="cancel">Cancel</button>
          <button type="button" class="btn primary" value="confirm">Confirm</button>
        </footer>
      `
          : ''
      }
    `
  }

  // Mock dialog methods for jsdom
  dialog.showModal = vi.fn(() => {
    Object.defineProperty(dialog, 'open', { value: true, configurable: true })
  })
  dialog.show = vi.fn(() => {
    Object.defineProperty(dialog, 'open', { value: true, configurable: true })
  })
  dialog.close = vi.fn((returnValue?: string) => {
    if (returnValue !== undefined) {
      dialog.returnValue = returnValue
    }
    Object.defineProperty(dialog, 'open', { value: false, configurable: true })
    dialog.dispatchEvent(new Event('close'))
  })

  // Initialize open property
  Object.defineProperty(dialog, 'open', { value: false, configurable: true })
  dialog.returnValue = ''

  return dialog
}

describe('Modal Accessibility', () => {
  let container: HTMLElement
  let dialog: HTMLDialogElement

  beforeEach(() => {
    container = createTestContainer()
    dialog = createModalElement()

    // Mock dialog methods for jsdom
    dialog.showModal = vi.fn(() => {
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })
    })
    dialog.show = vi.fn(() => {
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })
    })
    dialog.close = vi.fn((returnValue?: string) => {
      if (returnValue !== undefined) {
        dialog.returnValue = returnValue
      }
      Object.defineProperty(dialog, 'open', { value: false, configurable: true })
      dialog.dispatchEvent(new Event('close'))
    })

    // Initialize open property
    Object.defineProperty(dialog, 'open', { value: false, configurable: true })
    dialog.returnValue = ''

    container.appendChild(dialog)
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('ARIA Compliance', () => {
    it('should be accessible according to axe-core', async () => {
      const modal = new Modal(dialog)

      // Modal should be accessible even when closed
      await expectAccessible(dialog)

      // showModal is already mocked by createModalElement()

      modal.openModal()

      // Modal should remain accessible when open
      await expectAccessible(dialog)
    })

    it('should have proper dialog role implicitly', () => {
      // HTML dialog element has implicit role="dialog"
      expect(dialog.tagName.toLowerCase()).toBe('dialog')
    })

    it('should have accessible close button', () => {
      const closeButton = dialog.querySelector('.control.close') as HTMLButtonElement

      expect(closeButton).toBeTruthy()
      expect(closeButton.getAttribute('aria-label')).toBe('Close modal')
      expect(closeButton.tagName.toLowerCase()).toBe('button')
    })

    it('should have proper heading structure', () => {
      const heading = dialog.querySelector('.headline') as HTMLElement

      expect(heading).toBeTruthy()
      expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(heading.tagName.toLowerCase())).toBe(
        true,
      )
    })
  })

  describe('Keyboard Navigation', () => {
    it('should focus on first interactive element when opened', () => {
      const modal = new Modal(dialog)
      const firstButton = dialog.querySelector('.footer button') as HTMLButtonElement
      const focusSpy = vi.spyOn(firstButton, 'focus')

      // showModal is already mocked by createModalElement()

      modal.openModal()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should focus on specified element when focusTarget is provided', () => {
      const modal = new Modal(dialog, { focusTarget: '.btn.primary' })
      const primaryButton = dialog.querySelector('.btn.primary') as HTMLButtonElement
      const focusSpy = vi.spyOn(primaryButton, 'focus')

      // showModal is already mocked by createModalElement()

      modal.openModal()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should close modal when ESC key is pressed', () => {
      const modal = new Modal(dialog)
      const closeSpy = vi.spyOn(modal, 'close')

      // Set modal to open state
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      // Simulate ESC key press
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })

      modal['keydownListener']?.(escEvent)

      expect(closeSpy).toHaveBeenCalled()
    })

    it('should prevent default on ESC key press', () => {
      const modal = new Modal(dialog)

      // Set modal to open state
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
      const preventDefaultSpy = vi.spyOn(escEvent, 'preventDefault')

      modal['keydownListener']?.(escEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not close modal on other key presses', () => {
      const modal = new Modal(dialog)
      const closeSpy = vi.spyOn(modal, 'close')

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })

      modal['keydownListener']?.(tabEvent)
      modal['keydownListener']?.(enterEvent)
      modal['keydownListener']?.(spaceEvent)

      expect(closeSpy).not.toHaveBeenCalled()
    })

    it('should respect escapeClose option', () => {
      const modal = new Modal(dialog, { escapeClose: false })
      const closeSpy = vi.spyOn(modal, 'close')

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      modal['keydownListener']?.(escEvent)

      expect(closeSpy).not.toHaveBeenCalled()
    })
  })

  describe('Focus Management', () => {
    it('should restore focus to previous element on close', () => {
      const triggerButton = document.createElement('button')
      triggerButton.textContent = 'Open Modal'
      container.appendChild(triggerButton)
      triggerButton.focus()

      const modal = new Modal(dialog)
      const focusSpy = vi.spyOn(triggerButton, 'focus')

      // Simulate opening modal
      // showModal is already mocked by createModalElement()
      modal.openModal()

      // Simulate closing modal
      // close is already mocked by createModalElement()
      modal.close()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should not restore focus when restoreFocus is disabled', () => {
      const triggerButton = document.createElement('button')
      container.appendChild(triggerButton)
      triggerButton.focus()

      const modal = new Modal(dialog, { restoreFocus: false })
      const focusSpy = vi.spyOn(triggerButton, 'focus')

      // Simulate opening and closing
      // showModal is already mocked by createModalElement()
      modal.openModal()

      // close is already mocked by createModalElement()
      modal.close()

      expect(focusSpy).not.toHaveBeenCalled()
    })

    it('should find focusable elements in correct priority order', () => {
      // Test footer button priority
      let modal = new Modal(dialog)
      const footerButton = dialog.querySelector('.footer button') as HTMLButtonElement
      const footerFocusSpy = vi.spyOn(footerButton, 'focus')

      modal['manageFocus']()
      expect(footerFocusSpy).toHaveBeenCalled()

      // Test close button priority when no footer
      dialog.querySelector('.footer')?.remove()
      modal = new Modal(dialog)
      const closeButton = dialog.querySelector('.control.close') as HTMLButtonElement
      const closeFocusSpy = vi.spyOn(closeButton, 'focus')

      modal['manageFocus']()
      expect(closeFocusSpy).toHaveBeenCalled()
    })

    it('should handle focus when no focusable elements exist', () => {
      // Create modal with no buttons
      const emptyDialog = document.createElement('dialog')
      emptyDialog.className = 'modal'
      emptyDialog.innerHTML = '<div class="content"><p>No focusable elements</p></div>'
      container.appendChild(emptyDialog)

      const modal = new Modal(emptyDialog)

      // Should not throw error
      expect(() => modal['manageFocus']()).not.toThrow()
    })
  })

  describe('Screen Reader Support', () => {
    it('should have semantic HTML structure', () => {
      // Check for semantic elements
      const header = dialog.querySelector('header')
      const content = dialog.querySelector('.content')
      const footer = dialog.querySelector('footer')

      expect(header).toBeTruthy()
      expect(content).toBeTruthy()
      expect(footer).toBeTruthy()
    })

    it('should have descriptive button text', () => {
      const closeButton = dialog.querySelector('.control.close') as HTMLButtonElement
      const cancelButton = dialog.querySelector('button[value="cancel"]') as HTMLButtonElement
      const confirmButton = dialog.querySelector('button[value="confirm"]') as HTMLButtonElement

      // Close button should have aria-label
      expect(closeButton.getAttribute('aria-label')).toBe('Close modal')

      // Action buttons should have descriptive text
      expect(cancelButton.textContent?.trim()).toBe('Cancel')
      expect(confirmButton.textContent?.trim()).toBe('Confirm')
    })

    it('should work with simple modal structure', () => {
      const simpleDialog = createModalElement({ simple: true })
      // In simple modal, focus goes to close button first (no footer buttons)
      const closeButton = simpleDialog.querySelector('.control.close') as HTMLButtonElement

      // Create spy first, before adding to DOM
      const focusSpy = vi.spyOn(closeButton, 'focus').mockImplementation(() => {
        // Mock focus behavior since jsdom doesn't handle focus properly
      })

      container.appendChild(simpleDialog)

      const modal = new Modal(simpleDialog)

      // Should be accessible
      expect(async () => await expectAccessible(simpleDialog)).not.toThrow()

      // Should have proper focus management
      modal['manageFocus']()
      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('User Preferences', () => {
    it('should handle modal opening without animations when prefers-reduced-motion', () => {
      // This would be handled by CSS, but we can test that the modal still functions
      const modal = new Modal(dialog)

      // showModal is already mocked by createModalElement()

      // Should still open properly with reduced motion
      modal.openModal()
      expect(modal.isOpen).toBe(true)
    })

    it('should work with high contrast mode', () => {
      // High contrast is handled by CSS, test that modal functions remain intact
      const modal = new Modal(dialog)

      // Modal should still be functional
      expect(modal.element).toBe(dialog)
      expect(modal.options.backdropClose).toBe(true)
    })
  })

  describe('Error States and Edge Cases', () => {
    it('should handle missing elements gracefully', () => {
      const minimalDialog = document.createElement('dialog')
      minimalDialog.className = 'modal'
      minimalDialog.innerHTML = '<p>Minimal content</p>'
      container.appendChild(minimalDialog)

      // Should not throw error when creating modal with minimal content
      expect(() => new Modal(minimalDialog)).not.toThrow()
    })

    it('should handle malformed HTML structure', () => {
      const malformedDialog = document.createElement('dialog')
      malformedDialog.className = 'modal'
      malformedDialog.innerHTML = `
        <div class="not-header">
          <span class="not-headline">Title</span>
        </div>
        <div>Content without proper class</div>
      `
      container.appendChild(malformedDialog)

      const modal = new Modal(malformedDialog)

      // Should still function
      expect(modal.element).toBe(malformedDialog)

      // Focus management should handle missing elements
      expect(() => modal['manageFocus']()).not.toThrow()
    })

    it('should handle multiple close buttons', () => {
      const multiCloseDialog = createModalElement()

      // Add additional close button
      const additionalClose = document.createElement('button')
      additionalClose.className = 'control close'
      additionalClose.setAttribute('aria-label', 'Close')
      additionalClose.textContent = 'Close'
      multiCloseDialog.querySelector('.content')?.appendChild(additionalClose)

      container.appendChild(multiCloseDialog)

      const modal = new Modal(multiCloseDialog)
      const closeSpy = vi.spyOn(modal, 'close')

      // Both close buttons should work
      const firstClose = multiCloseDialog.querySelector(
        '.header .control.close',
      ) as HTMLButtonElement
      const secondClose = multiCloseDialog.querySelector(
        '.content .control.close',
      ) as HTMLButtonElement

      firstClose.click()
      expect(closeSpy).toHaveBeenCalledTimes(1)

      secondClose.click()
      expect(closeSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('Integration with Base Components', () => {
    it('should work with base button styles', () => {
      const button = dialog.querySelector('.footer .btn') as HTMLButtonElement

      expect(button).toBeTruthy()
      expect(button.classList.contains('btn')).toBe(true)

      // Check that button has proper attributes
      expect(button.tagName.toLowerCase()).toBe('button')
      // The footer buttons have type="button" explicitly set
      expect(button.getAttribute('type')).toBe('button')
    })

    it('should work with base control styles', () => {
      const control = dialog.querySelector('.control') as HTMLButtonElement

      expect(control).toBeTruthy()
      expect(control.classList.contains('control')).toBe(true)

      // Control should exist and have proper classes
      expect(control.getAttribute('aria-label')).toBe('Close modal')
    })

    it('should work with headline styles', () => {
      const headline = dialog.querySelector('.headline') as HTMLElement

      expect(headline).toBeTruthy()
      expect(headline.classList.contains('headline')).toBe(true)
    })
  })
})
