# Rounded Simple Copy Point

Simple and flexible border radius utilities with CSS custom properties for creating rounded corners on any element.

## Overview

The Rounded Simple copy-point provides a comprehensive set of utility classes for applying border radius to elements. It uses CSS custom properties to enable flexible customization and supports everything from subtle rounded corners to full circles and pill shapes.

## Features

- Configurable border radius sizes (sm, base, md, lg, xl)
- CSS custom properties for per-corner customization
- Utility classes for common rounding patterns
- Full circle and pill-shaped element support
- Responsive and themeable design

## Dependencies

This copy-point has no additional dependencies beyond the core `_base` foundation.

## Usage

### Basic Usage

```html
<!-- Basic rounded corners -->
<div class="rounded padding bg">Rounded corners</div>

<!-- Size variations -->
<div class="rounded-sm padding bg">Small rounded</div>
<div class="rounded-md padding bg">Medium rounded</div>
<div class="rounded-lg padding bg">Large rounded</div>
<div class="rounded-xl padding bg">Extra large rounded</div>
```

### Advanced Examples

```html
<!-- Full circle for icons or avatars -->
<div class="rounded-full padding bg" style="width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center;">●</div>

<!-- Remove rounding -->
<div class="rounded-none padding bg">No rounded corners</div>

<!-- Custom per-corner rounding -->
<div class="rounded padding bg" style="--rounded-size-tl: 0; --rounded-size-br: 0;">
  Diagonal corners only
</div>
```

### CSS Integration

```css
/* Import the rounded utilities */
@import "./stubs/rounded-simple/styles/03_utilities/rounded.css";
```

## CSS Architecture

### Custom Properties

The rounded utilities use CSS custom properties for flexible customization:

```css
:root {
  /* Base unit for all rounded calculations */
  --rounded-unit: 1em;
  
  /* Size multipliers for different scales */
  --rounded-sm: 0.125;
  --rounded-base: 0.25;
  --rounded-md: 0.375;
  --rounded-lg: 0.5;
  --rounded-xl: 0.75;
  
  /* Per-corner size controls */
  --rounded-size-tl: 0.25; /* top-left */
  --rounded-size-tr: 0.25; /* top-right */
  --rounded-size-bl: 0.25; /* bottom-left */
  --rounded-size-br: 0.25; /* bottom-right */
}
```

### Component Structure

Key CSS classes and their purposes:

- `.rounded` - Base rounded corners using default size
- `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-xl` - Size variations
- `.rounded-full` - Full circle/pill shape (9999px radius)
- `.rounded-none` - Remove all border radius

## Integration Guide

### Installation

Use the WebBase CLI:
```bash
webbase add rounded-simple
```

Or copy manually:
```bash
cp -r stubs/rounded-simple/ your-project/src/
```

### Theme Integration

```css
/* Customize the base unit for your design system */
:root {
  --rounded-unit: 0.5rem; /* Smaller base unit */
}

/* Or use larger units for a more rounded design */
:root {
  --rounded-unit: 1.5rem;
}
```

## Customization

### Custom Rounded Sizes

```css
/* Add custom size variations */
.rounded-2xl {
  --rounded-size-tl: 1;
  --rounded-size-tr: 1;
  --rounded-size-br: 1;
  --rounded-size-bl: 1;
}

.rounded-3xl {
  --rounded-size-tl: 1.5;
  --rounded-size-tr: 1.5;
  --rounded-size-br: 1.5;
  --rounded-size-bl: 1.5;
}
```

### Per-Corner Customization

```css
/* Custom corner patterns */
.rounded-top {
  --rounded-size-tl: var(--rounded-base);
  --rounded-size-tr: var(--rounded-base);
  --rounded-size-bl: 0;
  --rounded-size-br: 0;
}

.rounded-bottom {
  --rounded-size-tl: 0;
  --rounded-size-tr: 0;
  --rounded-size-bl: var(--rounded-base);
  --rounded-size-br: var(--rounded-base);
}
```

### Responsive Design

```css
/* Responsive rounding */
.rounded-responsive {
  --rounded-size-tl: var(--rounded-sm);
  --rounded-size-tr: var(--rounded-sm);
  --rounded-size-bl: var(--rounded-sm);
  --rounded-size-br: var(--rounded-sm);
}

@media (min-width: 768px) {
  .rounded-responsive {
    --rounded-size-tl: var(--rounded-md);
    --rounded-size-tr: var(--rounded-md);
    --rounded-size-bl: var(--rounded-md);
    --rounded-size-br: var(--rounded-md);
  }
}
```

## Browser Support

- **Modern browsers** with CSS Custom Properties support
- **Internet Explorer 11+** with CSS custom property polyfill
- **CSS calc() function** support required
- **CSS @property** support for enhanced animation (optional)

### Fallback Patterns

```css
/* Fallback for older browsers */
.rounded {
  /* Static fallback */
  border-radius: 0.25rem;
}

/* Enhanced styles for modern browsers */
@supports (border-radius: calc(var(--rounded-unit) * var(--rounded-base))) {
  .rounded {
    border-radius: var(--rounded-tl) var(--rounded-tr) var(--rounded-br) var(--rounded-bl);
  }
}
```

## Performance Considerations

- **CSS Custom Properties**: Changes only trigger repaints, not reflows
- **Calculation overhead**: Minimal impact from CSS calc() functions
- **Specificity**: Uses attribute selectors for efficient matching
- **Animation friendly**: @property declarations enable smooth transitions

## Best Practices

1. **Use semantic base units** - Choose `--rounded-unit` values that align with your design system
2. **Leverage size scales** - Use the provided size variations (sm, md, lg, xl) for consistency
3. **Consider content flow** - Ensure rounded corners don't interfere with text or child elements
4. **Test accessibility** - Verify sufficient contrast at rounded edges
5. **Progressive enhancement** - Provide fallback radius values for older browsers

## Common Patterns

### Card Components

```html
<div class="rounded-lg padding" style="box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3>Card Title</h3>
  <p>Card content with rounded corners</p>
</div>
```

### Button Variations

```html
<button class="rounded-md padding bg bg-blue-500">Standard Button</button>
<button class="rounded-full padding bg bg-blue-500">Pill Button</button>
<button class="rounded-none padding bg bg-blue-500">Sharp Button</button>
```

### Image Containers

```html
<div class="rounded-full" style="width: 4rem; height: 4rem; overflow: hidden;">
  <img src="avatar.jpg" alt="User avatar" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

## Troubleshooting

### Common Issues

1. **Rounded corners not appearing**: Check that the element has `overflow: hidden` if containing absolute positioned children
2. **Inconsistent corner sizes**: Verify that `--rounded-unit` is set consistently
3. **Sharp corners on some sides**: Ensure all four corner variables are set properly
4. **Animation not smooth**: Add `@property` declarations for custom property animations

### Debug Mode

```css
/* Visualize rounded calculations */
.rounded.debug {
  outline: 2px solid red;
  outline-offset: 2px;
}

.rounded.debug::before {
  content: "TL: " attr(style);
  position: absolute;
  background: yellow;
  font-size: 0.75rem;
}
```

## Resources

- [CSS Border Radius Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS @property Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [WebBase CLI Documentation](https://your-docs-url.com)
