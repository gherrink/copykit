# HTML Dialog Modal Copy Point

Accessible modal component using native HTML dialog element with focus management, keyboard navigation, and proper scrolling container support.

**[Live Example →](https://copykit.dev/modal/)** - Interactive demo with backdrop testing

## Overview

The modal copy-point provides a fully-featured modal dialog component built on the native HTML `<dialog>` element. It combines modern web standards with comprehensive accessibility features, offering both modal and non-modal dialog functionality with sophisticated focus management, keyboard navigation, and responsive design.

## Features

- **Native HTML Dialog**: Built on the native `<dialog>` element for maximum browser compatibility
- **Focus Management**: Automatic focus restoration and intelligent focus targeting
- **Keyboard Navigation**: ESC key closing, Tab cycling, and proper focus trapping
- **Multiple Variants**: Small, large, fullscreen, and simple modal configurations
- **Scrolling Container**: Proper scroll handling with fixed header/footer
- **Event System**: Type-safe event emitters for beforeOpen, afterOpen, beforeClose, afterClose
- **Backdrop Control**: Configurable backdrop click-to-close behavior
- **Theme Integration**: Full colorset variable integration for consistent theming
- **WCAG 2.1 AA Compliant**: Meets accessibility guidelines with proper ARIA support

## Usage

### Basic Modal Structure

```html
<dialog class="modal" id="example-modal">
  <header class="header">
    <h2 class="headline">Modal Title</h2>
    <button class="control close" aria-label="Close modal">×</button>
  </header>
  <div class="content">
    <p>Modal content goes here. This area is scrollable if content overflows.</p>
  </div>
  <footer class="footer">
    <button type="button" class="btn">Cancel</button>
    <button type="button" class="btn primary">Confirm</button>
  </footer>
</dialog>
```

### Simple Modal (No Header/Footer)

```html
<dialog class="modal modal-simple">
  <button class="control close" aria-label="Close modal">×</button>
  <h3 class="headline">Quick Message</h3>
  <p>Short content that doesn't need scrolling.</p>
  <button class="btn primary mt">Got it</button>
</dialog>
```

### Modal Variants

```html
<!-- Small modal for confirmations -->
<dialog class="modal modal-small">
  <header class="header">
    <h3 class="headline">Confirm Delete</h3>
    <button class="control close" aria-label="Close">×</button>
  </header>
  <div class="content">
    <p>Are you sure you want to delete this item?</p>
  </div>
  <footer class="footer">
    <button class="btn">Cancel</button>
    <button class="btn primary">Delete</button>
  </footer>
</dialog>

<!-- Large modal for complex forms -->
<dialog class="modal modal-large">
  <header class="header">
    <h2 class="headline">Settings</h2>
    <button class="control close" aria-label="Close">×</button>
  </header>
  <div class="content">
    <!-- Complex form content that may need scrolling -->
  </div>
  <footer class="footer">
    <button class="btn">Cancel</button>
    <button class="btn primary">Save</button>
  </footer>
</dialog>

<!-- Fullscreen modal -->
<dialog class="modal modal-fullscreen">
  <header class="header">
    <h1 class="headline">Fullscreen View</h1>
    <button class="control close" aria-label="Close">×</button>
  </header>
  <div class="content">
    <p>This modal fills the entire viewport</p>
  </div>
</dialog>
```

### CSS Integration

```css
/* Import modal styles */
@import "./stubs/modal/styles/02_components/modal.css";
```

### JavaScript Integration

```typescript
// Import modal functionality
import { createModal, initModals } from "./stubs/modal/scripts/services/modal"

// Auto-initialize all modals on page
initModals()

// Or create specific modal instance
const modal = createModal('#my-modal', {
  backdropClose: true,
  escapeClose: true,
  onOpen: (element) => console.log('Modal opened'),
  onClose: (element, returnValue) => console.log('Modal closed:', returnValue)
})

// Open as modal
modal.openModal()

// Open as non-modal
modal.openNonModal()

// Close with return value
modal.close('confirmed')

// Event listening
modal.on('afterClose', (data) => {
  console.log('Modal closed with value:', data.returnValue)
})
```

### Configuration via Data Attributes

```html
<dialog class="modal" 
        data-modal="center"
        data-modal-backdrop="true"
        data-modal-escape="true"
        data-modal-focus=".btn.primary">
  <!-- Modal content -->
</dialog>
```

## CSS Architecture

### Custom Properties

The modal component uses CSS custom properties for flexible customization:

```css
.modal {
  /* Modal sizing and positioning */
  --modal-max-width: 600px;
  --modal-max-height: 90vh;
  --modal-padding: var(--space-md);
  --modal-border-radius: 8px;
  --modal-border-width: 1px;
  --modal-separator-width: 1px;
  
  /* Modal colors (inherit from colorset) */
  --modal-bg-color: var(--bg-color);
  --modal-font-color: var(--font-color);
  --modal-border-color: var(--border-color);
  --modal-shadow-color: var(--shadow-color);
  --modal-shadow-alpha: var(--shadow-alpha);
  
  /* Selection colors using modal colorset */
  --selection-color: var(--modal-bg-color);
  --selection-bg-color: var(--modal-font-color);
}
```

### Component Structure

Key CSS classes and their purposes:

- `.modal` - Main dialog container with flexbox layout
- `.modal > .header` - Fixed header area with title and close button
- `.modal > .content` - Scrollable content area (the actual scroll container)
- `.modal > .footer` - Fixed footer area with action buttons
- `.modal > .header > .headline` - Modal title using existing headline styles
- `.modal > .header > .control.close` - Close button using existing control styles
- `.modal::backdrop` - Backdrop styling with colorset integration

### Modal Variants

- `.modal.modal-small` - Compact modal (400px max-width, 60vh max-height)
- `.modal.modal-large` - Large modal (800px max-width, 95vh max-height)
- `.modal.modal-fullscreen` - Full viewport modal (100vw × 100vh)
- `.modal.modal-simple` - Simple modal without header/footer structure

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add modal
```

Or copy manually:
```bash
cp -r stubs/modal/ your-project/src/
```

### Theme Integration

The modal automatically inherits colorset variables from the base theme:

```css
/* Modal automatically uses base colorset */
.modal {
  --modal-bg-color: var(--bg-color);
  --modal-font-color: var(--font-color);
  --modal-border-color: var(--border-color);
  --modal-shadow-color: var(--shadow-color);
  --modal-shadow-alpha: var(--shadow-alpha);
}

/* Custom brand theme override */
.modal.brand {
  --modal-bg-color: var(--brand-bg-color);
  --modal-font-color: var(--brand-font-color);
  --modal-border-color: var(--brand-accent-color);
}
```

## JavaScript API

### Modal Class

```typescript
interface ModalOptions {
  backdropClose?: boolean      // Enable backdrop click to close (default: true)
  escapeClose?: boolean        // Enable ESC key to close (default: true)
  restoreFocus?: boolean       // Restore focus on close (default: true)
  focusTarget?: string         // Selector for initial focus target
  onOpen?: (element: HTMLDialogElement) => void
  onClose?: (element: HTMLDialogElement, returnValue?: string) => void
}

const modal = new Modal(dialogElement, options)
```


## Accessibility Features

- **WCAG 2.1 AA Compliant** - Meets accessibility guidelines
- **Keyboard Navigation** - Full keyboard support with ESC, Tab cycling
- **Screen Reader Support** - Proper ARIA attributes and semantic HTML
- **Focus Management** - Intelligent focus targeting and restoration
- **Native Dialog Benefits** - Automatic focus trapping and backdrop behavior
- **High Contrast Support** - Automatic colorset adjustments
- **Reduced Motion Support** - Respects user motion preferences

### Keyboard Shortcuts

- **ESC** - Close modal (when escapeClose is enabled)
- **Tab/Shift+Tab** - Navigate between focusable elements within modal
- **Enter/Space** - Activate buttons and controls
- **Click outside** - Close modal (when backdropClose is enabled)

## Customization

### Size Variants

```css
.modal.tiny {
  --modal-max-width: 300px;
  --modal-max-height: 40vh;
}

.modal.huge {
  --modal-max-width: 1200px;
  --modal-max-height: 98vh;
}
```

### Responsive Design

```css
/* Mobile-first responsive approach */
.modal {
  width: 95vw;
  --modal-max-width: 400px;
}

@media (min-width: 768px) {
  .modal {
    width: 90vw;
    --modal-max-width: 600px;
  }
}

@media (min-width: 1024px) {
  .modal {
    width: 80vw;
    --modal-max-width: 800px;
  }
}
```

### Animation Support

```css
/* Smooth backdrop transitions */
.modal::backdrop {
  background: rgb(var(--modal-shadow-color) / 0);
  transition: background 0.2s ease;
}

.modal[open]::backdrop {
  background: rgb(var(--modal-shadow-color) / var(--modal-shadow-alpha));
}

/* Modal entrance animation - add manually if needed */
.modal {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal[open] {
  opacity: 1;
  transform: scale(1);
}

/* Note: Modal CSS includes reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
  .modal::backdrop {
    transition: none;
  }
}

/* High contrast support is built-in */
@media (prefers-contrast: more) {
  .modal {
    --modal-font-color: 0 0 0;
    --modal-bg-color: 255 255 255;
    --modal-border-color: 0 0 0;
    --modal-shadow-color: 0 0 0;
    --modal-shadow-alpha: 1;
  }
}
```

## Browser Support

- **HTML Dialog Element**: Chrome 37+, Firefox 98+, Safari 15.4+
- **CSS `::backdrop` Pseudo-element**: Chrome 37+, Firefox 47+, Safari 15.4+
- **CSS Custom Properties in `::backdrop`**: Chrome 122+ (inheritance support)
- **`showModal()` Method**: Chrome 37+, Firefox 98+, Safari 15.4+
- **Flexbox Layout**: All modern browsers
- **ES2020+ JavaScript**: All modern browsers

### Backdrop Support Notes

The `::backdrop` pseudo-element has evolving support:

- **Chrome 122+**: Full CSS custom property inheritance support in `::backdrop`
- **Chrome 37-121**: Basic `::backdrop` support but limited CSS variable inheritance
- **Firefox**: `::backdrop` supported but animations may not work consistently
- **Safari**: Full `::backdrop` support in recent versions

**Important**: The backdrop only appears when the dialog is opened with `dialog.showModal()`, not with the `open` attribute.

### Fallback Patterns

```css
/* Fallback for browsers without dialog support */
@supports not (display: dialog) {
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
}

/* Backdrop fallback using box-shadow for older browsers */
@supports not selector(::backdrop) {
  .modal {
    box-shadow: 0 0 0 100vmax rgb(0 0 0 / 50%);
  }
}

/* Alternative: Polyfill support for .backdrop class */
.modal + .backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
  z-index: -1;
}
```

## Performance Considerations

- **Native Dialog**: Leverages browser's native focus management and backdrop
- **CSS Custom Properties**: Efficient theming without style recalculation
- **Event Delegation**: Minimal event listeners for optimal performance
- **Memory Management**: Automatic cleanup with destroy() method
- **Scroll Optimization**: Proper scroll containers prevent layout thrashing

## Best Practices

1. **Use Semantic HTML** - Leverage native dialog element and semantic structure
2. **Focus Management** - Always provide clear focus targets and restoration
3. **Escape Routes** - Provide multiple ways to close the modal
4. **Content Structure** - Use header, content, footer pattern for consistency
5. **Responsive Design** - Test on various screen sizes and orientations
6. **Accessibility Testing** - Test with keyboard-only navigation and screen readers
7. **Performance** - Monitor for memory leaks with destroy() method

## Common Patterns

### Form Integration

```html
<dialog class="modal">
  <header class="header">
    <h2 class="headline">Contact Form</h2>
    <button class="control close" aria-label="Close">×</button>
  </header>
  <div class="content">
    <form id="contact-form">
      <label for="name">Name:</label>
      <input type="text" id="name" required>
      
      <label for="email">Email:</label>
      <input type="email" id="email" required>
      
      <label for="message">Message:</label>
      <textarea id="message" required></textarea>
    </form>
  </div>
  <footer class="footer">
    <button type="button" class="btn">Cancel</button>
    <button type="submit" form="contact-form" class="btn primary">Send</button>
  </footer>
</dialog>
```

### Dynamic Content Loading

```typescript
const modal = createModal('#dynamic-modal')

modal.on('beforeOpen', async () => {
  const content = modal.element.querySelector('.content')
  content.innerHTML = '<p>Loading...</p>'
  
  try {
    const data = await fetch('/api/content').then(r => r.json())
    content.innerHTML = `<p>${data.message}</p>`
  } catch (error) {
    content.innerHTML = '<p>Failed to load content</p>'
  }
})
```

### Integration with Other Copy-Points

```html
<!-- Modal with elevation and shadow -->
<dialog class="modal elevate" style="--level: 8;">
  <header class="header">
    <h2 class="headline">Enhanced Modal</h2>
    <button class="control close px py" aria-label="Close">×</button>
  </header>
  <div class="content wrapper">
    <!-- Uses existing wrapper utility -->
    <p>Enhanced with elevation and spacing utilities</p>
  </div>
  <footer class="footer">
    <div class="flex gap justify-end">
      <!-- Uses existing flex utilities -->
      <button class="btn">Cancel</button>
      <button class="btn primary">Confirm</button>
    </div>
  </footer>
</dialog>
```

## Troubleshooting

### Common Issues

1. **Modal not opening**: Check that dialog element exists and createModal() is called correctly
2. **Focus not restoring**: Ensure restoreFocus option is enabled and previous element exists
3. **Backdrop not working**: Verify backdropClose option and native dialog support
4. **Scrolling issues**: Check that content is placed in `.content` div, not directly in dialog
5. **ESC key not working**: Confirm escapeClose option is enabled and no other handlers prevent default

### Debug Mode

```typescript
// Enable debug logging
const modal = createModal('#debug-modal', {
  onOpen: (element) => console.log('Modal opened:', element),
  onClose: (element, returnValue) => console.log('Modal closed:', element, returnValue)
})

// Listen to all events
modal.on('beforeOpen', (data) => console.log('Before open:', data))
modal.on('afterOpen', (data) => console.log('After open:', data))
modal.on('beforeClose', (data) => console.log('Before close:', data))
modal.on('afterClose', (data) => console.log('After close:', data))
```

## Resources

- [HTML Dialog Element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WCAG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Focus Management Best Practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [CopyKit Colorset System](../README.md#colorset-system)
