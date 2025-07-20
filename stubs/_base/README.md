# _base Copy Point - Core Foundation

The `_base` copy-point is the **essential foundation** that must be copied first. All other copy-points build upon this base. It provides the core styles, utilities, and services that create a consistent foundation for web projects.

## Overview

The `_base` copy-point contains:
- **CSS Layers**: Organized foundation styles following the cascade
- **JavaScript Services**: Interactive functionality with ARIA support
- **JavaScript Utilities**: Common helpers for DOM manipulation and data handling
- **Complete Foundation**: Everything needed to start building components

> **⚠️ Critical**: Always copy `_base` first before any other copy-point, as they all depend on these foundational styles and utilities.

## CSS Architecture

### Layer Organization

The CSS is organized into 4 layers that follow the natural cascade:

#### 1. Defaults (`01_defaults/`)
Foundation layer with browser resets and global settings:
- **`reset.css`** - Modern CSS reset with sensible defaults
- **`variables.css`** - Global CSS custom properties (colors, spacing, typography)
- **`properties.css`** - Core design token definitions
- **`typography.css`** - Base typography styles and font settings

#### 2. Components (`02_components/`)
Reusable UI components:
- **`button.css`** - Button styles with variants and states
- **`control.css`** - Interactive control elements (with expand/collapse support)
- **`image.css`** - Responsive image handling and aspect ratios

#### 3. Utilities (`03_utilities/`)
Single-purpose utility classes:
- **`aspect-ratio.css`** - Aspect ratio utilities
- **`background.css`** - Background utilities
- **`flex.css`** - Flexbox utilities
- **`gap.css`** - Gap utilities for flexbox and grid
- **`grid.css`** - CSS Grid utilities
- **`height.css`** - Height utilities
- **`hidden.css`** - Visibility utilities
- **`margin.css`** - Margin spacing utilities
- **`padding.css`** - Padding spacing utilities
- **`text.css`** - Text utilities (alignment, decoration, etc.)
- **`width.css`** - Width utilities
- **`wrapper.css`** - Container wrapper utilities

#### 4. Layouts (`04_layouts/`)
Page-level structural styles and accessibility overrides:
- **`body.css`** - Base body styles and global layout
- **`prefers-contrast.css`** - High contrast mode overrides for user preferences
- **`reduced-motion.css`** - Motion reduction overrides for user preferences

### Main Entry Point

The `styles/index.css` file is the **only** file that imports all CSS layers:

```css
@import url("./01_defaults/reset.css");
@import url("./01_defaults/variables.css");
@import url("./01_defaults/properties.css");
@import url("./01_defaults/typography.css");

@import url("./02_components/button.css");
@import url("./02_components/control.css");
@import url("./02_components/image.css");

@import url("./03_utilities/aspect-ratio.css");
@import url("./03_utilities/background.css");
@import url("./03_utilities/flex.css");
@import url("./03_utilities/gap.css");
@import url("./03_utilities/grid.css");
@import url("./03_utilities/height.css");
@import url("./03_utilities/hidden.css");
@import url("./03_utilities/margin.css");
@import url("./03_utilities/padding.css");
@import url("./03_utilities/text.css");
@import url("./03_utilities/width.css");
@import url("./03_utilities/wrapper.css");

@import url("./04_layouts/body.css");
@import url("./04_layouts/prefers-contrast.css");
@import url("./04_layouts/reduced-motion.css");
```

> **Note**: Only the `_base` copy-point includes `index.css`. Other copy-points contain individual layer files that extend the base.

## JavaScript Architecture

### Services (`scripts/services/`)

#### Expand Service (`expand.ts`)
Sophisticated expand/collapse functionality with full accessibility support:

**Features:**
- **ARIA Compliance**: Proper `aria-expanded` and `aria-controls` attributes
- **Animation Support**: CSS-based animations via `data-animate` attribute
- **Inert Management**: Manages `inert` attribute for accessibility
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Flexible Triggers**: Support for external triggers and multiple control patterns

**Usage:**
```javascript
import { expand } from './stubs/_base/scripts/services/expand.js'

// Initialize expand functionality
expand.init()

// Or initialize with specific containers
expand.init(document.querySelector('.my-container'))
```

**HTML Structure:**
```html
<button class="control" aria-expanded="false" aria-controls="content-1">
  Toggle Content
</button>
<div id="content-1" hidden data-animate="slide">
  Content to expand/collapse
</div>
```

### Utilities (`scripts/utilities/`)

#### Cookie Utility (`cookie.ts`)
Simple cookie read/write functionality:

```javascript
import { cookie } from './stubs/_base/scripts/utilities/cookie.js'

// Read cookie
const value = cookie.read('cookieName')

// Write cookie
cookie.write('cookieName', 'value', { days: 30 })
```

#### DOM Utility (`dom.ts`)
Common DOM manipulation helpers:

```javascript
import { dom } from './stubs/_base/scripts/utilities/dom.js'

// Find elements safely
const element = dom.find('.selector')
const elements = dom.findAll('.selector')

// Element utilities
dom.addClass(element, 'new-class')
dom.removeClass(element, 'old-class')
dom.toggleClass(element, 'toggle-class')
```

#### Event Emitter (`event-emitter.ts`)
Type-safe event emitter for component communication:

```javascript
import { EventEmitter } from './stubs/_base/scripts/utilities/event-emitter.js'

interface MyEvents {
  change: (value: string) => void
  error: (error: Error) => void
}

const emitter = new EventEmitter<MyEvents>()

emitter.on('change', (value) => console.log('Changed:', value))
emitter.emit('change', 'new value')
```

#### Select Utility (`select.ts`)
Parent element selection helper:

```javascript
import { selectParent } from './stubs/_base/scripts/utilities/select.js'

// Find parent element with specific selector
const parent = selectParent(element, '.parent-class')
```

## Integration Guide

### CSS Integration

Import the main CSS file in your project:

```css
/* Import all _base styles */
@import "./stubs/_base/styles/index.css";
```

Or import specific layers:

```css
/* Import specific parts */
@import "./stubs/_base/styles/01_defaults/variables.css";
@import "./stubs/_base/styles/02_components/button.css";
@import "./stubs/_base/styles/03_utilities/flex.css";
```

### JavaScript Integration

Import and initialize services and utilities:

```javascript
// Import services
import { expand } from "./stubs/_base/scripts/services/expand.js"

// Import utilities
import { cookie } from "./stubs/_base/scripts/utilities/cookie.js"
import { dom } from "./stubs/_base/scripts/utilities/dom.js"
import { EventEmitter } from "./stubs/_base/scripts/utilities/event-emitter.js"
import { selectParent } from "./stubs/_base/scripts/utilities/select.js"

// Initialize expand functionality
expand.init()

// Use utilities
const savedValue = cookie.read('preference')
const element = dom.find('.target')
```

## Customization

### CSS Custom Properties

The `_base` copy-point provides extensive CSS custom properties for theming:

```css
:root {
  /* Colors */
  --color-primary: 59 130 246;
  --color-secondary: 156 163 175;
  --color-accent: 239 68 68;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-base: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 250ms;
  --transition-slow: 350ms;
}
```

### Component Customization

Override CSS custom properties to customize components:

```css
/* Custom button theme */
.btn.custom {
  --btn-bg-color: var(--color-accent);
  --btn-text-color: var(--color-white);
  --btn-border-radius: 12px;
}

/* Custom control theme */
.control.custom {
  --control-bg-color: var(--color-primary);
  --control-text-color: var(--color-white);
  --control-hover-bg-color: var(--color-primary-dark);
}
```

## Accessibility Features

The `_base` copy-point implements a comprehensive accessibility system that respects user preferences while allowing component-specific customization.

### User Preference Handling

The accessibility system follows a layered approach:

1. **Components define their own accessibility behaviors** in their individual stylesheets
2. **Layout-level overrides** handle global user preference changes
3. **User preferences take precedence** over default component styles

### High Contrast Support (`prefers-contrast.css`)

Automatically adjusts the entire colorset system when users prefer high contrast:

```css
@media (prefers-contrast: more) {
  :root {
    --font-color: 0 0 0;
    --bg-color: 255 255 255;
    --border-color: 0 0 0;
    --accent-color: 0 0 0;
    /* ... complete colorset overrides */
  }
  
  .cs-primary {
    /* Inverted colorset for primary elements */
    --font-color: 255 255 255;
    --bg-color: 0 0 0;
    /* ... */
  }
}
```

**Benefits:**
- **System-wide consistency**: All components automatically respect high contrast
- **Colorset integration**: Works seamlessly with the existing colorset variables
- **Accessibility compliance**: Provides maximum contrast ratios for better readability

### Reduced Motion Support (`reduced-motion.css`)

Disables all animations and transitions when users prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}
```

**Benefits:**
- **Instant response**: All transitions are immediately disabled
- **Vestibular safety**: Prevents motion-triggered accessibility issues
- **Performance**: Eliminates unnecessary animations for users who don't want them

### Architecture Pattern

This approach ensures that:
- **Components remain flexible**: Each component can define specific accessibility behaviors
- **Global overrides work universally**: User preferences apply consistently across all components
- **No conflicts**: Layout-level overrides use CSS specificity to take precedence
- **Easy maintenance**: Accessibility changes are centralized in layout files

## Testing

The `_base` copy-point includes comprehensive tests:

- **Unit Tests**: Test individual utilities and services
- **Accessibility Tests**: Verify ARIA compliance and keyboard navigation
- **Integration Tests**: Test component interactions

Run tests with:
```bash
pnpm test
```

## Dependencies

The `_base` copy-point has **no external dependencies**. It uses only:
- Modern CSS features (custom properties, CSS Grid, Flexbox)
- Modern JavaScript (ES2020+, TypeScript)
- Web Standards (ARIA, semantic HTML)

> **Note**: As the foundation copy-point, `_base` is required by all other copy-points in the CopyKit system.

## Browser Support

- **Modern browsers** with ES2020+ support
- **CSS Grid** and **Flexbox** support required
- **CSS Custom Properties** support required
- **ARIA** support for accessibility

## Performance Considerations

- **CSS Custom Properties**: Changes trigger repaints, not reflows
- **JavaScript Services**: Lightweight utilities with minimal overhead
- **Event Handling**: Efficient event delegation and cleanup
- **Memory Management**: Automatic cleanup of event listeners and resources

## Best Practices

1. **Always start with _base**: Copy this foundation before any other copy-point
2. **Use CSS custom properties**: Customize through variables rather than overriding styles
3. **Follow ARIA patterns**: Use the expand service for accessible interactions
4. **Test accessibility**: Ensure keyboard navigation and screen reader support
5. **Respect user preferences**: Always test with high contrast and reduced motion settings
6. **Component-level accessibility**: Define accessibility behaviors in individual components, let layouts handle global overrides
7. **Progressive enhancement**: Build features that work without JavaScript first

## Next Steps

After integrating `_base`, you can add additional copy-points that build upon this foundation:

- **`accordion`** - Advanced accordion component
- **`elevate`** - Visual elevation utilities
- **Future copy-points** - All will integrate seamlessly with this base

## Resources

- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Modern CSS Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)