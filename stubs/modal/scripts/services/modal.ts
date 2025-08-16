import { EventEmitter } from '@/_base/scripts/utilities/event-emitter'

/**
 * Global declarations for DOM-based instance storage
 */
declare global {
  interface HTMLDialogElement {
    __modal?: Modal
  }
}

/**
 * Interface defining the events that the Modal class can emit
 */
interface ModalEvents {
  beforeOpen: (data: { modal: HTMLDialogElement; isModal: boolean }) => void
  afterOpen: (data: { modal: HTMLDialogElement; isModal: boolean }) => void
  beforeClose: (data: { modal: HTMLDialogElement; returnValue?: string }) => void
  afterClose: (data: { modal: HTMLDialogElement; returnValue?: string }) => void
}

/**
 * Modal service that enhances the native HTML dialog element with CopyKit patterns.
 *
 * Features:
 * - Native HTML dialog element integration (showModal/show/close methods)
 * - Focus management and restoration
 * - Keyboard navigation (ESC key, focus trapping)
 * - Backdrop click handling
 * - Configuration via data attributes
 * - Event-driven communication
 *
 * @location functions.modal Modal Service
 * @example
 * <dialog class="modal" data-modal="center">
 *   <header class="header">
 *     <h2 class="headline">Modal Title</h2>
 *     <button class="control close" aria-label="Close">×</button>
 *   </header>
 *   <div class="content">
 *     Modal content goes here
 *   </div>
 *   <footer class="footer">
 *     <button type="button" class="btn">Cancel</button>
 *     <button type="button" class="btn primary">Confirm</button>
 *   </footer>
 * </dialog>
 */

export interface ModalOptions {
  /* Enable backdrop click to close */
  backdropClose?: boolean
  /* Enable ESC key to close */
  escapeClose?: boolean
  /* Restore focus to trigger element on close */
  restoreFocus?: boolean
  /* Element to focus when modal opens */
  focusTarget?: string
  /* Auto-open modal after initialization */
  autoOpen?: boolean
  /* Delay before auto-opening (in milliseconds) */
  autoOpenDelay?: number
  /* Callback when modal is opened */
  onOpen?: (element: HTMLDialogElement) => void
  /* Callback when modal is closed */
  onClose?: (element: HTMLDialogElement, returnValue?: string) => void
}

/**
 * Modal class that extends EventEmitter and integrates with native dialog element
 */
export class Modal extends EventEmitter<ModalEvents> {
  public readonly element: HTMLDialogElement
  public readonly options: ModalOptions
  private previousFocus?: HTMLElement
  private backdropClickListener?: (e: MouseEvent) => void
  private keydownListener?: (e: KeyboardEvent) => void

  constructor(element: HTMLDialogElement, options: ModalOptions = {}) {
    super()
    this.element = element
    this.options = {
      backdropClose: true,
      escapeClose: true,
      restoreFocus: true,
      autoOpen: false,
      autoOpenDelay: 0,
      ...options,
    }

    // Store instance directly on DOM element
    element.__modal = this

    // Set up event listeners
    this.setupEventListeners()

    // Parse configuration from data attributes
    this.parseDataAttributes()

    // Handle initial open state
    this.handleInitialOpenState()

    // Handle auto-open functionality
    this.handleAutoOpen()
  }

  static getInstance(element: HTMLDialogElement): Modal | null {
    return element.__modal || null
  }

  private parseDataAttributes(): void {
    // Override options with data attributes
    const backdropAttr = this.element.getAttribute('data-modal-backdrop')
    if (backdropAttr !== null) {
      this.options.backdropClose = backdropAttr !== 'false'
    }

    const escapeAttr = this.element.getAttribute('data-modal-escape')
    if (escapeAttr !== null) {
      this.options.escapeClose = escapeAttr !== 'false'
    }

    const focusAttr = this.element.getAttribute('data-modal-focus')
    if (focusAttr) {
      this.options.focusTarget = focusAttr
    }

    const autoOpenAttr = this.element.getAttribute('data-modal-auto-open')
    if (autoOpenAttr !== null) {
      this.options.autoOpen = autoOpenAttr !== 'false'
    }

    const autoOpenDelayAttr = this.element.getAttribute('data-modal-auto-open-delay')
    if (autoOpenDelayAttr) {
      const delay = parseInt(autoOpenDelayAttr, 10)
      if (!isNaN(delay) && delay >= 0) {
        this.options.autoOpenDelay = delay
      }
    }
  }

  private handleInitialOpenState(): void {
    // If the dialog is already open when initialized, set up event listeners
    if (this.element.open) {
      // Set up event listeners for the already-open modal
      this.element.addEventListener('click', this.backdropClickListener!)
      document.addEventListener('keydown', this.keydownListener!)

      // Emit afterOpen event to notify that the modal is open
      // Use setTimeout to ensure this happens after constructor completes
      setTimeout(() => {
        this.emit('afterOpen', {
          modal: this.element,
          isModal: this.element.matches(':modal'),
        })

        // Call legacy callback if provided
        if (this.options.onOpen) {
          this.options.onOpen(this.element)
        }
      }, 0)
    }
  }

  private handleAutoOpen(): void {
    // Only auto-open if the modal is not already open and auto-open is enabled
    if (this.options.autoOpen && !this.element.open) {
      const delay = this.options.autoOpenDelay || 0

      if (delay > 0) {
        setTimeout(() => {
          // Double-check that modal is still not open before auto-opening
          if (!this.element.open) {
            this.openModal()
          }
        }, delay)
      } else {
        // Use setTimeout with 0 delay to ensure DOM is ready
        setTimeout(() => {
          if (!this.element.open) {
            this.openModal()
          }
        }, 0)
      }
    }
  }

  private setupEventListeners(): void {
    // Set up close button handlers
    const closeButtons = this.element.querySelectorAll('[data-modal-close]')
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close())
    })

    // Set up native dialog close event
    this.element.addEventListener('close', () => {
      this.handleNativeClose()
    })

    // Set up backdrop click listener
    this.backdropClickListener = (e: MouseEvent) => {
      if (this.options.backdropClose && e.target === this.element) {
        this.close()
      }
    }

    // Set up keyboard listener
    this.keydownListener = (e: KeyboardEvent) => {
      // Only handle escape if this modal is currently open and visible
      if (e.key === 'Escape' && this.options.escapeClose && this.element.open) {
        e.preventDefault()
        this.close()
      }
    }
  }

  private handleNativeClose(): void {
    const returnValue = this.element.returnValue

    // Ensure dialog is completely removed from top-layer
    this.forceCleanupTopLayer()

    // Clean up event listeners if they exist
    if (this.backdropClickListener) {
      this.element.removeEventListener('click', this.backdropClickListener)
    }
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener)
    }

    this.emit('afterClose', {
      modal: this.element,
      returnValue: returnValue || undefined,
    })

    // Restore focus to previous element
    if (this.options.restoreFocus && this.previousFocus) {
      this.previousFocus.focus()
      this.previousFocus = undefined
    }

    // Call legacy callback
    if (this.options.onClose) {
      this.options.onClose(this.element, returnValue || undefined)
    }
  }

  private forceCleanupTopLayer(): void {
    // Force removal of open attribute
    this.element.removeAttribute('open')

    // Force a style recalculation to ensure top-layer cleanup
    // This helps with browser inconsistencies
    this.element.style.display = 'none'
    // Force reflow
    this.element.offsetHeight
    this.element.style.display = ''

    // Ensure dialog is properly closed if it somehow remains open
    if (this.element.open) {
      try {
        this.element.close()
      } catch {
        // Ignore errors if dialog is already closed
      }
    }
  }

  public openModal(): void {
    // Store current focus for restoration
    if (this.options.restoreFocus) {
      this.previousFocus = document.activeElement as HTMLElement
    }

    this.emit('beforeOpen', { modal: this.element, isModal: true })

    // Open as modal dialog
    this.element.showModal()

    // Add open attribute to stay in sync
    this.element.setAttribute('open', '')

    // Remove any existing listeners first to prevent duplicates
    if (this.backdropClickListener) {
      this.element.removeEventListener('click', this.backdropClickListener)
    }
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener)
    }

    // Set up event listeners for open modal
    this.element.addEventListener('click', this.backdropClickListener!)
    document.addEventListener('keydown', this.keydownListener!)

    // Focus management
    this.manageFocus()

    this.emit('afterOpen', { modal: this.element, isModal: true })

    // Call legacy callback
    if (this.options.onOpen) {
      this.options.onOpen(this.element)
    }
  }

  public openNonModal(): void {
    // Store current focus for restoration
    if (this.options.restoreFocus) {
      this.previousFocus = document.activeElement as HTMLElement
    }

    this.emit('beforeOpen', { modal: this.element, isModal: false })

    // Open as non-modal dialog
    this.element.show()

    // Add open attribute to stay in sync
    this.element.setAttribute('open', '')

    // Remove any existing listeners first to prevent duplicates
    if (this.backdropClickListener) {
      this.element.removeEventListener('click', this.backdropClickListener)
    }
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener)
    }

    // Set up event listeners for open dialog
    this.element.addEventListener('click', this.backdropClickListener!)
    document.addEventListener('keydown', this.keydownListener!)

    // Focus management
    this.manageFocus()

    this.emit('afterOpen', { modal: this.element, isModal: false })

    // Call legacy callback
    if (this.options.onOpen) {
      this.options.onOpen(this.element)
    }
  }

  public close(returnValue?: string): void {
    if (!this.element.open) return

    this.emit('beforeClose', {
      modal: this.element,
      returnValue,
    })

    // Set return value if provided
    if (returnValue !== undefined) {
      this.element.returnValue = returnValue
    }

    // Remove event listeners before closing
    if (this.backdropClickListener) {
      this.element.removeEventListener('click', this.backdropClickListener)
    }
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener)
    }

    // Close the dialog first (this removes it from top-layer)
    this.element.close(returnValue)

    // Force cleanup to ensure complete removal from top-layer
    this.forceCleanupTopLayer()
  }

  private manageFocus(): void {
    // Focus target priority:
    // 1. Specified focus target (data-modal-focus or options.focusTarget)
    // 2. First focusable element
    // 3. First button in footer

    let focusTarget: HTMLElement | null = null

    if (this.options.focusTarget) {
      focusTarget = this.element.querySelector(this.options.focusTarget)
    }

    if (!focusTarget) {
      // Find first focusable element
      focusTarget = this.element.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
    }

    if (!focusTarget) {
      // Find footer button
      focusTarget = this.element.querySelector('.footer button')
    }

    if (focusTarget) {
      focusTarget.focus()
    }
  }

  public get isOpen(): boolean {
    return this.element.open
  }

  public destroy(): void {
    // Remove event listeners
    if (this.backdropClickListener) {
      this.element.removeEventListener('click', this.backdropClickListener)
    }
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener)
    }

    // Close if open
    if (this.isOpen) {
      this.element.close()
    }

    // Remove instance from DOM element
    delete this.element.__modal

    // Remove all event listeners
    this.removeAllListeners()
  }
}

/**
 * Create modal instance with enhanced functionality
 *
 * @location functions.modal.instance Modal Instance
 * @example
 * <dialog class="modal" id="my-modal">
 *   <header class="header">
 *     <h2 class="headline">Confirm Action</h2>
 *     <button class="control close" aria-label="Close">×</button>
 *   </header>
 *   <div class="content">
 *     <p>Are you sure you want to proceed?</p>
 *   </div>
 *   <footer class="footer">
 *     <button type="button" value="cancel" class="btn">Cancel</button>
 *     <button type="button" value="confirm" class="btn primary">Confirm</button>
 *   </footer>
 * </dialog>
 * @code
 * const modal = createModal('#my-modal', {
 *   backdropClose: true,
 *   escapeClose: true,
 *   onOpen: (element) => console.log('Modal opened'),
 *   onClose: (element, returnValue) => console.log('Modal closed:', returnValue)
 * })
 *
 * // Open as modal
 * modal.openModal()
 *
 * // Open as non-modal
 * modal.openNonModal()
 *
 * // Close with return value
 * modal.close('confirmed')
 *
 * // Event listening
 * modal.on('afterClose', (data) => {
 *   console.log('Modal closed with value:', data.returnValue)
 * })
 */
export function createModal(
  selector: string | HTMLDialogElement,
  options: ModalOptions = {},
): Modal {
  const element =
    typeof selector === 'string' ? document.querySelector<HTMLDialogElement>(selector) : selector

  if (!element) {
    throw new Error('Modal element not found')
  }

  if (!(element instanceof HTMLDialogElement)) {
    throw new Error('Element must be a dialog element')
  }

  // Check if modal instance already exists
  let modalInstance = Modal.getInstance(element)
  if (!modalInstance) {
    modalInstance = new Modal(element, options)
  }

  return modalInstance
}

/**
 * Initialize all modals on the page with automatic configuration and open buttons
 *
 * @location functions.modal.init Initialize Modals
 * @example
 * <!-- Modal with open button using CSS selector -->
 * <button data-modal-open="#my-modal" class="btn primary">Open Modal</button>
 * <dialog id="my-modal" class="modal">
 *   <header class="header">
 *     <h2 class="headline">Auto-initialized Modal</h2>
 *     <button class="control close" aria-label="Close">×</button>
 *   </header>
 *   <div class="content">
 *     <p>This modal is automatically initialized with open button</p>
 *   </div>
 * </dialog>
 *
 * <!-- Auto-opening modal (opens immediately) -->
 * <dialog class="modal" data-modal-auto-open="true">
 *   <header class="header">
 *     <h2 class="headline">Welcome!</h2>
 *     <button class="control close" aria-label="Close">×</button>
 *   </header>
 *   <div class="content">
 *     <p>This modal opens automatically when the page loads</p>
 *   </div>
 * </dialog>
 *
 * <!-- Auto-opening modal with delay -->
 * <dialog class="modal" data-modal-auto-open="true" data-modal-auto-open-delay="2000">
 *   <header class="header">
 *     <h2 class="headline">Delayed Notification</h2>
 *     <button class="control close" aria-label="Close">×</button>
 *   </header>
 *   <div class="content">
 *     <p>This modal opens automatically after 2 seconds</p>
 *   </div>
 * </dialog>
 *
 * <!-- Non-modal dialog -->
 * <button data-modal-open="#info-dialog" data-modal-type="non-modal" class="btn">Info</button>
 * <dialog id="info-dialog" class="modal">
 *   <div class="content">Non-modal dialog content</div>
 * </dialog>
 */
export function initModals(): void {
  // Initialize modals found by CSS class (primary method)
  document.querySelectorAll<HTMLDialogElement>('dialog.modal').forEach(dialog => {
    // Skip if modal instance already exists
    if (Modal.getInstance(dialog)) {
      return
    }

    try {
      createModal(dialog)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize modal:', error)
    }
  })

  // Also initialize modals found by data attribute (alternative method)
  document.querySelectorAll<HTMLDialogElement>('dialog[data-modal]').forEach(dialog => {
    // Skip if modal instance already exists or already processed by CSS class
    if (Modal.getInstance(dialog)) {
      return
    }

    try {
      createModal(dialog)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize modal:', error)
    }
  })

  // Set up modal open buttons
  initModalOpenButtons()
}

/**
 * Initialize modal open buttons with event listeners
 * Supports both data-modal-open attribute and CSS class-based targeting
 */
function initModalOpenButtons(): void {
  // Find buttons with data-modal-open attribute
  document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach(button => {
    const modalSelector = button.getAttribute('data-modal-open')
    if (!modalSelector) return

    // Skip if already has listener (prevent duplicate listeners)
    if (button.hasAttribute('data-modal-initialized')) return

    button.addEventListener('click', e => {
      e.preventDefault()

      const targetModal = document.querySelector<HTMLDialogElement>(modalSelector)
      if (!targetModal) {
        // eslint-disable-next-line no-console
        console.warn(`Modal not found: ${modalSelector}`)
        return
      }

      const modalInstance = Modal.getInstance(targetModal)
      if (modalInstance) {
        // Determine if should open as modal or non-modal based on data attribute
        const isModal = button.getAttribute('data-modal-type') !== 'non-modal'
        if (isModal) {
          modalInstance.openModal()
        } else {
          modalInstance.openNonModal()
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Modal instance not found for: ${modalSelector}`)
      }
    })

    // Mark as initialized to prevent duplicate listeners
    button.setAttribute('data-modal-initialized', 'true')
  })

  // Find buttons with CSS class targeting specific modals
  document.querySelectorAll<HTMLElement>('[data-modal-target]').forEach(button => {
    const modalId = button.getAttribute('data-modal-target')
    if (!modalId) return

    // Skip if already has listener
    if (button.hasAttribute('data-modal-initialized')) return

    button.addEventListener('click', e => {
      e.preventDefault()

      const targetModal = document.getElementById(modalId) as HTMLDialogElement
      if (!targetModal) {
        // eslint-disable-next-line no-console
        console.warn(`Modal not found with ID: ${modalId}`)
        return
      }

      const modalInstance = Modal.getInstance(targetModal)
      if (modalInstance) {
        // Determine if should open as modal or non-modal based on data attribute
        const isModal = button.getAttribute('data-modal-type') !== 'non-modal'
        if (isModal) {
          modalInstance.openModal()
        } else {
          modalInstance.openNonModal()
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Modal instance not found for ID: ${modalId}`)
      }
    })

    // Mark as initialized to prevent duplicate listeners
    button.setAttribute('data-modal-initialized', 'true')
  })
}
