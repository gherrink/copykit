/**
 * Accordion service that enhances the base expand functionality with accordion-specific behavior.
 *
 * Features:
 * - Keyboard navigation support (Arrow keys, Home, End, Space, Enter)
 * - Single-select mode with automatic closing of siblings
 * - Multi-select mode allowing multiple items to be open
 * - Proper ARIA attributes management
 * - Animation support integration
 *
 * @location functions.accordion Accordion Service
 * @example
 * <div class="accordion" data-accordion="single">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="item-1">
 *       First Item
 *     </button>
 *     <div class="content" id="item-1" hidden data-animate="accordion">
 *       First item content
 *     </div>
 *   </div>
 * </div>
 */

export interface AccordionOptions {
  /* Allow multiple items to be open simultaneously */
  multiSelect?: boolean
  /* Enable keyboard navigation */
  keyboard?: boolean
  /* Animation duration in milliseconds */
  animationDuration?: number
  /* Callback when accordion item is opened */
  onOpen?: (element: HTMLElement, target: HTMLElement) => void
  /* Callback when accordion item is closed */
  onClose?: (element: HTMLElement, target: HTMLElement) => void
}

export interface AccordionInstance {
  /* Open specific accordion item */
  open: (index: number) => void
  /* Close specific accordion item */
  close: (index: number) => void
  /* Toggle specific accordion item */
  toggle: (index: number) => void
  /* Open all accordion items (multi-select only) */
  openAll: () => void
  /* Close all accordion items */
  closeAll: () => void
  /* Get current state of all items */
  getState: () => boolean[]
  /* Destroy accordion instance */
  destroy: () => void
}

/**
 * Enhanced accordion initialization with keyboard support and additional features
 *
 * @location functions.accordion.keyboard Accordion with Keyboard Navigation
 * @example
 * <div class="accordion" data-accordion="single" data-keyboard="true">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="keyboard-1">
 *       Navigate with arrow keys
 *     </button>
 *     <div class="content" id="keyboard-1" hidden>
 *       Use arrow keys to navigate between headers
 *     </div>
 *   </div>
 * </div>
 */
function initAccordionKeyboard(accordion: HTMLElement): void {
  const headers = accordion.querySelectorAll<HTMLElement>('.control')

  headers.forEach((header, index) => {
    header.addEventListener('keydown', e => {
      let targetIndex = index

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          targetIndex = (index + 1) % headers.length
          break
        case 'ArrowUp':
          e.preventDefault()
          targetIndex = (index - 1 + headers.length) % headers.length
          break
        case 'Home':
          e.preventDefault()
          targetIndex = 0
          break
        case 'End':
          e.preventDefault()
          targetIndex = headers.length - 1
          break
        case ' ':
        case 'Enter':
          e.preventDefault()
          header.click()
          return
        default:
          return
      }

      const targetHeader = headers[targetIndex]
      if (targetHeader) {
        targetHeader.focus()
      }
    })
  })
}

/**
 * Create accordion instance with enhanced functionality
 *
 * @location functions.accordion.instance Accordion Instance
 * @example
 * <div class="accordion" id="my-accordion">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="instance-1">
 *       Programmatic Control
 *     </button>
 *     <div class="content" id="instance-1" hidden>
 *       This can be controlled programmatically
 *     </div>
 *   </div>
 * </div>
 * @code
 * const accordion = createAccordion('#my-accordion', {
 *   multiSelect: false,
 *   keyboard: true,
 *   onOpen: (element, target) => console.log('Opened:', element),
 *   onClose: (element, target) => console.log('Closed:', element)
 * })
 *
 * // Programmatic control
 * accordion.open(0)
 * accordion.close(0)
 * accordion.toggle(0)
 */
export function createAccordion(
  selector: string | HTMLElement,
  options: AccordionOptions = {}
): AccordionInstance {
  const accordion =
    typeof selector === 'string' ? document.querySelector<HTMLElement>(selector) : selector

  if (!accordion) {
    throw new Error('Accordion element not found')
  }

  const { multiSelect = false, keyboard = true, onOpen, onClose } = options

  const headers = accordion.querySelectorAll<HTMLElement>('.control')
  const contents = accordion.querySelectorAll<HTMLElement>('.content')

  // Set up single-select behavior if needed
  if (!multiSelect) {
    headers.forEach(header => {
      header.setAttribute('data-hide-same-level', '')
    })
  }

  // Initialize keyboard navigation
  if (keyboard) {
    initAccordionKeyboard(accordion)
  }

  // Add event listeners for callbacks
  if (onOpen || onClose) {
    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true'
        const content = contents[index]

        if (isExpanded && onClose) {
          onClose(header, content)
        } else if (!isExpanded && onOpen) {
          onOpen(header, content)
        }
      })
    })
  }

  return {
    open: (index: number) => {
      const header = headers[index]
      if (header && header.getAttribute('aria-expanded') === 'false') {
        header.click()
      }
    },

    close: (index: number) => {
      const header = headers[index]
      if (header && header.getAttribute('aria-expanded') === 'true') {
        header.click()
      }
    },

    toggle: (index: number) => {
      const header = headers[index]
      if (header) {
        header.click()
      }
    },

    openAll: () => {
      if (multiSelect) {
        headers.forEach(header => {
          if (header.getAttribute('aria-expanded') === 'false') {
            header.click()
          }
        })
      }
    },

    closeAll: () => {
      headers.forEach(header => {
        if (header.getAttribute('aria-expanded') === 'true') {
          header.click()
        }
      })
    },

    getState: () => {
      return Array.from(headers).map(header => header.getAttribute('aria-expanded') === 'true')
    },

    destroy: () => {
      // Remove event listeners and clean up
      headers.forEach(header => {
        header.removeAttribute('data-hide-same-level')
        const newHeader = header.cloneNode(true)
        header.parentNode?.replaceChild(newHeader, header)
      })
    },
  }
}

/**
 * Initialize all accordions on the page with automatic configuration
 *
 * @location functions.accordion.init Initialize Accordions
 * @example
 * <div class="accordion" data-accordion="single" data-keyboard="true">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="auto-1">
 *       Auto-initialized
 *     </button>
 *     <div class="content" id="auto-1" hidden>
 *       Automatically initialized accordion
 *     </div>
 *   </div>
 * </div>
 */
export function initAccordions(): void {
  // Then enhance with accordion-specific features
  document.querySelectorAll<HTMLElement>('.accordion').forEach(accordion => {
    const mode = accordion.getAttribute('data-accordion')
    const keyboardEnabled = accordion.getAttribute('data-keyboard') === 'true'

    const options: AccordionOptions = {
      multiSelect: mode === 'multi',
      keyboard: keyboardEnabled,
    }

    try {
      createAccordion(accordion, options)
    } catch (error) {
      console.warn('Failed to initialize accordion:', error)
    }
  })
}
