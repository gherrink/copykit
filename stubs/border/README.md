# Border Utilities Copy Point

Comprehensive border utility system with CSS custom properties for flexible styling and directional border controls.

## Overview

The border copy-point provides a complete set of utility classes for applying borders to any element with fine-grained control over direction, width, style, and color. Built with CSS custom properties for maximum flexibility and theming support.

## Live Example

**[🌐 View Live Example](https://gherrink.github.io/copykit/border.html)** - See this copy point in action with interactive demonstrations.

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
    --border-width: var(--border-width-thin);    /* Default border width */
    --border-style: solid;                       /* Default border style */
    /* --border-color - default border color (RGB values) - already defined through colorset */
    
    /* Predefined border widths */
    --border-width-thin: 1px;
    --border-width-medium: 2px;
    --border-width-thick: 4px;
}
```

### Directional Properties

Each border direction has its own set of custom properties:

```css
/* Individual border control */
--border-t-width, --border-t-style, --border-t-color    /* Top border */
--border-r-width, --border-r-style, --border-r-color    /* Right border */
--border-b-width, --border-b-style, --border-b-color    /* Bottom border */
--border-l-width, --border-l-style, --border-l-color    /* Left border */

/* Axis-based control */
--border-x-width, --border-x-style, --border-x-color    /* Horizontal (left + right) */
--border-y-width, --border-y-style, --border-y-color    /* Vertical (top + bottom) */
```

### Utility Classes

- `.border` - Applies border to all four sides
- `.bt`, `.br`, `.bb`, `.bl` - Individual side borders
- `.bx`, `.by` - Axis-based borders
- `.bxy` - All borders (equivalent to `.border`)
- `.border-solid`, `.border-dashed`, `.border-dotted`, `.border-none` - Style modifiers

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add border
```

Or copy manually:
```bash
cp -r stubs/border/ your-project/src/
```

### Theme Integration

The border copy-point automatically integrates with the global colorset system. The `--border-color` variable is defined in the base colorset and can be customized through theme switching:

```css
/* Default colorset integration (automatic) */
:root {
  --border-color: var(--color-gray-300);  /* Defined in base colorset */
}

/* Custom colorset themes */
.cs-primary {
  --border-color: var(--color-gray-500);  /* Darker borders for primary theme */
}

.cs-secondary {
  --border-color: var(--color-gray-300);  /* Lighter borders for secondary theme */
}

/* Dark theme colorset */
[data-theme="dark"] {
  --border-color: var(--color-gray-600);  /* Dark theme borders */
}

/* Semantic border utilities */
.border-primary { --border-color: var(--color-primary); }
.border-secondary { --border-color: var(--color-secondary); }
.border-success { --border-color: var(--color-success); }
.border-warning { --border-color: var(--color-warning); }
.border-error { --border-color: var(--color-error); }
```

## Customization

### Custom Border Widths

```css
/* Override border widths */
.thick-border {
    --border-width: var(--border-width-thick);
}

.custom-border {
    --border-width: 3px;
}

/* Per-side width customization */
.asymmetric-border {
    --border-t-width: 1px;
    --border-r-width: 2px;
    --border-b-width: 3px;
    --border-l-width: 4px;
}
```

### Custom Colors

```css
/* RGB color values for borders */
.blue-border {
    --border-color: 59 130 246;  /* Blue-500 */
}

.red-border {
    --border-color: 239 68 68;   /* Red-500 */
}

/* Per-side color customization */
.rainbow-border {
    --border-t-color: 239 68 68;   /* Red top */
    --border-r-color: 34 197 94;   /* Green right */
    --border-b-color: 59 130 246;  /* Blue bottom */
    --border-l-color: 168 85 247;  /* Purple left */
}
```

### Responsive Borders

```css
/* Mobile-first responsive approach */
.responsive-border {
  --border-width: var(--border-width-thin);
}

@media (min-width: 768px) {
  .responsive-border {
    --border-width: var(--border-width-medium);
  }
}

@media (min-width: 1024px) {
  .responsive-border {
    --border-width: var(--border-width-thick);
  }
}
```

### Interactive Borders

```css
/* Hover effects */
.interactive-border {
  --border-color: 209 213 219;  /* Gray default */
  transition: border-color 0.2s ease;
}

.interactive-border:hover {
  --border-color: 59 130 246;   /* Blue on hover */
}

.interactive-border:focus {
  --border-color: 168 85 247;   /* Purple on focus */
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
@supports (border: var(--border-width) var(--border-style) rgb(var(--border-color))) {
  .border {
    border: var(--border-width) var(--border-style) rgb(var(--border-color));
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
<div class="border" style="--border-color: 229 231 235;">
  Card content
</div>

<!-- Input field with focus border -->
<input class="border bt-0 br-0 bl-0 bb focus:border-blue" type="text">

<!-- Divider border -->
<hr class="border-0 bt" style="--border-t-color: 229 231 235;">
```

### Integration with Other Copy-Points

```html
<!-- Border with elevation -->
<div class="border shadow" style="--border-color: 229 231 235; --level: 2;">
  Card with border and shadow
</div>

<!-- Border with rounded corners -->
<div class="border rounded" style="--border-color: 229 231 235;">
  Rounded border card
</div>
```

## Troubleshooting

### Common Issues

1. **Borders not appearing**: Check that `--border-color` is set with RGB values (not hex)
2. **Wrong border direction**: Verify utility class spelling (`bt`, `br`, `bb`, `bl`)
3. **Custom properties not applying**: Ensure proper CSS custom property syntax
4. **Colors not working**: Use RGB format for `--border-color` (e.g., `59 130 246` not `#3b82f6`)

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
- Look for `--border-width`, `--border-style`, `--border-color` values
- Verify `border-top`, `border-right`, etc. computed values
- Check if RGB color values are properly formatted

## Resources

- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Border Property Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border)
- [CSS @property Specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [CopyKit CLI Documentation](../../../README.md)
