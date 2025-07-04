import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Expand, initExpand } from './expand'
import {
  createTestContainer,
  cleanupTestContainer,
  createElement,
  user,
  expectExpanded,
  expectCollapsed,
  expectHidden,
  expectVisible,
} from '@test/utils'

describe('Expand Class', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('Basic Functionality', () => {
    it('should initialize with correct properties', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      container.appendChild(button)

      const expand = new Expand(button)

      expect(expand.element).toBe(button)
      expect(expand.controlTarget).toBe('target')
      expect(expand.isExpanded).toBe(false)
    })

    it('should store instance on DOM element', () => {
      const button = createElement('button', { 'aria-expanded': 'false' })
      container.appendChild(button)

      const expand = new Expand(button)
      const instance = Expand.getInstance(button)

      expect(instance).toBe(expand)
    })

    it('should detect expanded state correctly', () => {
      const button = createElement('button', { 'aria-expanded': 'true' })
      container.appendChild(button)

      const expand = new Expand(button)
      expect(expand.isExpanded).toBe(true)
    })
  })

  describe('Toggle Functionality', () => {
    it('should toggle aria-expanded attribute', async () => {
      const button = createElement('button', { 'aria-expanded': 'false' })
      container.appendChild(button)

      const expand = new Expand(button)

      expand.toggle()
      expectExpanded(button)

      expand.toggle()
      expectCollapsed(button)
    })

    it('should toggle on click', async () => {
      const button = createElement('button', { 'aria-expanded': 'false' })
      container.appendChild(button)

      new Expand(button)

      await user.click(button)
      expectExpanded(button)

      await user.click(button)
      expectCollapsed(button)
    })

    it('should emit events during toggle', () => {
      const button = createElement('button', { 'aria-expanded': 'false' })
      container.appendChild(button)

      const expand = new Expand(button)

      const beforeToggle = vi.fn()
      const afterToggle = vi.fn()
      const beforeExpand = vi.fn()
      const afterExpand = vi.fn()

      expand.on('beforeToggle', beforeToggle)
      expand.on('afterToggle', afterToggle)
      expand.on('beforeExpand', beforeExpand)
      expand.on('afterExpand', afterExpand)

      expand.toggle()

      expect(beforeToggle).toHaveBeenCalledWith({
        element: button,
        expanded: false,
        event: undefined,
      })
      expect(afterToggle).toHaveBeenCalledWith({
        element: button,
        expanded: true,
        event: undefined,
      })
      expect(beforeExpand).toHaveBeenCalledWith({
        element: button,
        event: undefined,
      })
      expect(afterExpand).toHaveBeenCalledWith({
        element: button,
        event: undefined,
      })
    })
  })

  describe('Control Target Functionality', () => {
    it('should toggle controlled element visibility', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      const target = createElement('div', {
        id: 'target',
        hidden: '',
      })

      container.appendChild(button)
      container.appendChild(target)

      const expand = new Expand(button)

      expand.toggle()
      expectExpanded(button)
      expectVisible(target)

      expand.toggle()
      expectCollapsed(button)
      expectHidden(target)
    })

    it('should handle aria-hidden attribute', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      const target = createElement('div', {
        id: 'target',
        'aria-hidden': 'true',
      })

      container.appendChild(button)
      container.appendChild(target)

      const expand = new Expand(button)

      expand.toggle()
      expect(target.getAttribute('aria-hidden')).toBe('false')

      expand.toggle()
      expect(target.getAttribute('aria-hidden')).toBe('true')
    })

    it('should manage tabindex for keyboard navigation', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      const target = createElement('div', { id: 'target' })
      const focusableElement = createElement('button', { tabindex: '-1' })

      target.appendChild(focusableElement)
      container.appendChild(button)
      container.appendChild(target)

      const expand = new Expand(button)

      // Expand should set tabindex to 0
      expand.toggle()
      expect(focusableElement.getAttribute('tabindex')).toBe('0')

      // Collapse should set tabindex to -1
      expand.toggle()
      expect(focusableElement.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('Inert Functionality', () => {
    it('should toggle inert attribute based on data-inert', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      const target = createElement('div', {
        id: 'target',
        'data-inert': '.inert-target',
      })
      const inertTarget = createElement('div', { class: 'inert-target' })

      container.appendChild(button)
      container.appendChild(target)
      container.appendChild(inertTarget)

      const expand = new Expand(button)

      expand.toggle()
      expect(inertTarget.hasAttribute('inert')).toBe(true)

      expand.toggle()
      expect(inertTarget.hasAttribute('inert')).toBe(false)
    })
  })

  describe('Data Hide Same Level', () => {
    it('should collapse siblings with data-hide-same-level', async () => {
      const parent = createElement('div')
      const button1 = createElement('button', {
        'aria-expanded': 'false',
        'data-hide-same-level': '',
      })
      const button2 = createElement('button', {
        'aria-expanded': 'true',
        'data-hide-same-level': '',
      })

      parent.appendChild(button1)
      parent.appendChild(button2)
      container.appendChild(parent)

      new Expand(button1)
      new Expand(button2)

      await user.click(button1)

      expectExpanded(button1)
      expectCollapsed(button2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const button = createElement(
        'button',
        {
          'aria-expanded': 'false',
          'aria-controls': 'target',
        },
        'Toggle',
      )
      const target = createElement('div', { id: 'target' }, 'Content')

      container.appendChild(button)
      container.appendChild(target)

      new Expand(button)

      // Basic ARIA checks without axe for now
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls', 'target')
      expect(target).toHaveAttribute('id', 'target')
    })

    it('should maintain proper focus management', () => {
      const button = createElement('button', {
        'aria-expanded': 'false',
        'aria-controls': 'target',
      })
      const target = createElement('div', { id: 'target' })
      const focusableChild = createElement('button', { tabindex: '-1' })

      target.appendChild(focusableChild)
      container.appendChild(button)
      container.appendChild(target)

      const expand = new Expand(button)

      // Should make child focusable when expanded
      expand.toggle()
      expect(focusableChild.getAttribute('tabindex')).toBe('0')

      // Should make child non-focusable when collapsed
      expand.toggle()
      expect(focusableChild.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('initExpand Function', () => {
    it('should initialize all elements with aria-expanded', () => {
      const button1 = createElement('button', { 'aria-expanded': 'false' })
      const button2 = createElement('button', { 'aria-expanded': 'true' })
      const regularButton = createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(regularButton)

      initExpand()

      expect(Expand.getInstance(button1)).toBeDefined()
      expect(Expand.getInstance(button2)).toBeDefined()
      expect(Expand.getInstance(regularButton)).toBeNull()
    })

    it('should not create duplicate instances', () => {
      const button = createElement('button', { 'aria-expanded': 'false' })
      container.appendChild(button)

      const firstInstance = new Expand(button)
      initExpand()

      expect(Expand.getInstance(button)).toBe(firstInstance)
    })
  })
})
