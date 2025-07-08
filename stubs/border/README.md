# Border Utilities Copy Point

Comprehensive border utility system with CSS custom properties for flexible styling and directional border controls.

## Overview

The border copy-point provides a complete set of utility classes for applying borders to any element with fine-grained control over direction, width, style, and color. Built with CSS custom properties for maximum flexibility and theming support.

## Features

- **Directional Border Control** - Apply borders to specific sides (top, right, bottom, left)
- **Axis-Based Utilities** - Control horizontal (x-axis) and vertical (y-axis) borders together
- **CSS Custom Properties** - Flexible customization through CSS variables
- **Predefined Styles** - Quick style application with solid, dashed, dotted, and none classes
- **Color System Integration** - Works with RGB custom properties for consistent theming

## Usage

### Basic Usage

```html
<!-- Apply border to all sides -->
<div class="border">All sides border</div>

<!-- Directional borders -->
<div class="bt">Top border only</div>
<div class="br">Right border only</div>
<div class="bb">Bottom border only</div>
<div class="bl">Left border only</div>
```

### Axis-Based Borders

```html
<!-- Horizontal borders (left + right) -->
<div class="bx">Horizontal borders</div>

<!-- Vertical borders (top + bottom) -->
<div class="by">Vertical borders</div>

<!-- All axis borders (equivalent to .border) -->
<div class="bxy">All borders</div>
```

### Border Styles

```html
<!-- Style modifiers -->
<div class="border border-solid">Solid border (default)</div>
<div class="border border-dashed">Dashed border</div>
<div class="border border-dotted">Dotted border</div>
<div class="border border-none">No border</div>
```

### CSS Integration

```css
/* Import border utilities */
@import "./stubs/border/styles/03_utilities/border.css";
```

## CSS Architecture

### Custom Properties

The border utilities use CSS custom properties for flexible customization:

```css
:root {
    /* Global border defaults */
    --b-width: var(--b-width-thin);    /* Default border width */
    --b-style: solid;                  /* Default border style */
    --b-color: var(--color-black);     /* Default border color (RGB values) */
    
    /* Predefined border widths */
    --b-width-thin: 1px;
    --b-width-medium: 2px;
    --b-width-thick: 4px;
}
```

### Directional Properties

Each border direction has its own set of custom properties:

```css
/* Individual border control */
--bt-width, --bt-style, --bt-color    /* Top border */
--br-width, --br-style, --br-color    /* Right border */
--bb-width, --bb-style, --bb-color    /* Bottom border */
--bl-width, --bl-style, --bl-color    /* Left border */

/* Axis-based control */
--bx-width, --bx-style, --bx-color    /* Horizontal (left + right) */
--by-width, --by-style, --by-color    /* Vertical (top + bottom) */
```

### Utility Classes

- `.border` - Applies border to all four sides
- `.bt`, `.br`, `.bb`, `.bl` - Individual side borders
- `.bx`, `.by` - Axis-based borders
- `.bxy` - All borders (equivalent to `.border`)
- `.border-solid`, `.border-dashed`, `.border-dotted`, `.border-none` - Style modifiers

## Integration Guide

### Installation

Use the WebBase CLI:
```bash
webbase add border
```

Or copy manually:
```bash
cp -r stubs/border/ your-project/src/
```

### Theme Integration

```css
/* Light theme borders */
:root {
  --b-color: 0 0 0;           /* Black borders */
  --color-gray-300: 209 213 219;
}

/* Dark theme borders */
[data-theme="dark"] {
  --b-color: 255 255 255;     /* White borders */
  --b-color: var(--color-gray-300); /* Or use gray for subtle borders */
}

/* Semantic color borders */
.border-primary { --b-color: var(--color-primary); }
.border-secondary { --b-color: var(--color-secondary); }
.border-success { --b-color: var(--color-success); }
.border-warning { --b-color: var(--color-warning); }
.border-error { --b-color: var(--color-error); }
```

## Customization

### Custom Border Widths

```css
/* Override border widths */
.thick-border {
    --b-width: var(--b-width-thick);
}

.custom-border {
    --b-width: 3px;
}

/* Per-side width customization */
.asymmetric-border {
    --bt-width: 1px;
    --br-width: 2px;
    --bb-width: 3px;
    --bl-width: 4px;
}
```

### Custom Colors

```css
/* RGB color values for borders */
.blue-border {
    --b-color: 59 130 246;  /* Blue-500 */
}

.red-border {
    --b-color: 239 68 68;   /* Red-500 */
}

/* Per-side color customization */
.rainbow-border {
    --bt-color: 239 68 68;   /* Red top */
    --br-color: 34 197 94;   /* Green right */
    --bb-color: 59 130 246;  /* Blue bottom */
    --bl-color: 168 85 247;  /* Purple left */
}
```

### Responsive Borders

```css
/* Mobile-first responsive approach */
.responsive-border {
  --b-width: var(--b-width-thin);
}

@media (min-width: 768px) {
  .responsive-border {
    --b-width: var(--b-width-medium);
  }
}

@media (min-width: 1024px) {
  .responsive-border {
    --b-width: var(--b-width-thick);
  }
}
```

### Interactive Borders

```css
/* Hover effects */
.interactive-border {
  --b-color: 209 213 219;  /* Gray default */
  transition: border-color 0.2s ease;
}

.interactive-border:hover {
  --b-color: 59 130 246;   /* Blue on hover */
}

.interactive-border:focus {
  --b-color: 168 85 247;   /* Purple on focus */
}
```

## Browser Support

- **CSS Custom Properties** support required (IE 11+ with polyfill)
- **CSS @property** support for enhanced type safety (Chrome 85+, Firefox 128+)
- **Modern browsers** recommended for full feature support
- **Progressive enhancement** for older browsers

### Fallback Patterns

```css
/* Fallback for browsers without CSS custom properties */
.border {
  border: 1px solid #000000;
}

/* Enhanced styles for modern browsers */
@supports (border: var(--b-width) var(--b-style) rgb(var(--b-color))) {
  .border {
    border: var(--b-width) var(--b-style) rgb(var(--b-color));
  }
}
```

## Performance Considerations

- **CSS Custom Properties**: Efficient runtime updates without selector recalculation
- **Minimal Specificity**: Utility classes avoid specificity conflicts
- **Browser Optimization**: Modern browsers optimize border rendering
- **Memory Efficient**: No JavaScript overhead for CSS-only utilities

## Best Practices

1. **Use directional utilities** - Apply borders only where needed (`bt`, `br` vs `border`)
2. **Leverage CSS custom properties** - Customize through variables for consistency
3. **Follow color system** - Use RGB custom properties for theme compatibility
4. **Progressive enhancement** - Provide static fallbacks for older browsers
5. **Combine thoughtfully** - Mix directional utilities for complex border patterns
6. **Performance awareness** - Prefer CSS borders over box-shadow for simple lines

## Common Patterns

### Utility Combinations

```html
<!-- Card with subtle border -->
<div class="border" style="--b-color: 229 231 235;">
  Card content
</div>

<!-- Input field with focus border -->
<input class="border bt-0 br-0 bl-0 bb focus:border-blue" type="text">

<!-- Divider border -->
<hr class="border-0 bt" style="--bt-color: 229 231 235;">
```

### Integration with Other Copy-Points

```html
<!-- Border with elevation -->
<div class="border shadow" style="--b-color: 229 231 235; --level: 2;">
  Card with border and shadow
</div>

<!-- Border with rounded corners -->
<div class="border rounded" style="--b-color: 229 231 235;">
  Rounded border card
</div>
```

## Troubleshooting

### Common Issues

1. **Borders not appearing**: Check that `--b-color` is set with RGB values (not hex)
2. **Wrong border direction**: Verify utility class spelling (`bt`, `br`, `bb`, `bl`)
3. **Custom properties not applying**: Ensure proper CSS custom property syntax
4. **Colors not working**: Use RGB format for `--b-color` (e.g., `59 130 246` not `#3b82f6`)

### Debug Tips

```css
/* Visualize all borders */
* {
  outline: 1px solid red;
}

/* Check custom property values */
.border {
  border: 10px solid blue !important; /* Should override if CSS is loading */
}
```

### Browser DevTools

Check computed styles in DevTools to verify custom property values:
- Look for `--b-width`, `--b-style`, `--b-color` values
- Verify `border-top`, `border-right`, etc. computed values
- Check if RGB color values are properly formatted

## Resources

- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Border Property Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border)
- [CSS @property Specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [WebBase CLI Documentation](../../../README.md)
