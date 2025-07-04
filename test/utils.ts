import { screen, within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { expect } from 'vitest'

/**
 * Creates a user event instance for testing user interactions
 */
export const user = userEvent.setup()

/**
 * Helper to create a DOM element with attributes for testing
 */
export function createElement(
  tag: string,
  attributes: Record<string, string> = {},
  content = ''
): HTMLElement {
  const element = document.createElement(tag)
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  
  if (content) {
    element.textContent = content
  }
  
  return element
}

/**
 * Helper to create a test container and append it to document.body
 */
export function createTestContainer(): HTMLElement {
  const container = document.createElement('div')
  container.setAttribute('data-testid', 'test-container')
  document.body.appendChild(container)
  
  return container
}

/**
 * Helper to clean up test containers
 */
export function cleanupTestContainer(): void {
  const containers = document.querySelectorAll('[data-testid="test-container"]')
  containers.forEach(container => container.remove())
}

/**
 * Helper to wait for animations to complete
 */
export function waitForAnimation(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    const animations = element.getAnimations()
    
    if (animations.length === 0) {
      resolve()
      return
    }
    
    Promise.all(animations.map(animation => animation.finished))
      .then(() => resolve())
      .catch(() => resolve()) // Resolve even if animation fails
  })
}

/**
 * Helper to run accessibility tests on an element
 */
export async function expectAccessible(element: HTMLElement): Promise<void> {
  const results = await axe(element)
  expect(results).toHaveNoViolations()
}

/**
 * Helper to get element by aria-label
 */
export function getByAriaLabel(label: string): HTMLElement {
  return screen.getByLabelText(label)
}

/**
 * Helper to get element by aria-expanded attribute
 */
export function getByAriaExpanded(expanded: boolean): HTMLElement {
  return screen.getByRole('button', { expanded })
}

/**
 * Helper to check if element has proper ARIA attributes
 */
export function hasProperAriaAttributes(
  element: HTMLElement,
  expectedAttributes: Record<string, string>
): boolean {
  return Object.entries(expectedAttributes).every(([attr, value]) => {
    return element.getAttribute(attr) === value
  })
}

/**
 * Helper to simulate keyboard navigation
 */
export async function navigateWithKeyboard(
  element: HTMLElement,
  key: string
): Promise<void> {
  element.focus()
  await user.keyboard(`{${key}}`)
}

/**
 * Helper to test focus management
 */
export function expectFocusedElement(element: HTMLElement): void {
  expect(document.activeElement).toBe(element)
}

/**
 * Helper to test element visibility
 */
export function expectHidden(element: HTMLElement): void {
  expect(element).toHaveAttribute('hidden')
}

export function expectVisible(element: HTMLElement): void {
  expect(element).not.toHaveAttribute('hidden')
}

/**
 * Helper to test ARIA expanded state
 */
export function expectExpanded(element: HTMLElement): void {
  expect(element).toHaveAttribute('aria-expanded', 'true')
}

export function expectCollapsed(element: HTMLElement): void {
  expect(element).toHaveAttribute('aria-expanded', 'false')
}

/**
 * Helper to create a basic accordion structure for testing
 */
export function createAccordionElement(options: {
  itemCount?: number
  multiSelect?: boolean
  keyboard?: boolean
  animate?: boolean
  className?: string
} = {}): HTMLElement {
  const { 
    itemCount = 3, 
    multiSelect = false, 
    keyboard = true, 
    animate = false,
    className = 'accordion'
  } = options
  
  const accordion = createElement('div', { 
    class: className,
    'data-accordion': multiSelect ? 'multi' : 'single',
    'data-keyboard': keyboard.toString()
  })
  
  for (let i = 0; i < itemCount; i++) {
    const item = createElement('div', { class: 'item' })
    
    const control = createElement('button', {
      class: 'control chevron',
      'aria-expanded': 'false',
      'aria-controls': `content-${i}`
    }, `Item ${i + 1}`)
    
    const content = createElement('div', {
      class: 'content',
      id: `content-${i}`,
      hidden: '',
      ...(animate && { 'data-animate': 'accordion' })
    }, `Content for item ${i + 1}`)
    
    item.appendChild(control)
    item.appendChild(content)
    accordion.appendChild(item)
  }
  
  return accordion
}

/**
 * Helper to get accordion controls from accordion element
 */
export function getAccordionControls(accordion: HTMLElement): HTMLElement[] {
  return Array.from(accordion.querySelectorAll<HTMLElement>('.control'))
}

/**
 * Helper to get accordion content elements from accordion element
 */
export function getAccordionContents(accordion: HTMLElement): HTMLElement[] {
  return Array.from(accordion.querySelectorAll<HTMLElement>('.content'))
}

/**
 * Helper to get accordion items from accordion element
 */
export function getAccordionItems(accordion: HTMLElement): HTMLElement[] {
  return Array.from(accordion.querySelectorAll<HTMLElement>('.item'))
}

/**
 * Helper to simulate accordion keyboard navigation
 */
export async function navigateAccordion(
  startControl: HTMLElement,
  key: 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'Space' | 'Enter'
): Promise<void> {
  startControl.focus()
  await user.keyboard(`{${key}}`)
}

/**
 * Helper to test accordion state - returns which items are expanded
 */
export function getAccordionState(accordion: HTMLElement): boolean[] {
  const controls = getAccordionControls(accordion)
  return controls.map(control => control.getAttribute('aria-expanded') === 'true')
}

/**
 * Helper to expect specific accordion state
 */
export function expectAccordionState(
  accordion: HTMLElement, 
  expectedState: boolean[]
): void {
  const actualState = getAccordionState(accordion)
  expect(actualState).toEqual(expectedState)
}

/**
 * Helper to expect accordion item to be expanded
 */
export function expectAccordionItemExpanded(
  accordion: HTMLElement, 
  itemIndex: number
): void {
  const controls = getAccordionControls(accordion)
  const contents = getAccordionContents(accordion)
  
  if (itemIndex >= controls.length) {
    throw new Error(`Item index ${itemIndex} out of bounds`)
  }
  
  expectExpanded(controls[itemIndex])
  expectVisible(contents[itemIndex])
}

/**
 * Helper to expect accordion item to be collapsed
 */
export function expectAccordionItemCollapsed(
  accordion: HTMLElement, 
  itemIndex: number
): void {
  const controls = getAccordionControls(accordion)
  const contents = getAccordionContents(accordion)
  
  if (itemIndex >= controls.length) {
    throw new Error(`Item index ${itemIndex} out of bounds`)
  }
  
  expectCollapsed(controls[itemIndex])
  expectHidden(contents[itemIndex])
}

/**
 * Helper to simulate clicking an accordion item
 */
export async function clickAccordionItem(
  accordion: HTMLElement, 
  itemIndex: number
): Promise<void> {
  const controls = getAccordionControls(accordion)
  
  if (itemIndex >= controls.length) {
    throw new Error(`Item index ${itemIndex} out of bounds`)
  }
  
  await user.click(controls[itemIndex])
}

/**
 * Helper to create complex nested DOM structure for testing
 */
export function createNestedStructure(levels: number, className = 'level'): HTMLElement {
  let currentParent = createElement('div', { class: `${className}-0` })
  const root = currentParent
  
  for (let i = 1; i < levels; i++) {
    const newLevel = createElement('div', { class: `${className}-${i}` })
    currentParent.appendChild(newLevel)
    currentParent = newLevel
  }
  
  return root
}

/**
 * Helper to wait for accordion animations to complete
 */
export async function waitForAccordionAnimation(
  accordion: HTMLElement
): Promise<void> {
  const contents = getAccordionContents(accordion)
  
  await Promise.all(
    contents.map(content => waitForAnimation(content))
  )
}

// Re-export commonly used testing utilities
export { screen, within, userEvent, axe }