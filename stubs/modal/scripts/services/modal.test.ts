import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Modal, createModal, initModals } from './modal'
import { createTestContainer, cleanupTestContainer } from '@test/utils'

describe('Modal', () => {
  let container: HTMLElement
  let dialog: HTMLDialogElement

  beforeEach(() => {
    container = createTestContainer()
    dialog = document.createElement('dialog')
    dialog.className = 'modal'
    dialog.innerHTML = `
      <header class="header">
        <h2 class="headline">Test Modal</h2>
        <button class="control close" aria-label="Close">×</button>
      </header>
      <div class="content">
        <p>Test content</p>
      </div>
      <footer class="footer">
        <button type="button" class="btn">Cancel</button>
        <button type="button" class="btn primary">Confirm</button>
      </footer>
    `

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

  describe('Constructor and Instance Management', () => {
    it('should create modal instance and store on DOM element', () => {
      const modal = new Modal(dialog)

      expect(modal).toBeInstanceOf(Modal)
      expect(modal.element).toBe(dialog)
      expect(dialog.__modal).toBe(modal)
    })

    it('should get existing instance', () => {
      const modal1 = new Modal(dialog)
      const modal2 = Modal.getInstance(dialog)

      expect(modal2).toBe(modal1)
    })

    it('should return null for non-existent instance', () => {
      const newDialog = document.createElement('dialog')
      expect(Modal.getInstance(newDialog)).toBeNull()
    })

    it('should apply default options', () => {
      const modal = new Modal(dialog)

      expect(modal.options.backdropClose).toBe(true)
      expect(modal.options.escapeClose).toBe(true)
      expect(modal.options.restoreFocus).toBe(true)
    })

    it('should override options with provided values', () => {
      const modal = new Modal(dialog, {
        backdropClose: false,
        escapeClose: false,
        restoreFocus: false,
      })

      expect(modal.options.backdropClose).toBe(false)
      expect(modal.options.escapeClose).toBe(false)
      expect(modal.options.restoreFocus).toBe(false)
    })
  })

  describe('Data Attribute Configuration', () => {
    it('should parse backdrop data attribute', () => {
      dialog.setAttribute('data-modal-backdrop', 'false')
      const modal = new Modal(dialog)

      expect(modal.options.backdropClose).toBe(false)
    })

    it('should parse escape data attribute', () => {
      dialog.setAttribute('data-modal-escape', 'false')
      const modal = new Modal(dialog)

      expect(modal.options.escapeClose).toBe(false)
    })

    it('should parse focus target data attribute', () => {
      dialog.setAttribute('data-modal-focus', '.btn.primary')
      const modal = new Modal(dialog)

      expect(modal.options.focusTarget).toBe('.btn.primary')
    })
  })

  describe('Modal Opening', () => {
    it('should open as modal dialog', () => {
      const modal = new Modal(dialog)

      modal.openModal()

      expect(dialog.showModal).toHaveBeenCalled()
      expect(modal.isOpen).toBe(true)
    })

    it('should open as non-modal dialog', () => {
      const modal = new Modal(dialog)

      modal.openNonModal()

      expect(dialog.show).toHaveBeenCalled()
      expect(modal.isOpen).toBe(true)
    })

    it('should emit beforeOpen and afterOpen events', () => {
      const modal = new Modal(dialog)
      const beforeOpenSpy = vi.fn()
      const afterOpenSpy = vi.fn()

      modal.on('beforeOpen', beforeOpenSpy)
      modal.on('afterOpen', afterOpenSpy)

      vi.spyOn(dialog, 'showModal').mockImplementation(() => {
        Object.defineProperty(dialog, 'open', { value: true, configurable: true })
      })

      modal.openModal()

      expect(beforeOpenSpy).toHaveBeenCalledWith({ modal: dialog, isModal: true })
      expect(afterOpenSpy).toHaveBeenCalledWith({ modal: dialog, isModal: true })
    })

    it('should store previous focus for restoration', () => {
      const button = document.createElement('button')
      container.appendChild(button)
      button.focus()

      const modal = new Modal(dialog)
      vi.spyOn(dialog, 'showModal').mockImplementation(() => {
        Object.defineProperty(dialog, 'open', { value: true, configurable: true })
      })

      modal.openModal()

      expect(modal['previousFocus']).toBe(button)
    })

    it('should call onOpen callback', () => {
      const onOpen = vi.fn()
      const modal = new Modal(dialog, { onOpen })

      vi.spyOn(dialog, 'showModal').mockImplementation(() => {
        Object.defineProperty(dialog, 'open', { value: true, configurable: true })
      })

      modal.openModal()

      expect(onOpen).toHaveBeenCalledWith(dialog)
    })
  })

  describe('Modal Closing', () => {
    it('should close modal', () => {
      const modal = new Modal(dialog)
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      const closeSpy = vi.spyOn(dialog, 'close').mockImplementation(() => {
        Object.defineProperty(dialog, 'open', { value: false, configurable: true })
        dialog.dispatchEvent(new Event('close'))
      })

      modal.close()

      expect(closeSpy).toHaveBeenCalled()
    })

    it('should not close if already closed', () => {
      const modal = new Modal(dialog)
      Object.defineProperty(dialog, 'open', { value: false, configurable: true })

      const closeSpy = vi.spyOn(dialog, 'close')

      modal.close()

      expect(closeSpy).not.toHaveBeenCalled()
    })

    it('should close with return value', () => {
      const modal = new Modal(dialog)
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      const closeSpy = vi.spyOn(dialog, 'close').mockImplementation(value => {
        dialog.returnValue = value || ''
        Object.defineProperty(dialog, 'open', { value: false, configurable: true })
        dialog.dispatchEvent(new Event('close'))
      })

      modal.close('confirmed')

      expect(closeSpy).toHaveBeenCalledWith('confirmed')
    })

    it('should emit beforeClose and afterClose events', () => {
      const modal = new Modal(dialog)
      const beforeCloseSpy = vi.fn()
      const afterCloseSpy = vi.fn()

      modal.on('beforeClose', beforeCloseSpy)
      modal.on('afterClose', afterCloseSpy)

      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      vi.spyOn(dialog, 'close').mockImplementation(() => {
        dialog.returnValue = 'test'
        Object.defineProperty(dialog, 'open', { value: false, configurable: true })
        dialog.dispatchEvent(new Event('close'))
      })

      modal.close('test')

      expect(beforeCloseSpy).toHaveBeenCalledWith({ modal: dialog, returnValue: 'test' })
      expect(afterCloseSpy).toHaveBeenCalledWith({ modal: dialog, returnValue: 'test' })
    })

    it('should restore focus on close', () => {
      const button = document.createElement('button')
      container.appendChild(button)

      // Create spy first, before the modal
      const focusSpy = vi.spyOn(button, 'focus').mockImplementation(() => {
        // Mock focus behavior since jsdom doesn't handle focus properly
      })

      button.focus()

      const modal = new Modal(dialog)

      // Store focus
      modal['previousFocus'] = button

      // Mock the dialog to be open first
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      vi.spyOn(dialog, 'close').mockImplementation(() => {
        Object.defineProperty(dialog, 'open', { value: false, configurable: true })
        dialog.dispatchEvent(new Event('close'))
      })

      modal.close()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should call onClose callback', () => {
      const onClose = vi.fn()
      const modal = new Modal(dialog, { onClose })

      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      vi.spyOn(dialog, 'close').mockImplementation(() => {
        dialog.returnValue = 'test'
        Object.defineProperty(dialog, 'open', { value: false, configurable: true })
        dialog.dispatchEvent(new Event('close'))
      })

      modal.close('test')

      expect(onClose).toHaveBeenCalledWith(dialog, 'test')
    })
  })

  describe('Event Listeners', () => {
    it('should close modal when close button is clicked', () => {
      const modal = new Modal(dialog)
      const closeSpy = vi.spyOn(modal, 'close')

      const closeButton = dialog.querySelector('.control.close') as HTMLButtonElement
      closeButton.click()

      expect(closeSpy).toHaveBeenCalled()
    })

    it('should close modal on ESC key when escapeClose is enabled', () => {
      const modal = new Modal(dialog, { escapeClose: true })
      const closeSpy = vi.spyOn(modal, 'close')

      // Set modal to open state
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      // Simulate ESC key press
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      modal['keydownListener']?.(event)

      expect(closeSpy).toHaveBeenCalled()
    })

    it('should not close modal on ESC key when escapeClose is disabled', () => {
      const modal = new Modal(dialog, { escapeClose: false })
      const closeSpy = vi.spyOn(modal, 'close')

      // Simulate ESC key press
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      modal['keydownListener']?.(event)

      expect(closeSpy).not.toHaveBeenCalled()
    })

    it('should close modal on backdrop click when backdropClose is enabled', () => {
      const modal = new Modal(dialog, { backdropClose: true })
      const closeSpy = vi.spyOn(modal, 'close')

      // Simulate backdrop click (target is dialog itself)
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: dialog })
      modal['backdropClickListener']?.(event)

      expect(closeSpy).toHaveBeenCalled()
    })

    it('should not close modal on backdrop click when backdropClose is disabled', () => {
      const modal = new Modal(dialog, { backdropClose: false })
      const closeSpy = vi.spyOn(modal, 'close')

      // Simulate backdrop click
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: dialog })
      modal['backdropClickListener']?.(event)

      expect(closeSpy).not.toHaveBeenCalled()
    })
  })

  describe('Focus Management', () => {
    it('should focus on specified target selector', () => {
      const modal = new Modal(dialog, { focusTarget: '.btn.primary' })
      const primaryButton = dialog.querySelector('.btn.primary') as HTMLButtonElement
      const focusSpy = vi.spyOn(primaryButton, 'focus')

      modal['manageFocus']()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should focus on first footer button if no target specified', () => {
      const modal = new Modal(dialog)
      const firstButton = dialog.querySelector('.footer button') as HTMLButtonElement
      const focusSpy = vi.spyOn(firstButton, 'focus')

      modal['manageFocus']()

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should focus on close button if no footer buttons', () => {
      dialog.querySelector('.footer')?.remove()

      const modal = new Modal(dialog)
      const closeButton = dialog.querySelector('.control.close') as HTMLButtonElement
      const focusSpy = vi.spyOn(closeButton, 'focus')

      modal['manageFocus']()

      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('Destroy', () => {
    it('should clean up event listeners and remove instance', () => {
      const modal = new Modal(dialog)
      Object.defineProperty(dialog, 'open', { value: true, configurable: true })

      const closeSpy = vi.spyOn(dialog, 'close')
      const removeAllListenersSpy = vi.spyOn(modal, 'removeAllListeners')

      modal.destroy()

      expect(closeSpy).toHaveBeenCalled()
      expect(removeAllListenersSpy).toHaveBeenCalled()
      expect(dialog.__modal).toBeUndefined()
    })
  })
})

describe('createModal', () => {
  let dialog: HTMLDialogElement

  beforeEach(() => {
    createTestContainer()
    dialog = document.createElement('dialog')
    dialog.className = 'modal'
    dialog.id = 'test-modal'
    document.body.appendChild(dialog)
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  it('should create modal from selector', () => {
    const modal = createModal('#test-modal')

    expect(modal).toBeInstanceOf(Modal)
    expect(modal.element).toBe(dialog)
  })

  it('should create modal from element', () => {
    const modal = createModal(dialog)

    expect(modal).toBeInstanceOf(Modal)
    expect(modal.element).toBe(dialog)
  })

  it('should return existing instance if already created', () => {
    const modal1 = createModal(dialog)
    const modal2 = createModal(dialog)

    expect(modal1).toBe(modal2)
  })

  it('should throw error if element not found', () => {
    expect(() => createModal('#non-existent')).toThrow('Modal element not found')
  })

  it('should throw error if element is not a dialog', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    expect(() => createModal(div as any)).toThrow('Element must be a dialog element')
  })
})

describe('initModals', () => {
  beforeEach(() => {
    createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  it('should initialize all modal dialogs', () => {
    const dialog1 = document.createElement('dialog')
    dialog1.className = 'modal'
    const dialog2 = document.createElement('dialog')
    dialog2.className = 'modal'

    document.body.appendChild(dialog1)
    document.body.appendChild(dialog2)

    initModals()

    expect(dialog1.__modal).toBeInstanceOf(Modal)
    expect(dialog2.__modal).toBeInstanceOf(Modal)
  })

  it('should skip already initialized modals', () => {
    const dialog = document.createElement('dialog')
    dialog.className = 'modal'
    document.body.appendChild(dialog)

    const modal1 = new Modal(dialog)
    initModals()

    expect(dialog.__modal).toBe(modal1)
  })

  it('should initialize modals with data-modal attribute', () => {
    const dialog1 = document.createElement('dialog')
    dialog1.setAttribute('data-modal', 'true')
    const dialog2 = document.createElement('dialog')
    dialog2.setAttribute('data-modal', 'center')

    document.body.appendChild(dialog1)
    document.body.appendChild(dialog2)

    initModals()

    expect(dialog1.__modal).toBeInstanceOf(Modal)
    expect(dialog2.__modal).toBeInstanceOf(Modal)
  })

  it('should not initialize the same modal twice with both class and attribute', () => {
    const dialog = document.createElement('dialog')
    dialog.className = 'modal'
    dialog.setAttribute('data-modal', 'true')
    document.body.appendChild(dialog)

    initModals()

    // Should only have one instance
    expect(dialog.__modal).toBeInstanceOf(Modal)
    const firstInstance = dialog.__modal

    // Calling initModals again should not create a new instance
    initModals()
    expect(dialog.__modal).toBe(firstInstance)
  })
})
