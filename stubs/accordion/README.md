# Accordion Copy Point

Accessible, expandable accordion component with full keyboard navigation, ARIA compliance, and customizable styling.

## Overview

The accordion copy-point provides a fully-featured accordion component with sophisticated expand/collapse functionality. Built with accessibility-first principles, it includes proper ARIA attributes, keyboard navigation, and smooth animations while maintaining excellent performance.

## Live Example

**[🌐 View Live Example](https://gherrink.github.io/copykit/accordion.html)** - See this copy point in action with interactive demonstrations.

## Features

- **Full Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Keyboard Navigation**: Complete keyboard support with arrow keys, Home/End, Space/Enter
- **Smooth Animations**: CSS-based animations with configurable timing
- **Flexible Structure**: Simplified HTML structure with direct child selectors
- **Customizable Styling**: Extensive CSS custom properties for theming
- **Single/Multi-Select**: Support for both single and multiple open items
- **Chevron Indicators**: Optional rotating chevron icons for visual feedback

## Usage

### Basic Usage

```html
<div class="accordion">
  <div class="item">
    <button class="control" aria-expanded="false" aria-controls="content-1">
      Accordion Header 1
    </button>
    <div class="content" id="content-1" hidden data-animate="accordion">
      <p>Accordion content goes here. This content is collapsible and accessible.</p>
    </div>
  </div>
  
  <div class="item">
    <button class="control" aria-expanded="false" aria-controls="content-2">
      Accordion Header 2
    </button>
    <div class="content" id="content-2" hidden data-animate="accordion">
      <p>Second accordion panel content.</p>
    </div>
  </div>
</div>
```

### Advanced Examples

```html
<!-- Single-select accordion with chevron indicators -->
<div class="accordion single-select">
  <div class="item">
    <button class="control chevron" aria-expanded="false" aria-controls="content-1" data-hide-same-level>
      Feature Overview
    </button>
    <div class="content" id="content-1" hidden data-animate="accordion">
      <p>Detailed feature information...</p>
    </div>
  </div>
  
  <div class="item">
    <button class="control chevron" aria-expanded="false" aria-controls="content-2" data-hide-same-level>
      Technical Details
    </button>
    <div class="content" id="content-2" hidden data-animate="accordion">
      <p>Technical implementation details...</p>
    </div>
  </div>
</div>
```

### CSS Integration

```css
/* Import accordion styles */
@import "./stubs/accordion/styles/02_components/accordion.css";
```

### JavaScript Integration

```javascript
// Import and initialize accordion functionality
import { expand } from "./stubs/_base/scripts/services/expand.js"

// Initialize accordion expand/collapse behavior
expand.init()

// Or initialize with specific container
expand.init(document.querySelector('.accordion'))
```

## CSS Architecture

### Custom Properties

The accordion component uses CSS custom properties for flexible customization:

```css
:root {
  /* Border and layout */
  --accordion-border-color: 220 220 220;
  --accordion-border-width: 1px;
  --accordion-border-radius: 0;
  
  /* Control styling */
  --accordion-control-bg-color: 248 248 248;
  --accordion-control-hover-bg-color: 240 240 240;
  
  /* Content styling */
  --accordion-content-bg-color: 255 255 255;
  
  /* Typography */
  --accordion-font-size: var(--font-size);
  
  /* Animation */
  --accordion-transition-time: var(--transition-base);
}
```

### Component Structure

Key CSS classes and their purposes:

- `.accordion` - Main accordion container
- `.accordion > .item` - Individual accordion item wrapper
- `.accordion > .item > .control` - Interactive toggle button
- `.accordion > .item > .content` - Collapsible content area
- `.accordion.single-select` - Single-select behavior styling
- `.control.chevron` - Chevron indicator variant

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add accordion
```

Or copy manually:
```bash
cp -r stubs/accordion/ your-project/src/
```

### Theme Integration

```css
/* Light theme */
:root {
  --accordion-border-color: 220 220 220;
  --accordion-control-bg-color: 248 248 248;
  --accordion-content-bg-color: 255 255 255;
}

/* Dark theme */
[data-theme="dark"] {
  --accordion-border-color: 64 64 64;
  --accordion-control-bg-color: 32 32 32;
  --accordion-content-bg-color: 24 24 24;
}
```

## Customization

### Component Variants

```css
/* Colored accordion themes */
.accordion.blue {
  --accordion-border-color: 59 130 246;
  --accordion-control-bg-color: 239 246 255;
  --accordion-control-hover-bg-color: 219 234 254;
}

.accordion.green {
  --accordion-border-color: 34 197 94;
  --accordion-control-bg-color: 240 253 244;
  --accordion-control-hover-bg-color: 220 252 231;
}

/* Size variants */
.accordion.large {
  --accordion-font-size: var(--font-size-lg);
  --control-py-space: var(--space-md);
  --control-px-space: var(--space-lg);
}

.accordion.compact {
  --accordion-font-size: var(--font-size-sm);
  --control-py-space: var(--space-xs);
  --control-px-space: var(--space-sm);
}
```

### Responsive Design

```css
/* Mobile-first responsive approach */
.accordion {
  --accordion-font-size: var(--font-size-sm);
  --control-py-space: var(--space-xs);
  --control-px-space: var(--space-sm);
}

@media (min-width: 768px) {
  .accordion {
    --accordion-font-size: var(--font-size-base);
    --control-py-space: var(--space-sm);
    --control-px-space: var(--space-base);
  }
}

@media (min-width: 1024px) {
  .accordion {
    --accordion-font-size: var(--font-size-md);
    --control-py-space: var(--space-base);
    --control-px-space: var(--space-md);
  }
}
```

### Animation Support

```css
/* Custom animation timing */
.accordion.slow {
  --accordion-transition-time: var(--transition-slow);
}

.accordion.fast {
  --accordion-transition-time: var(--transition-fast);
}

/* Rounded corners */
.accordion.rounded {
  --accordion-border-radius: 8px;
}

.accordion.rounded-lg {
  --accordion-border-radius: 12px;
}
```

## Browser Support

- **Modern browsers** with ES2020+ support
- **CSS Custom Properties** support required
- **ARIA** support for accessibility
- **CSS Grid/Flexbox** support for layout

### Fallback Patterns

```css
/* Fallback for browsers without custom properties */
.accordion {
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Enhanced styles for modern browsers */
@supports (border-color: rgb(var(--accordion-border-color))) {
  .accordion {
    border-color: rgb(var(--accordion-border-color));
    border-radius: var(--accordion-border-radius);
  }
}
```

## Performance Considerations

- **CSS Custom Properties**: Changes trigger repaints, not reflows
- **Animations**: Uses CSS transforms for smooth performance
- **Event Handling**: Efficient event delegation for large accordions
- **Memory Management**: Automatic cleanup of event listeners

## Best Practices

1. **Use semantic HTML** - Button elements for controls, proper heading structure
2. **Provide unique IDs** - Each content area needs a unique ID for aria-controls
3. **Test keyboard navigation** - Ensure all functionality works without mouse
4. **Consider screen readers** - Test with assistive technologies
5. **Progressive enhancement** - Ensure content is accessible without JavaScript
6. **Avoid nested accordions** - Can create confusing navigation patterns

## Common Patterns

### Utility Classes

```css
/* Quick styling utilities */
.accordion-bordered { --accordion-border-width: 2px; }
.accordion-borderless { --accordion-border-width: 0; }
.accordion-rounded { --accordion-border-radius: 8px; }
.accordion-shadow { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
```

### State Management

```html
<!-- Accordion with initial open state -->
<div class="accordion">
  <div class="item">
    <button class="control" aria-expanded="true" aria-controls="content-1">
      Initially Open
    </button>
    <div class="content" id="content-1" data-animate="accordion">
      This content is open by default.
    </div>
  </div>
</div>
```

### Integration with Other Copy-Points

```html
<!-- Accordion with elevation -->
<div class="accordion elevate" style="--level: 4;">
  <div class="item">
    <button class="control">Enhanced with elevation</button>
    <div class="content" id="content-1" hidden data-animate="accordion">
      Content with elevated styling
    </div>
  </div>
</div>
```

## Troubleshooting

### Common Issues

1. **Accordion not expanding**: Verify `aria-controls` matches the content `id`
2. **Animations not working**: Check that `data-animate="accordion"` is present
3. **Keyboard navigation not working**: Ensure expand service is initialized
4. **Styling not applying**: Verify CSS import paths and custom property names
5. **Multiple panels opening**: Add `data-hide-same-level` for single-select behavior

### Debug Mode

```css
/* Add debug styling to identify structure issues */
.accordion.debug > .item {
  outline: 2px solid red;
}

.accordion.debug > .item > .control {
  outline: 2px solid blue;
}

.accordion.debug > .item > .content {
  outline: 2px solid green;
}
```

### Accessibility Testing

```javascript
// Test accordion accessibility
const accordion = document.querySelector('.accordion')
const controls = accordion.querySelectorAll('.control')

// Verify ARIA attributes
controls.forEach(control => {
  console.log('aria-expanded:', control.getAttribute('aria-expanded'))
  console.log('aria-controls:', control.getAttribute('aria-controls'))
})
```

## Resources

- [WCAG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Keyboard Navigation Guidelines](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [CSS Animations Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance)