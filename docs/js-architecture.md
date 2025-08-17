# JavaScript Architecture Philosophy

This document explains the architectural decisions and usage patterns that drive CopyKit's JavaScript implementation. We focus on **why** we make certain choices and **how** developers actually use the system.

## Architectural Philosophy

CopyKit's JavaScript architecture is built around four core principles:

### 1. HTML Attributes Drive Everything

**Why**: We discover and configure components through HTML attributes, not CSS classes or JavaScript selectors. This creates a declarative, self-documenting system.

**How it works**:

```html
<!-- Component discovered by [aria-expanded] attribute -->
<button aria-expanded="false" aria-controls="content-1">Toggle</button>

<!-- Configuration via data attributes -->
<div class="accordion" data-accordion="single" data-keyboard="true"></div>
```

**Benefits**:

- **Self-documenting**: The HTML tells you exactly what JavaScript will do
- **Accessibility-first**: ARIA attributes serve dual purpose (a11y + functionality)
- **Framework-agnostic**: Works with any CSS framework or component library
- **No JavaScript required**: Components work semantically even without JS

### 2. Store Instances on DOM Elements

**Why**: Instead of maintaining external registries or maps, we store JavaScript instances directly on the HTML elements they control.

**How it works**:

```typescript
// Instance stored directly on the element
element.__expand = this

// Retrieved later without lookups
const instance = element.__expand
```

**Benefits**:

- **No memory leaks**: When DOM element is removed, instance is garbage collected
- **Instant access**: No expensive lookups or registry searches
- **Natural lifecycle**: Instance lives and dies with its DOM element
- **Prevents duplicates**: Easy to check if element already has an instance

### 3. ARIA Attributes Are the Source of Truth

**Why**: We use ARIA attributes both for accessibility and as the functional state of components.

**How it works**:

```html
<!-- State determined by aria-expanded -->
<button aria-expanded="false">Collapsed</button>
<button aria-expanded="true">Expanded</button>
```

**Benefits**:

- **Single source of truth**: State lives in the DOM, not JavaScript variables
- **Accessibility built-in**: Screen readers get the same information as our scripts
- **Server-side compatible**: Initial state can be set server-side
- **Debugging friendly**: State is visible in browser dev tools

### 4. Progressive Enhancement Always

**Why**: Components must work without JavaScript, then be enhanced with interactivity.

**Base HTML (works without JS)**:

```html
<details>
  <summary>Expandable Content</summary>
  <div>This works without any JavaScript</div>
</details>
```

**Enhanced version**:

```html
<button aria-expanded="false" aria-controls="content">Enhanced Toggle</button>
<div id="content" hidden>Enhanced with animations and keyboard support</div>
```

## How Components Are Discovered and Initialized

### Automatic Discovery Pattern

Instead of manually initializing components, we use a scan-and-enhance pattern:

```typescript
// Scan for elements with aria-expanded attribute
document.querySelectorAll('[aria-expanded]').forEach(element => {
  if (!element.__expand) {
    // Check if already initialized
    new Expand(element) // Create and store instance
  }
})
```

**Why this works**:

- **Zero configuration**: Just add the right HTML attributes
- **Idempotent**: Safe to run multiple times
- **Framework-friendly**: Works with any rendering system
- **Performance**: Only processes elements that need enhancement

### Component Configuration via HTML

All component behavior is configured through HTML attributes:

```html
<!-- Single-select accordion with keyboard navigation -->
<div class="accordion" data-accordion="single" data-keyboard="true">
  <div class="item">
    <button aria-expanded="false" aria-controls="item-1">Item 1</button>
    <div id="item-1" hidden data-animate="accordion">Content 1</div>
  </div>
</div>
```

**Configuration attributes we use**:

- `aria-expanded` - Triggers expand/collapse functionality
- `aria-controls` - Links controls to their target content
- `data-accordion="single|multi"` - Sets accordion mode
- `data-keyboard="true"` - Enables keyboard navigation
- `data-animate="name"` - Adds transition animations
- `data-inert="selector"` - Controls focus management

## Event-Driven Communication

### Why Events Instead of Direct Method Calls

Components communicate through events rather than direct method calls. This creates loose coupling and allows for complex behaviors.

**Example**: When an accordion item opens, it broadcasts events:

```typescript
// Before the action
this.emit('beforeExpand', { element: this.element })

// After the action
this.emit('afterExpand', { element: this.element })
```

**Benefits**:

- **Multiple listeners**: Many services can react to the same event
- **Loose coupling**: Components don't need to know about each other
- **Extensibility**: Add new behavior without modifying existing code
- **Debugging**: Clear audit trail of what's happening

### How Services Coordinate

Related services build on each other through composition:

```typescript
// Accordion service builds on Expand service
class Accordion {
  constructor(element) {
    // Find all expand instances within this accordion
    this.expandInstances = controls.map(control => {
      return Expand.getInstance(control) || new Expand(control)
    })

    // Listen to their events and add accordion-specific behavior
    this.expandInstances.forEach(expand => {
      expand.on('beforeToggle', this.handleAccordionLogic)
    })
  }
}
```

## Copy-Point Development Workflow

### How Developers Actually Use the System

**1. Start with Working HTML** Begin with semantic HTML that works without JavaScript:

```html
<details>
  <summary>Basic Expandable</summary>
  <div>This works in any browser</div>
</details>
```

**2. Enhance with ARIA** Add ARIA attributes to enable JavaScript enhancement:

```html
<button aria-expanded="false" aria-controls="content-1">Enhanced Expandable</button>
<div id="content-1" hidden>Now supports animations and keyboard navigation</div>
```

**3. Add Configuration** Use data attributes to configure behavior:

```html
<div class="accordion" data-accordion="single">
  <button aria-expanded="false" aria-controls="item-1" data-animate="accordion">
    Accordion Item
  </button>
  <div id="item-1" hidden>Content with animations</div>
</div>
```

**4. Initialize Once** Run the initialization script:

```typescript
import { initExpand } from '@/_base/scripts/services/expand'
import { initAccordions } from '@/accordion/scripts/services/accordion'

document.addEventListener('DOMContentLoaded', () => {
  initExpand() // Finds all [aria-expanded] elements
  initAccordions() // Finds all .accordion elements
})
```

### What This Approach Gives You

**For HTML Authors**:

- Components work immediately with correct attributes
- No JavaScript knowledge required for basic usage
- Behavior is self-documenting in the HTML

**For JavaScript Developers**:

- Easy to extend existing components with new behavior
- Clear separation between structure (HTML) and behavior (JS)
- Components are testable in isolation

**For Framework Users**:

- Works with React, Vue, Angular, or vanilla JS
- Server-side rendering compatible
- Can be enhanced at any point in the component lifecycle

## Why This Architecture Supports Copy-and-Customize

### Framework Agnostic by Design

The HTML-attribute approach means components work regardless of how the HTML is generated:

```html
<!-- Works in React -->
<button aria-expanded="{isExpanded}" aria-controls="content">React Component</button>

<!-- Works in Vue -->
<button :aria-expanded="isExpanded" aria-controls="content">Vue Component</button>

<!-- Works in vanilla HTML -->
<button aria-expanded="false" aria-controls="content">Static HTML</button>
```

### Easy to Customize and Extend

Since behavior is driven by HTML attributes, you can:

**Customize by changing attributes**:

```html
<!-- Change from single to multi-select -->
<div data-accordion="multi">
  <!-- was "single" -->

  <!-- Add keyboard navigation -->
  <div data-keyboard="true">
    <!-- Change animation -->
    <div data-animate="slide"><!-- was "fade" --></div>
  </div>
</div>
```

**Extend by adding event listeners**:

```typescript
// Add custom behavior to any accordion
const accordion = Accordion.getInstance(element)
accordion.on('itemOpen', data => {
  // Your custom logic here
  analytics.track('accordion_opened', { item: data.index })
})
```

### Copy Points Work Independently

Each copy-point is self-contained but builds on shared utilities:

```
_base/           ← Core utilities (DOM, events, cookies)
  ↓
accordion/       ← Uses _base utilities + Expand service
  ↓
advanced-accordion/  ← Could build on accordion for more features
```

This allows developers to:

- **Copy only what they need**: Start with basic expand/collapse
- **Add features incrementally**: Upgrade to full accordion when needed
- **Customize without breaking**: Modify CSS and HTML independently
- **Maintain compatibility**: Services coordinate through events, not tight coupling

## Testing Philosophy

### Why We Test Both Functionality and Accessibility Together

Instead of treating accessibility as an afterthought, we test it alongside functionality:

**Functionality test** (`.test.ts`):

```typescript
it('should toggle aria-expanded when clicked', () => {
  const button = createElement('button', { 'aria-expanded': 'false' })
  const expand = new Expand(button)

  button.click()

  expect(button.getAttribute('aria-expanded')).toBe('true')
})
```

**Accessibility test** (`.accessibility.test.ts`):

```typescript
it('should support keyboard navigation', async () => {
  const accordion = createAccordionElement()
  const controls = getAccordionControls(accordion)

  controls[0].focus()
  await keyboard.press('ArrowDown')

  expect(document.activeElement).toBe(controls[1])
  await expectAccessible(accordion) // Runs axe-core
})
```

### Benefits of This Dual Approach

- **Functionality and accessibility in sync**: Both are tested as core features
- **Real user scenarios**: Tests match how users actually interact with components
- **Automated WCAG compliance**: axe-core catches violations automatically
- **Keyboard-first testing**: Ensures components work for all input methods

## Key Architectural Decisions Summary

### What Makes This Different

**1. HTML Attributes, Not CSS Classes**

```html
<!-- ❌ Typical JavaScript approach -->
<div class="js-accordion js-single js-keyboard">
  <!-- ✅ Our approach -->
  <div data-accordion="single" data-keyboard="true"></div>
</div>
```

**Why**: HTML attributes are semantic and self-documenting. CSS classes should be for styling, not behavior.

**2. Store on DOM, Not in Maps**

```typescript
// ❌ Typical approach
const componentRegistry = new Map<string, Component>()

// ✅ Our approach
element.__component = this
```

**Why**: Natural lifecycle management. When element is removed, instance is garbage collected automatically.

**3. ARIA Drives State, Not JavaScript Variables**

```typescript
// ❌ Typical approach
private isExpanded = false

// ✅ Our approach
get isExpanded() {
  return this.element.getAttribute('aria-expanded') === 'true'
}
```

**Why**: Single source of truth. Screen readers and JavaScript see the same state.

**4. Progressive Enhancement First**

```html
<!-- Works without JavaScript -->
<details>
  <summary>Content</summary>
  <div>Always accessible</div>
</details>

<!-- Enhanced with JavaScript -->
<button aria-expanded="false" aria-controls="content">Enhanced</button>
<div id="content" hidden data-animate="slide">With animations</div>
```

**Why**: Graceful degradation ensures components work for everyone.

### The Copy-and-Customize Philosophy

This architecture directly supports copying components into any project:

- **No build dependencies**: TypeScript compiles to standard JavaScript
- **No framework lock-in**: Works with any HTML generation method
- **No complex setup**: Add attributes to HTML, run one init function
- **Customizable behavior**: Change attributes to change functionality
- **Extensible**: Add event listeners for custom behavior

The result is components that developers can truly copy, understand, and customize without becoming CopyKit experts.
