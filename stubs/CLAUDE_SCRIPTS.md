# TypeScript Development Guide for CopyKit

This guide provides essential patterns and standards for writing TypeScript functionality in CopyKit copy-points, extracted from the JavaScript architecture philosophy.

## Standard Copy-Point TypeScript Structure

TypeScript files in copy-points follow this organization:

```
stubs/[name]/scripts/
├── services/                    # Business logic and component behavior
│   ├── [name].ts               # Main service implementation
│   ├── [name].test.ts          # Unit tests
│   └── [name].accessibility.test.ts # Accessibility tests
└── utilities/                   # Helper functions and utilities
    ├── [utility].ts            # Utility implementation
    └── [utility].test.ts       # Utility tests
```

### Service vs Utility Guidelines

**Services** (`scripts/services/`):

- Component behavior and state management
- Event handling and user interaction
- DOM manipulation and ARIA management
- Complex business logic
- Example: `accordion.ts`, `expand.ts`, `modal.ts`

**Utilities** (`scripts/utilities/`):

- Pure functions and helper methods
- Data transformation and validation
- Reusable algorithms
- Simple DOM queries
- Example: `dom-utils.ts`, `validation.ts`, `formatters.ts`

## Core Architectural Principles

### 1. HTML Attributes Drive Everything

**Pattern**: Discover and configure components through HTML attributes, not CSS classes or JavaScript selectors.

```typescript
// ✅ Discover components by ARIA attributes
document.querySelectorAll('[aria-expanded]').forEach(element => {
  if (!element.__expand) {
    new Expand(element)
  }
})

// ✅ Configure via data attributes
const mode = element.getAttribute('data-accordion') // 'single' | 'multi'
const hasKeyboard = element.hasAttribute('data-keyboard')
```

**Benefits**:

- Self-documenting HTML
- Accessibility-first approach
- Framework-agnostic compatibility
- Components work without JavaScript

### 2. Store Instances on DOM Elements

**Pattern**: Store JavaScript instances directly on HTML elements they control.

```typescript
class Expand {
  constructor(element: HTMLElement) {
    this.element = element
    // Store instance on DOM element
    element.__expand = this
  }

  static getInstance(element: HTMLElement): Expand | null {
    return element.__expand || null
  }
}

// TypeScript declaration (add to global types)
declare global {
  interface HTMLElement {
    __expand?: Expand
    __accordion?: Accordion
    // Add other component types as needed
  }
}
```

**Benefits**:

- No memory leaks (garbage collected with DOM)
- Instant access without lookups
- Natural lifecycle management
- Prevents duplicate instances

### 3. ARIA Attributes as Source of Truth

**Pattern**: Use ARIA attributes for both accessibility and functional state.

```typescript
class Expand {
  get isExpanded(): boolean {
    return this.element.getAttribute('aria-expanded') === 'true'
  }

  set isExpanded(value: boolean) {
    this.element.setAttribute('aria-expanded', String(value))
    // Update controlled content visibility
    this.updateContent()
  }

  private updateContent(): void {
    const contentId = this.element.getAttribute('aria-controls')
    const content = contentId ? document.getElementById(contentId) : null

    if (content) {
      content.hidden = !this.isExpanded
    }
  }
}
```

**Benefits**:

- Single source of truth in DOM
- Screen reader compatibility
- Server-side rendering support
- Browser dev tools visibility

### 4. Progressive Enhancement Always

**Pattern**: Components must work without JavaScript, then be enhanced.

```typescript
// Base HTML (works without JS)
// <details>
//   <summary>Expandable Content</summary>
//   <div>This works without any JavaScript</div>
// </details>

// Enhanced version with TypeScript
class Expand {
  constructor(element: HTMLElement) {
    this.element = element
    this.init()
  }

  private init(): void {
    // Only enhance if element has required attributes
    const controlsId = this.element.getAttribute('aria-controls')
    if (!controlsId) return

    // Add event listeners for enhanced functionality
    this.element.addEventListener('click', this.handleClick.bind(this))
    this.element.addEventListener('keydown', this.handleKeydown.bind(this))
  }
}
```

## Event-Driven Communication

### Typed Event Emitter Pattern

```typescript
interface ExpandEvents {
  beforeToggle: (data: { element: HTMLElement; willExpand: boolean }) => void
  afterToggle: (data: { element: HTMLElement; isExpanded: boolean }) => void
  beforeExpand: (data: { element: HTMLElement }) => void
  afterExpand: (data: { element: HTMLElement }) => void
  beforeCollapse: (data: { element: HTMLElement }) => void
  afterCollapse: (data: { element: HTMLElement }) => void
}

class Expand extends EventEmitter<ExpandEvents> {
  toggle(): void {
    const willExpand = !this.isExpanded

    // Emit before event
    this.emit('beforeToggle', {
      element: this.element,
      willExpand,
    })

    // Perform action
    this.isExpanded = willExpand

    // Emit after event
    this.emit('afterToggle', {
      element: this.element,
      isExpanded: this.isExpanded,
    })
  }
}
```

### Service Composition Pattern

```typescript
class Accordion extends EventEmitter<AccordionEvents> {
  private expandInstances: Expand[] = []

  constructor(element: HTMLElement) {
    super()
    this.element = element
    this.initExpandInstances()
    this.bindEvents()
  }

  private initExpandInstances(): void {
    const controls = this.element.querySelectorAll('[aria-expanded]')

    this.expandInstances = Array.from(controls).map(control => {
      return Expand.getInstance(control as HTMLElement) || new Expand(control as HTMLElement)
    })
  }

  private bindEvents(): void {
    this.expandInstances.forEach(expand => {
      expand.on('beforeToggle', this.handleAccordionLogic.bind(this))
    })
  }

  private handleAccordionLogic(data: { willExpand: boolean; element: HTMLElement }): void {
    const mode = this.element.getAttribute('data-accordion')

    if (mode === 'single' && data.willExpand) {
      // Close other items in single mode
      this.expandInstances.forEach(instance => {
        if (instance.element !== data.element && instance.isExpanded) {
          instance.collapse()
        }
      })
    }
  }
}
```

## Initialization Patterns

### Automatic Discovery and Initialization

```typescript
// Service initialization function
export function initExpand(): void {
  document.querySelectorAll('[aria-expanded]').forEach(element => {
    if (!element.__expand) {
      new Expand(element as HTMLElement)
    }
  })
}

export function initAccordions(): void {
  document.querySelectorAll('[data-accordion]').forEach(element => {
    if (!element.__accordion) {
      new Accordion(element as HTMLElement)
    }
  })
}

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  initExpand()
  initAccordions()
})
```

### Configuration via HTML Attributes

```typescript
class Component {
  private config: ComponentConfig

  constructor(element: HTMLElement) {
    this.element = element
    this.config = this.parseConfig()
  }

  private parseConfig(): ComponentConfig {
    return {
      mode: (this.element.getAttribute('data-accordion') as 'single' | 'multi') || 'single',
      keyboard: this.element.hasAttribute('data-keyboard'),
      animate: this.element.getAttribute('data-animate') || null,
      inertSelector: this.element.getAttribute('data-inert') || null,
    }
  }
}

interface ComponentConfig {
  mode: 'single' | 'multi'
  keyboard: boolean
  animate: string | null
  inertSelector: string | null
}
```

## Testing Patterns

### Unit Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest'
import { Expand } from './expand'
import { createElement } from '@test/utils'

describe('Expand', () => {
  it('should toggle aria-expanded when clicked', () => {
    const button = createElement('button', {
      'aria-expanded': 'false',
      'aria-controls': 'content-1',
    })
    const expand = new Expand(button)

    button.click()

    expect(button.getAttribute('aria-expanded')).toBe('true')
  })

  it('should emit events during toggle', () => {
    const button = createElement('button', { 'aria-expanded': 'false' })
    const expand = new Expand(button)
    const listener = vi.fn()

    expand.on('beforeToggle', listener)
    expand.toggle()

    expect(listener).toHaveBeenCalledWith({
      element: button,
      willExpand: true,
    })
  })
})
```

### Accessibility Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import {
  createAccordionElement,
  expectAccessible,
  getAccordionControls,
  navigateAccordion,
} from '@test/utils'

describe('Accordion Accessibility', () => {
  it('should support keyboard navigation', async () => {
    const accordion = createAccordionElement({ itemCount: 3 })
    const controls = getAccordionControls(accordion)

    controls[0].focus()
    await navigateAccordion(controls[0], 'ArrowDown')

    expect(document.activeElement).toBe(controls[1])
    await expectAccessible(accordion)
  })

  it('should handle user preferences', async () => {
    const component = createComponent()

    // Test reduced motion
    document.documentElement.style.setProperty('--prefers-reduced-motion', '1')
    await testReducedMotionBehavior(component)

    // Test high contrast
    document.documentElement.style.setProperty('--prefers-contrast', 'high')
    await testHighContrastBehavior(component)
  })
})
```

## Memory Management

### Cleanup Patterns

```typescript
class Component extends EventEmitter {
  private cleanupFunctions: (() => void)[] = []

  constructor(element: HTMLElement) {
    super()
    this.element = element
    this.init()
  }

  private init(): void {
    // Add event listeners with cleanup tracking
    const handleClick = this.handleClick.bind(this)
    this.element.addEventListener('click', handleClick)
    this.cleanupFunctions.push(() => {
      this.element.removeEventListener('click', handleClick)
    })
  }

  destroy(): void {
    // Run all cleanup functions
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []

    // Remove instance from DOM element
    delete this.element.__component

    // Remove all event listeners
    this.removeAllListeners()
  }
}
```

## Code Quality Standards

### Error Handling

```typescript
class Component {
  private validateElement(): boolean {
    if (!this.element) {
      console.warn('Component: Invalid element provided')
      return false
    }

    const requiredAttribute = this.element.getAttribute('aria-controls')
    if (!requiredAttribute) {
      console.warn('Component: Missing required aria-controls attribute')
      return false
    }

    return true
  }

  private safeQuerySelector(selector: string): HTMLElement | null {
    try {
      return this.element.querySelector(selector)
    } catch (error) {
      console.warn(`Component: Invalid selector "${selector}"`, error)
      return null
    }
  }
}
```

### TypeScript Best Practices

```typescript
// Use strict type checking
interface StrictComponentConfig {
  readonly mode: 'single' | 'multi'
  readonly keyboard: boolean
  readonly animate: string | null
}

// Use readonly for immutable data
class Component {
  readonly element: HTMLElement
  private readonly config: StrictComponentConfig

  constructor(element: HTMLElement) {
    this.element = element
    this.config = Object.freeze(this.parseConfig())
  }
}

// Use generics for reusable patterns
abstract class BaseComponent<TEvents = {}> extends EventEmitter<TEvents> {
  abstract readonly componentName: string

  protected abstract init(): void
  protected abstract destroy(): void
}
```

## Framework Integration

### React/Vue Compatibility

```typescript
// Works with any framework that generates HTML attributes
class Component {
  static initializeFromReactRef(ref: React.RefObject<HTMLElement>): Component | null {
    return ref.current ? new Component(ref.current) : null
  }

  static initializeFromVueRef(ref: { value: HTMLElement | null }): Component | null {
    return ref.value ? new Component(ref.value) : null
  }
}

// React Hook example
function useExpand(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const instance = Expand.initializeFromReactRef(ref)
    return () => instance?.destroy()
  }, [ref])
}
```

## Integration with Copy-Point Workflow

### Creating TypeScript Components

When creating copy-points with TypeScript functionality:

1. **Use the automated script**: `pnpm run create-copy-point [name]`
2. **Implement services**: Add component logic in `scripts/services/`
3. **Add utilities**: Create helper functions in `scripts/utilities/`
4. **Write comprehensive tests**: Both unit and accessibility tests
5. **Follow initialization patterns**: Auto-discovery via HTML attributes
6. **Document accessibility features**: Include keyboard shortcuts and ARIA usage

### CSS and TypeScript Integration

For CSS integration patterns, see [CLAUDE_STYLE.md](CLAUDE_STYLE.md) which covers:

- How TypeScript services coordinate with CSS classes
- Data attribute patterns for configuration
- Animation and transition management
- Colorset integration for theming

## Accessibility Implementation Requirements

### Component-Level Accessibility Rules

When developing copy-points, components should handle their own specific accessibility behaviors:

**Required Component Patterns:**

- **ARIA Management**: Use `aria-expanded`, `aria-controls`, `aria-hidden`, `role` attributes appropriately
- **Keyboard Navigation**: Implement arrow keys, Home/End navigation, focus management
- **Semantic HTML**: Use proper HTML elements before adding ARIA attributes
- **Progressive Enhancement**: Ensure functionality works without JavaScript first
- **State Management**: Handle expanded/collapsed, active/inactive states accessibly

**Example Component Implementation:**

```typescript
// Service should manage ARIA attributes and keyboard behavior
class ComponentService {
  private element: HTMLElement

  init() {
    this.setupARIA()
    this.setupKeyboardNavigation()
    this.setupFocusManagement()
  }

  private setupARIA() {
    // Component manages its own ARIA attributes
    const control = this.element.querySelector('.control')
    const content = this.element.querySelector('.content')

    control.setAttribute('aria-expanded', 'false')
    control.setAttribute('aria-controls', content.id)
  }

  private setupKeyboardNavigation() {
    // Implement keyboard support
    this.element.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        this.navigateItems(event.key === 'ArrowDown' ? 1 : -1)
        event.preventDefault()
        break
      case 'Home':
      case 'End':
        this.navigateToEdge(event.key === 'Home')
        event.preventDefault()
        break
    }
  }
}
```

### Accessibility Testing Requirements

All copy-points with interactive elements must include comprehensive accessibility tests:

**Required Test Files:**

```
scripts/services/
├── [component].test.ts              # Unit functionality tests
└── [component].accessibility.test.ts # Accessibility compliance tests
```

**Accessibility Test Coverage:**

- **Keyboard Navigation**: Tab order, arrow keys, Home/End, Escape functionality
- **ARIA Compliance**: Verify `aria-expanded`, `aria-controls`, role attributes
- **Screen Reader Support**: Test with axe-core and manual screen reader testing
- **Focus Management**: Ensure proper focus indicators and focus trapping
- **User Preferences**: Test with `prefers-reduced-motion` and `prefers-contrast`

**Example Accessibility Test:**

```typescript
import { describe, it, expect } from 'vitest'
import { expectAccessible, expectExpanded } from '@test/utils'

describe('Component Accessibility', () => {
  it('should manage ARIA attributes correctly', async () => {
    const component = createComponent()
    const control = component.querySelector('.control')

    // Test initial ARIA state
    expect(control.getAttribute('aria-expanded')).toBe('false')

    // Test interaction
    control.click()
    expect(control.getAttribute('aria-expanded')).toBe('true')

    // Test accessibility compliance
    await expectAccessible(component)
  })

  it('should support keyboard navigation', async () => {
    const component = createComponent()
    const controls = component.querySelectorAll('.control')

    controls[0].focus()
    await keyboard.press('ArrowDown')

    expect(document.activeElement).toBe(controls[1])
  })
})
```

### Testing Requirements

- Unit tests for all public APIs
- **Accessibility tests for UI components** (required for interactive elements)
- Integration tests with `_base` dependencies
- Cross-browser compatibility validation
- **User preference testing** (reduced motion, high contrast)
- **Keyboard-only navigation testing**

## Base Utilities Quick Reference

The `@stubs/_base/scripts/` directory provides essential utilities that can be imported and used in copy-point development. These utilities follow CopyKit's architectural principles and provide type-safe, tested functionality.

### Available Base Utilities

#### EventEmitter (`utilities/event-emitter.ts`)

**Purpose**: Type-safe event system for component communication.

**Usage**:

```typescript
import { EventEmitter } from '@/_base/scripts/utilities/event-emitter'

interface ComponentEvents {
  stateChange: (data: { state: string; element: HTMLElement }) => void
}

class MyComponent extends EventEmitter<ComponentEvents> {
  constructor(element: HTMLElement) {
    super()
    this.emit('stateChange', { state: 'initialized', element })
  }
}

// Type-safe listening
const component = new MyComponent(element)
component.on('stateChange', data => {
  console.log(`State: ${data.state}`)
})
```

#### DOM Utilities (`utilities/dom.ts`)

**Purpose**: DOM readiness and CSS animation management.

**`ready(callback: () => void): void`** - DOM initialization:

```typescript
import { ready } from '@/_base/scripts/utilities/dom'

ready(() => {
  document.querySelectorAll('[data-my-component]').forEach(element => {
    new MyComponent(element as HTMLElement)
  })
})
```

**`animate(target: HTMLElement, animationName: string, entering: boolean, callback?: () => void): void`** - Vue.js-style animations:

```typescript
import { animate } from '@/_base/scripts/utilities/dom'

// Show with fade-enter-active, fade-enter-from, fade-enter-to classes
animate(element, 'fade', true)

// Hide with fade-leave-active, fade-leave-from, fade-leave-to classes
animate(element, 'fade', false, () => (element.hidden = true))
```

#### Cookie Utilities (`utilities/cookie.ts`)

**Purpose**: Secure browser cookie management.

**Usage**:

```typescript
import { cookieRead, cookieWrite } from '@/_base/scripts/utilities/cookie'

// Read cookie (returns null if not found)
const theme = cookieRead('user-theme') || 'light'

// Write session cookie
cookieWrite('user-prefs', JSON.stringify(prefs))

// Write persistent cookie (365 days)
cookieWrite('user-theme', 'dark', 365 * 24 * 60 * 60)
```

#### Select Utilities (`utilities/select.ts`)

**Purpose**: Type-safe parent element traversal.

**Usage**:

```typescript
import { queryParentSelector } from '@/_base/scripts/utilities/select'

// Find parent form (with type safety)
const form = queryParentSelector<HTMLFormElement>(element, 'form', 5)

// Find parent accordion
const accordion = queryParentSelector(element, '[data-accordion]')

// Context-aware component behavior
if (form) {
  form.addEventListener('submit', this.handleFormSubmit.bind(this))
}
```

#### Expand Service (`services/expand.ts`)

**Purpose**: ARIA-based expand/collapse with animation and accessibility.

**Usage**:

```typescript
import { Expand, initExpand } from '@/_base/scripts/services/expand'

// Auto-initialize all [aria-expanded] elements
initExpand()

// Manual initialization with events
const expandInstance = new Expand(button)
expandInstance.on('beforeToggle', data => {
  console.log(`Will ${data.expanded ? 'collapse' : 'expand'}`)
})

// Programmatic control
expandInstance.toggle()
```

**HTML**:

```html
<!-- Basic: aria-expanded + aria-controls -->
<button aria-expanded="false" aria-controls="content">Toggle</button>
<div id="content" hidden>Content</div>

<!-- With animation -->
<div id="content" hidden data-animate="fade">Animated content</div>

<!-- Modal with inert -->
<div id="modal" hidden data-inert="body > *:not(#modal)">Modal</div>
```

### Common Integration Patterns

**Combining Utilities**:

```typescript
import { EventEmitter } from '@/_base/scripts/utilities/event-emitter'
import { ready, animate } from '@/_base/scripts/utilities/dom'
import { cookieRead } from '@/_base/scripts/utilities/cookie'
import { queryParentSelector } from '@/_base/scripts/utilities/select'

class AdvancedComponent extends EventEmitter<ComponentEvents> {
  constructor(element: HTMLElement) {
    super()
    ready(() => this.init())
  }

  private init(): void {
    const theme = cookieRead('theme') || 'light'
    const form = queryParentSelector<HTMLFormElement>(this.element, 'form')

    this.element.addEventListener('click', () => {
      animate(this.element, 'highlight', true)
      this.emit('userInteraction', { element: this.element })
    })
  }
}
```

**Auto-Discovery Pattern**:

```typescript
import { ready } from '@/_base/scripts/utilities/dom'
import { initExpand } from '@/_base/scripts/services/expand'

export function initMyComponents(): void {
  ready(() => {
    initExpand() // Initialize dependencies first

    document.querySelectorAll('[data-my-component]').forEach(element => {
      if (!element.__myComponent) {
        new MyComponent(element as HTMLElement)
      }
    })
  })
}
```

## Key Development Rules

1. **Always use HTML attributes** for discovery and configuration
2. **Store instances on DOM elements** using `element.__componentName`
3. **Use ARIA attributes** as the source of truth for state
4. **Emit typed events** for component communication
5. **Write accessibility tests** alongside functionality tests
6. **Ensure progressive enhancement** - components work without JS
7. **Clean up resources** in destroy methods
8. **Use strict TypeScript** with proper error handling
9. **Make components framework-agnostic** through attribute-driven design
10. **Test both functionality and accessibility** comprehensively

## Copy-Point Development Standards

### TypeScript File Requirements

- Use strict TypeScript configuration
- Include comprehensive unit tests (`.test.ts`)
- Add accessibility tests for UI components (`.accessibility.test.ts`)
- Follow existing code patterns and conventions
- Implement proper error handling and validation
- Use typed EventEmitter for component communication
- Store instances on DOM elements for lifecycle management

### Service Implementation Pattern

```typescript
export class ComponentService extends EventEmitter<ComponentEvents> {
  readonly element: HTMLElement
  private config: ComponentConfig
  private cleanupFunctions: (() => void)[] = []

  constructor(element: HTMLElement) {
    super()
    this.element = element
    this.config = this.parseConfig()

    // Store instance on DOM element
    element.__component = this

    this.init()
  }

  static getInstance(element: HTMLElement): ComponentService | null {
    return element.__component || null
  }

  private init(): void {
    if (!this.validateElement()) return

    this.setupARIA()
    this.setupEventListeners()
    this.setupKeyboardNavigation()
  }

  destroy(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []
    delete this.element.__component
    this.removeAllListeners()
  }
}

// Initialization function
export function initComponent(): void {
  document.querySelectorAll('[data-component]').forEach(element => {
    if (!element.__component) {
      new ComponentService(element as HTMLElement)
    }
  })
}
```
