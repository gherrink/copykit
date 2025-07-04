import { EventEmitter } from '@/_base/scripts/utilities/event-emitter.ts'
import { Expand } from '@/_base/scripts/services/expand.ts'

/**
 * Global declarations for DOM-based instance storage
 */
declare global {
  interface HTMLElement {
    __accordion?: Accordion
  }
}

/**
 * Interface defining the events that the Accordion class can emit
 */
interface AccordionEvents {
  itemOpen: (data: { accordion: HTMLElement; item: HTMLElement; index: number }) => void
  itemClose: (data: { accordion: HTMLElement; item: HTMLElement; index: number }) => void
  itemToggle: (data: {
    accordion: HTMLElement
    item: HTMLElement
    index: number
    expanded: boolean
  }) => void
  allOpen: (data: { accordion: HTMLElement }) => void
  allClose: (data: { accordion: HTMLElement }) => void
  keyboardNavigation: (data: { accordion: HTMLElement; from: number; to: number }) => void
}

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

/**
 * Accordion class that extends EventEmitter and integrates with Expand instances
 */
export class Accordion extends EventEmitter<AccordionEvents> {
  public readonly element: HTMLElement
  public readonly expandInstances: Expand[]
  public readonly options: AccordionOptions
  private keyboardListener?: (e: KeyboardEvent) => void

  constructor(element: HTMLElement, options: AccordionOptions = {}) {
    super()
    this.element = element
    this.options = { multiSelect: false, keyboard: true, ...options }

    // Store instance directly on DOM element
    ;(element as any).__accordion = this

    // Find all control elements and get/create Expand instances
    const controls = element.querySelectorAll<HTMLElement>('.control[aria-expanded]')
    this.expandInstances = Array.from(controls).map(control => {
      let expandInstance = Expand.getInstance(control)
      if (!expandInstance) {
        expandInstance = new Expand(control)
      }
      return expandInstance
    })

    // Set up single-select behavior if needed
    if (!this.options.multiSelect) {
      controls.forEach(control => {
        control.setAttribute('data-hide-same-level', '')
      })
    }

    // Set up event listeners on Expand instances
    this.setupExpandListeners()

    // Initialize keyboard navigation
    if (this.options.keyboard) {
      this.initKeyboardNavigation()
    }

    // Set up legacy callbacks as event listeners
    this.setupLegacyCallbacks()
  }

  static getInstance(element: HTMLElement): Accordion | null {
    return (element as any).__accordion || null
  }

  private setupExpandListeners(): void {
    this.expandInstances.forEach((expandInstance, index) => {
      expandInstance.on('beforeToggle', data => {
        this.emit('itemToggle', {
          accordion: this.element,
          item: data.element,
          index,
          expanded: !data.expanded,
        })
      })

      expandInstance.on('afterExpand', data => {
        this.emit('itemOpen', {
          accordion: this.element,
          item: data.element,
          index,
        })
      })

      expandInstance.on('afterCollapse', data => {
        this.emit('itemClose', {
          accordion: this.element,
          item: data.element,
          index,
        })
      })
    })
  }

  private setupLegacyCallbacks(): void {
    const { onOpen, onClose } = this.options

    if (onOpen) {
      this.on('itemOpen', data => {
        const content = document.querySelector(`#${data.item.getAttribute('aria-controls')}`)
        if (content) {
          onOpen(data.item, content as HTMLElement)
        }
      })
    }

    if (onClose) {
      this.on('itemClose', data => {
        const content = document.querySelector(`#${data.item.getAttribute('aria-controls')}`)
        if (content) {
          onClose(data.item, content as HTMLElement)
        }
      })
    }
  }

  private initKeyboardNavigation(): void {
    const controls = this.element.querySelectorAll<HTMLElement>('.control')

    this.keyboardListener = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const currentIndex = Array.from(controls).indexOf(target)

      if (currentIndex === -1) return

      let targetIndex = currentIndex

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          targetIndex = (currentIndex + 1) % controls.length
          break
        case 'ArrowUp':
          e.preventDefault()
          targetIndex = (currentIndex - 1 + controls.length) % controls.length
          break
        case 'Home':
          e.preventDefault()
          targetIndex = 0
          break
        case 'End':
          e.preventDefault()
          targetIndex = controls.length - 1
          break
        case ' ':
        case 'Enter':
          e.preventDefault()
          this.toggle(currentIndex)
          return
        default:
          return
      }

      const targetControl = controls[targetIndex]
      if (targetControl && targetIndex !== currentIndex) {
        targetControl.focus()
        this.emit('keyboardNavigation', {
          accordion: this.element,
          from: currentIndex,
          to: targetIndex,
        })
      }
    }

    controls.forEach(control => {
      control.addEventListener('keydown', this.keyboardListener!)
    })
  }

  public open(index: number): void {
    const expandInstance = this.expandInstances[index]
    if (expandInstance && !expandInstance.isExpanded) {
      expandInstance.toggle()
    }
  }

  public close(index: number): void {
    const expandInstance = this.expandInstances[index]
    if (expandInstance && expandInstance.isExpanded) {
      expandInstance.toggle()
    }
  }

  public toggle(index: number): void {
    const expandInstance = this.expandInstances[index]
    if (expandInstance) {
      expandInstance.toggle()
    }
  }

  public openAll(): void {
    if (this.options.multiSelect) {
      this.expandInstances.forEach(instance => {
        if (!instance.isExpanded) {
          instance.toggle()
        }
      })
      this.emit('allOpen', { accordion: this.element })
    }
  }

  public closeAll(): void {
    this.expandInstances.forEach(instance => {
      if (instance.isExpanded) {
        instance.toggle()
      }
    })
    this.emit('allClose', { accordion: this.element })
  }

  public getState(): boolean[] {
    return this.expandInstances.map(instance => instance.isExpanded)
  }

  public destroy(): void {
    // Remove keyboard listeners
    if (this.keyboardListener) {
      const controls = this.element.querySelectorAll<HTMLElement>('.control')
      controls.forEach(control => {
        control.removeEventListener('keydown', this.keyboardListener!)
        control.removeAttribute('data-hide-same-level')
      })
    }

    // Remove instance from DOM element
    delete (this.element as any).__accordion
  }
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
 * // Programmatic control - returns Accordion class instance
 * accordion.open(0)
 * accordion.close(0)
 * accordion.toggle(0)
 * accordion.openAll()
 * accordion.closeAll()
 * console.log(accordion.getState())
 *
 * // Event listening
 * accordion.on('itemOpen', (data) => console.log('Item opened:', data.index))
 *
 * // Alternative: Get existing instance from DOM
 * const existingAccordion = Accordion.getInstance(document.querySelector('#my-accordion'))
 */
export function createAccordion(
  selector: string | HTMLElement,
  options: AccordionOptions = {},
): Accordion {
  const element =
    typeof selector === 'string' ? document.querySelector<HTMLElement>(selector) : selector

  if (!element) {
    throw new Error('Accordion element not found')
  }

  // Check if accordion instance already exists
  let accordionInstance = Accordion.getInstance(element)
  if (!accordionInstance) {
    accordionInstance = new Accordion(element, options)
  }

  return accordionInstance
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
  document.querySelectorAll<HTMLElement>('.accordion').forEach(accordion => {
    // Skip if accordion instance already exists
    if (Accordion.getInstance(accordion)) {
      return
    }

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
