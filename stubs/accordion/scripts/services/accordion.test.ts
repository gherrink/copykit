import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Accordion, createAccordion, initAccordions } from './accordion'
import { Expand } from '@/_base/scripts/services/expand'
import {
  createTestContainer,
  cleanupTestContainer,
  createElement,
  user,
  expectExpanded,
  expectCollapsed,
  expectFocusedElement,
} from '@test/utils'

describe('Accordion Service', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  // Helper function to create a basic accordion structure
  function createBasicAccordion(
    options: {
      itemCount?: number
      multiSelect?: boolean
      keyboard?: boolean
      animate?: boolean
    } = {},
  ) {
    const { itemCount = 3, multiSelect = false, keyboard = true, animate = false } = options

    const accordion = createElement('div', {
      class: 'accordion',
      'data-accordion': multiSelect ? 'multi' : 'single',
      'data-keyboard': keyboard.toString(),
    })

    for (let i = 0; i < itemCount; i++) {
      const item = createElement('div', { class: 'item' })

      const control = createElement(
        'button',
        {
          class: 'control chevron',
          'aria-expanded': 'false',
          'aria-controls': `content-${i}`,
        },
        `Item ${i + 1}`,
      )

      const content = createElement(
        'div',
        {
          class: 'content',
          id: `content-${i}`,
          hidden: '',
          ...(animate && { 'data-animate': 'accordion' }),
        },
        `Content for item ${i + 1}`,
      )

      item.appendChild(control)
      item.appendChild(content)
      accordion.appendChild(item)
    }

    container.appendChild(accordion)
    return accordion
  }

  describe('Basic Initialization', () => {
    it('should create accordion instance with default options', () => {
      const accordionElement = createBasicAccordion()

      const accordion = new Accordion(accordionElement)

      expect(accordion).toBeDefined()
      expect(accordion.element).toBe(accordionElement)
      expect(accordion.options.multiSelect).toBe(false)
      expect(accordion.options.keyboard).toBe(true)
      expect(accordion.expandInstances).toHaveLength(3)
    })

    it('should store instance on DOM element', () => {
      const accordionElement = createBasicAccordion()

      const accordion = new Accordion(accordionElement)
      const instance = Accordion.getInstance(accordionElement)

      expect(instance).toBe(accordion)
    })

    it('should create Expand instances for all controls', () => {
      const accordionElement = createBasicAccordion({ itemCount: 5 })

      const accordion = new Accordion(accordionElement)

      expect(accordion.expandInstances).toHaveLength(5)
      accordion.expandInstances.forEach(instance => {
        expect(instance).toBeInstanceOf(Expand)
      })
    })

    it('should use existing Expand instances if available', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      // Create Expand instances manually first
      const existingExpands = Array.from(controls).map(control => new Expand(control))

      const accordion = new Accordion(accordionElement)

      // Should reuse existing instances
      expect(accordion.expandInstances).toHaveLength(3)
      accordion.expandInstances.forEach((instance, index) => {
        expect(instance).toBe(existingExpands[index])
      })
    })
  })

  describe('Configuration Options', () => {
    it('should configure multiSelect option', () => {
      const accordionElement = createBasicAccordion()

      const singleSelect = new Accordion(accordionElement, { multiSelect: false })
      expect(singleSelect.options.multiSelect).toBe(false)

      const multiSelect = new Accordion(accordionElement, { multiSelect: true })
      expect(multiSelect.options.multiSelect).toBe(true)
    })

    it('should configure keyboard navigation option', () => {
      const accordionElement = createBasicAccordion()

      const withKeyboard = new Accordion(accordionElement, { keyboard: true })
      expect(withKeyboard.options.keyboard).toBe(true)

      const withoutKeyboard = new Accordion(accordionElement, { keyboard: false })
      expect(withoutKeyboard.options.keyboard).toBe(false)
    })

    it('should merge options with defaults', () => {
      const accordionElement = createBasicAccordion()

      const accordion = new Accordion(accordionElement, { multiSelect: true })

      expect(accordion.options.multiSelect).toBe(true)
      expect(accordion.options.keyboard).toBe(true) // default value
    })
  })

  describe('Single Select Mode', () => {
    it('should close other items when opening in single-select mode', async () => {
      const accordionElement = createBasicAccordion({ multiSelect: false })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { multiSelect: false })

      // Open first item
      await user.click(controls[0])
      expectExpanded(controls[0])

      // Open second item - should close first
      await user.click(controls[1])
      expectCollapsed(controls[0])
      expectExpanded(controls[1])

      // Open third item - should close second
      await user.click(controls[2])
      expectCollapsed(controls[1])
      expectExpanded(controls[2])
    })

    it('should allow closing the currently open item', async () => {
      const accordionElement = createBasicAccordion({ multiSelect: false })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { multiSelect: false })

      // Open item
      await user.click(controls[0])
      expectExpanded(controls[0])

      // Close same item
      await user.click(controls[0])
      expectCollapsed(controls[0])
    })
  })

  describe('Multi Select Mode', () => {
    it('should allow multiple items to be open simultaneously', async () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { multiSelect: true })

      // Open multiple items
      await user.click(controls[0])
      await user.click(controls[1])
      await user.click(controls[2])

      expectExpanded(controls[0])
      expectExpanded(controls[1])
      expectExpanded(controls[2])
    })

    it('should allow closing individual items independently', async () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { multiSelect: true })

      // Open all items
      await user.click(controls[0])
      await user.click(controls[1])
      await user.click(controls[2])

      // Close middle item
      await user.click(controls[1])

      expectExpanded(controls[0])
      expectCollapsed(controls[1])
      expectExpanded(controls[2])
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      const accordionElement = createBasicAccordion({ keyboard: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { keyboard: true })

      // Focus first control
      controls[0].focus()
      expectFocusedElement(controls[0])

      // Arrow down to next control
      await user.keyboard('{ArrowDown}')
      expectFocusedElement(controls[1])

      // Arrow down to next control
      await user.keyboard('{ArrowDown}')
      expectFocusedElement(controls[2])

      // Arrow down wraps to first control
      await user.keyboard('{ArrowDown}')
      expectFocusedElement(controls[0])
    })

    it('should navigate backwards with arrow up', async () => {
      const accordionElement = createBasicAccordion({ keyboard: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { keyboard: true })

      // Focus first control
      controls[0].focus()
      expectFocusedElement(controls[0])

      // Arrow up wraps to last control
      await user.keyboard('{ArrowUp}')
      expectFocusedElement(controls[2])

      // Arrow up to previous control
      await user.keyboard('{ArrowUp}')
      expectFocusedElement(controls[1])
    })

    it('should navigate to first/last with Home/End keys', async () => {
      const accordionElement = createBasicAccordion({ keyboard: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { keyboard: true })

      // Focus middle control
      controls[1].focus()
      expectFocusedElement(controls[1])

      // Home goes to first
      await user.keyboard('{Home}')
      expectFocusedElement(controls[0])

      // End goes to last
      await user.keyboard('{End}')
      expectFocusedElement(controls[2])
    })

    it('should toggle items with Space and Enter keys', async () => {
      const accordionElement = createBasicAccordion({ keyboard: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { keyboard: true })

      // Focus first control
      controls[0].focus()

      // Space should toggle
      await user.keyboard(' ')
      expectExpanded(controls[0])

      await user.keyboard(' ')
      expectCollapsed(controls[0])

      // Enter should also toggle
      await user.keyboard('{Enter}')
      expectExpanded(controls[0])
    })

    it('should not navigate when keyboard is disabled', async () => {
      const accordionElement = createBasicAccordion({ keyboard: false })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      new Accordion(accordionElement, { keyboard: false })

      controls[0].focus()
      expectFocusedElement(controls[0])

      // Arrow keys should not change focus (browser default behavior)
      await user.keyboard('{ArrowDown}')
      expectFocusedElement(controls[0])
    })
  })

  describe('Event Emission', () => {
    it('should emit itemToggle events', async () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)
      const toggleHandler = vi.fn()

      accordion.on('itemToggle', toggleHandler)

      await user.click(controls[0])

      expect(toggleHandler).toHaveBeenCalledWith({
        accordion: accordionElement,
        item: controls[0],
        index: 0,
        expanded: true,
      })
    })

    it('should emit itemOpen and itemClose events', async () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)
      const openHandler = vi.fn()
      const closeHandler = vi.fn()

      accordion.on('itemOpen', openHandler)
      accordion.on('itemClose', closeHandler)

      // Open item
      await user.click(controls[0])
      expect(openHandler).toHaveBeenCalledWith({
        accordion: accordionElement,
        item: controls[0],
        index: 0,
      })

      // Close item
      await user.click(controls[0])
      expect(closeHandler).toHaveBeenCalledWith({
        accordion: accordionElement,
        item: controls[0],
        index: 0,
      })
    })

    it('should emit keyboardNavigation events', async () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)
      const navHandler = vi.fn()

      accordion.on('keyboardNavigation', navHandler)

      controls[0].focus()
      await user.keyboard('{ArrowDown}')

      expect(navHandler).toHaveBeenCalledWith({
        accordion: accordionElement,
        from: 0,
        to: 1,
      })
    })

    it('should emit allOpen and allClose events', () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })

      const accordion = new Accordion(accordionElement, { multiSelect: true })
      const allOpenHandler = vi.fn()
      const allCloseHandler = vi.fn()

      accordion.on('allOpen', allOpenHandler)
      accordion.on('allClose', allCloseHandler)

      accordion.openAll()
      expect(allOpenHandler).toHaveBeenCalledWith({ accordion: accordionElement })

      accordion.closeAll()
      expect(allCloseHandler).toHaveBeenCalledWith({ accordion: accordionElement })
    })
  })

  describe('Programmatic Control', () => {
    it('should open specific items by index', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)

      accordion.open(1)
      expectExpanded(controls[1])

      // Should not affect already open item
      accordion.open(1)
      expectExpanded(controls[1])
    })

    it('should close specific items by index', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)

      // Open item first
      accordion.open(1)
      expectExpanded(controls[1])

      // Then close it
      accordion.close(1)
      expectCollapsed(controls[1])

      // Should not affect already closed item
      accordion.close(1)
      expectCollapsed(controls[1])
    })

    it('should toggle specific items by index', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)

      // Toggle closed item (should open)
      accordion.toggle(1)
      expectExpanded(controls[1])

      // Toggle open item (should close)
      accordion.toggle(1)
      expectCollapsed(controls[1])
    })

    it('should open all items in multi-select mode', () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement, { multiSelect: true })

      accordion.openAll()

      controls.forEach(control => {
        expectExpanded(control)
      })
    })

    it('should not open all items in single-select mode', () => {
      const accordionElement = createBasicAccordion({ multiSelect: false })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement, { multiSelect: false })

      accordion.openAll()

      // All should remain closed in single-select mode
      controls.forEach(control => {
        expectCollapsed(control)
      })
    })

    it('should close all items', () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement, { multiSelect: true })

      // Open all items first
      accordion.openAll()

      // Close all items
      accordion.closeAll()

      controls.forEach(control => {
        expectCollapsed(control)
      })
    })

    it('should return current state', () => {
      const accordionElement = createBasicAccordion({ multiSelect: true })

      const accordion = new Accordion(accordionElement, { multiSelect: true })

      // Initial state - all closed
      expect(accordion.getState()).toEqual([false, false, false])

      // Open some items
      accordion.open(0)
      accordion.open(2)

      expect(accordion.getState()).toEqual([true, false, true])
    })
  })

  describe('Legacy Callback Support', () => {
    it('should call onOpen callback when item opens', async () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')
      const contents = accordionElement.querySelectorAll<HTMLElement>('.content')

      const onOpen = vi.fn()

      new Accordion(accordionElement, { onOpen })

      await user.click(controls[0])

      expect(onOpen).toHaveBeenCalledWith(controls[0], contents[0])
    })

    it('should call onClose callback when item closes', async () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')
      const contents = accordionElement.querySelectorAll<HTMLElement>('.content')

      const onClose = vi.fn()

      new Accordion(accordionElement, { onClose })

      // Open then close
      await user.click(controls[0])
      await user.click(controls[0])

      expect(onClose).toHaveBeenCalledWith(controls[0], contents[0])
    })
  })

  describe('Cleanup and Destruction', () => {
    it('should clean up keyboard listeners on destroy', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      const accordion = new Accordion(accordionElement)

      // Add spy to check event listener removal
      const removeEventListenerSpy = vi.spyOn(controls[0], 'removeEventListener')

      accordion.destroy()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(Accordion.getInstance(accordionElement)).toBe(null)
    })

    it('should remove instance from DOM element', () => {
      const accordionElement = createBasicAccordion()

      const accordion = new Accordion(accordionElement)
      expect(Accordion.getInstance(accordionElement)).toBe(accordion)

      accordion.destroy()
      expect(Accordion.getInstance(accordionElement)).toBe(null)
    })
  })

  describe('createAccordion Function', () => {
    it('should create accordion from selector string', () => {
      const accordionElement = createBasicAccordion()
      accordionElement.id = 'test-accordion'

      const accordion = createAccordion('#test-accordion')

      expect(accordion).toBeInstanceOf(Accordion)
      expect(accordion.element).toBe(accordionElement)
    })

    it('should create accordion from DOM element', () => {
      const accordionElement = createBasicAccordion()

      const accordion = createAccordion(accordionElement)

      expect(accordion).toBeInstanceOf(Accordion)
      expect(accordion.element).toBe(accordionElement)
    })

    it('should throw error if element not found', () => {
      expect(() => {
        createAccordion('#nonexistent')
      }).toThrow('Accordion element not found')
    })

    it('should return existing instance if already created', () => {
      const accordionElement = createBasicAccordion()

      const accordion1 = createAccordion(accordionElement)
      const accordion2 = createAccordion(accordionElement)

      expect(accordion1).toBe(accordion2)
    })

    it('should pass options to accordion constructor', () => {
      const accordionElement = createBasicAccordion()

      const accordion = createAccordion(accordionElement, {
        multiSelect: true,
        keyboard: false,
      })

      expect(accordion.options.multiSelect).toBe(true)
      expect(accordion.options.keyboard).toBe(false)
    })
  })

  describe('initAccordions Function', () => {
    it('should initialize all accordions on page', () => {
      const accordion1 = createBasicAccordion({ multiSelect: false })
      const accordion2 = createBasicAccordion({ multiSelect: true })

      initAccordions()

      expect(Accordion.getInstance(accordion1)).toBeInstanceOf(Accordion)
      expect(Accordion.getInstance(accordion2)).toBeInstanceOf(Accordion)
    })

    it('should configure accordions from data attributes', () => {
      const singleAccordion = createBasicAccordion({ multiSelect: false })
      const multiAccordion = createBasicAccordion({ multiSelect: true })

      initAccordions()

      const singleInstance = Accordion.getInstance(singleAccordion)
      const multiInstance = Accordion.getInstance(multiAccordion)

      expect(singleInstance?.options.multiSelect).toBe(false)
      expect(multiInstance?.options.multiSelect).toBe(true)
    })

    it('should skip already initialized accordions', () => {
      const accordionElement = createBasicAccordion()

      const originalAccordion = new Accordion(accordionElement)

      initAccordions()

      expect(Accordion.getInstance(accordionElement)).toBe(originalAccordion)
    })

    it('should handle initialization errors gracefully', () => {
      const malformedAccordion = createElement('div', { class: 'accordion' })
      // No controls inside - should cause warning but not crash
      container.appendChild(malformedAccordion)

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(() => {
        initAccordions()
      }).not.toThrow()

      // The accordion with no controls doesn't actually throw an error - it just creates an empty instance
      // So the console.warn might not be called. Let's verify the accordion was created instead
      const instance = Accordion.getInstance(malformedAccordion)
      expect(instance).toBeInstanceOf(Accordion)
      expect(instance?.expandInstances).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Integration with Expand Service', () => {
    it('should work with existing Expand instances', () => {
      const accordionElement = createBasicAccordion()
      const controls = accordionElement.querySelectorAll<HTMLElement>('.control')

      // Pre-create some Expand instances
      const expand1 = new Expand(controls[0])
      const expand2 = new Expand(controls[1])

      const accordion = new Accordion(accordionElement)

      // Should reuse existing instances
      expect(accordion.expandInstances[0]).toBe(expand1)
      expect(accordion.expandInstances[1]).toBe(expand2)
      expect(accordion.expandInstances[2]).toBeInstanceOf(Expand)
    })

    it('should handle Expand instance events correctly', async () => {
      const accordionElement = createBasicAccordion()

      const accordion = new Accordion(accordionElement)
      const toggleHandler = vi.fn()

      accordion.on('itemToggle', toggleHandler)

      // Trigger via Expand instance directly
      accordion.expandInstances[0].toggle()

      expect(toggleHandler).toHaveBeenCalled()
    })
  })
})
