# Grid-Auto Copy Point

Advanced auto-responsive grid system that automatically adjusts column count based on available space and minimum item widths. Features type-safe CSS custom properties for enhanced browser validation and performance.

## Live Example

**[🌐 View Live Example](https://gherrink.github.io/copykit/grid-auto.html)** - See this copy point in action with interactive demonstrations.

## Overview

The Grid-Auto copy point provides a sophisticated grid utility that intelligently manages column layout based on available container width and minimum item size requirements. Unlike traditional fixed-column grids, this system automatically reduces column count when items would become too small, ensuring optimal readability and usability across all screen sizes.

Key benefits:
- **Intelligent column adjustment** - Automatically reduces columns when space is limited
- **Type-safe CSS properties** - Uses `@property` declarations for better browser validation
- **Minimum width protection** - Prevents items from becoming unreadably small
- **Gap system integration** - Works seamlessly with the existing space system
- **No media queries required** - Responsive behavior is built into the CSS calculation

## Features

- **Auto-responsive column adjustment** based on available space
- **Type-safe CSS custom properties** with `@property` declarations
- **Minimum item width protection** prevents items from becoming too small
- **Namespaced CSS variables** prevent conflicts with other grid systems
- **Full integration with existing gap and space variable system**
- **Support for asymmetric gaps** with separate x/y axis control
- **Responsive behavior without media queries**
- **Enhanced browser validation and performance optimization**

## Usage

### Basic Usage

```html
<!-- Simple 3-column grid with 200px minimum item width -->
<div class="grid-auto" style="--grid-auto-columns: 3; --grid-auto-item-min-width: 200px;">
  <div class="bg pxy">Item 1</div>
  <div class="bg pxy">Item 2</div>
  <div class="bg pxy">Item 3</div>
  <div class="bg pxy">Item 4</div>
  <div class="bg pxy">Item 5</div>
</div>
```

### Advanced Examples

```html
<!-- 4-column grid with custom gaps using space variables -->
<div class="grid-auto" style="--grid-auto-columns: 4; --grid-auto-item-min-width: 150px; --gap-space: var(--space-lg);">
  <div class="bg pxy">Card A</div>
  <div class="bg pxy">Card B</div>
  <div class="bg pxy">Card C</div>
  <div class="bg pxy">Card D</div>
</div>

<!-- Asymmetric gaps with custom values -->
<div class="grid-auto" style="--grid-auto-columns: 2; --grid-auto-item-min-width: 300px; --gap-x: 3rem; --gap-y: 1rem;">
  <div class="bg pxy">Wide spacing horizontally</div>
  <div class="bg pxy">Narrow spacing vertically</div>
</div>
```

### CSS Integration

```css
/* Import the grid-auto utility */
@import "./stubs/grid-auto/styles/03_utilities/grid-auto.css";
```

## CSS Architecture

### Type-Safe Custom Properties

The grid-auto system uses `@property` declarations for enhanced type safety and browser validation:

```css
@property --grid-auto-item-min-width {
  inherits: false;
  initial-value: 1px;
  syntax: "<length-percentage>";
}

@property --grid-auto-columns {
  inherits: false;
  initial-value: 1;
  syntax: "<number>";
}
```

### Required CSS Variables

```css
:root {
  /* Required: Maximum number of columns to attempt */
  --grid-auto-columns: 3;
  
  /* Required: Minimum width for each grid item */
  --grid-auto-item-min-width: 200px;
}
```

### Gap System Variables

Integration with the existing space system for consistent spacing:

```css
:root {
  /* Using space variables (recommended) */
  --gap-space: var(--space-md);      /* Both axes */
  --gap-space-x: var(--space-lg);    /* X-axis only */
  --gap-space-y: var(--space-sm);    /* Y-axis only */
  
  /* Using custom values */
  --gap-x: 2rem;                     /* X-axis custom */
  --gap-y: 1rem;                     /* Y-axis custom */
}
```

### How It Works

The grid-auto system calculates the optimal column count using this algorithm:

1. **Calculate total gap width**: `(columns - 1) × gap-x`
2. **Calculate maximum item width**: `(100% - total gaps) ÷ columns`
3. **Use the larger value**: `max(minimum width, maximum width)`
4. **CSS auto-fill**: Automatically creates as many columns as fit

This ensures items never get smaller than the minimum width while maximizing the use of available space.

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add grid-auto
```

Or copy manually:
```bash
cp -r stubs/grid-auto/ your-project/src/
```

### Real-World Examples

#### Card Grid Layout
```html
<div class="grid-auto" style="--grid-auto-columns: 3; --grid-auto-item-min-width: 280px; --gap-space: var(--space-md);">
  <div class="bg pxy">
    <h3>Product Card</h3>
    <p>Description</p>
    <span>$29.99</span>
  </div>
  <!-- More cards... -->
</div>
```

#### Image Gallery
```html
<div class="grid-auto" style="--grid-auto-columns: 4; --grid-auto-item-min-width: 150px; --gap-space: var(--space-sm);">
  <img src="photo1.jpg" alt="Photo 1" class="width-full">
  <img src="photo2.jpg" alt="Photo 2" class="width-full">
  <!-- More images... -->
</div>
```

#### Dashboard Widgets
```html
<div class="grid-auto" style="--grid-auto-columns: 2; --grid-auto-item-min-width: 350px; --gap-space: var(--space-lg);">
  <div class="bg pxy">
    <h4>Analytics</h4>
    <div class="dashboard-chart">Chart content</div>
  </div>
  <!-- More widgets... -->
</div>
```

## Customization

### Responsive Behavior

The grid-auto system is inherently responsive without media queries. However, you can enhance it with breakpoint-specific adjustments:

```css
/* Mobile: fewer columns, smaller minimum */
.grid-auto {
  --grid-auto-columns: 2;
  --grid-auto-item-min-width: 140px;
}

/* Tablet and up: more columns, larger minimum */
@media (min-width: 768px) {
  .grid-auto {
    --grid-auto-columns: 3;
    --grid-auto-item-min-width: 200px;
  }
}

/* Desktop: maximum columns */
@media (min-width: 1024px) {
  .grid-auto {
    --grid-auto-columns: 4;
    --grid-auto-item-min-width: 250px;
  }
}
```

### Nested Grids

For nested grid-auto containers, use `unset` or `initial` to reset gap inheritance:

```html
<div class="grid-auto" style="--grid-auto-columns: 2; --gap-space: var(--space-lg);">
  <div class="bg pxy">
    <h3>Section 1</h3>
    <!-- Nested grid with different spacing -->
    <div class="grid-auto" style="--grid-auto-columns: 3; --gap-space: unset;">
      <div class="bg pxy">Nested A</div>
      <div class="bg pxy">Nested B</div>
      <div class="bg pxy">Nested C</div>
    </div>
  </div>
</div>
```

## Browser Support

- **Modern browsers** with CSS Grid support (Chrome 57+, Firefox 52+, Safari 10.1+)
- **CSS Custom Properties** support required
- **CSS @property** support for enhanced validation (Chrome 85+, Firefox 128+)
- **Progressive enhancement** - Works in all browsers, enhanced features in supporting browsers

### Fallback Pattern

```css
/* Basic fallback for older browsers */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Enhanced version for modern browsers */
@supports (display: grid) and (grid-template-columns: repeat(auto-fill, minmax(max(200px, 25%), 1fr))) {
  .grid-auto {
    /* Full grid-auto implementation */
  }
}
```

## Performance Considerations

- **CSS @property declarations** provide browser-level validation and optimization
- **Namespaced variables** prevent CSS cascade conflicts
- **Calculation efficiency** - Grid calculations are handled by the browser's layout engine
- **No JavaScript required** - Pure CSS solution for optimal performance

## Best Practices

1. **Choose appropriate minimum widths** - Consider content readability and usability
2. **Use space variables for gaps** - Maintains consistency with the design system
3. **Test across screen sizes** - Verify behavior at different container widths
4. **Consider content hierarchy** - Important items should be visible even when columns reduce
5. **Combine with other utilities** - Use padding, margins, and colorsets for complete styling

## Variable Reference

### Required Variables
- `--grid-auto-columns` (number): Maximum columns to attempt
- `--grid-auto-item-min-width` (length-percentage): Minimum item width

### Gap Variables (choose one approach)
- `--gap-space` (space variable): Both axes using space scale
- `--gap-space-x` / `--gap-space-y` (space variables): Separate axes using space scale
- `--gap-x` / `--gap-y` (length): Custom gap values

### Available Space Scale
- `var(--space-xs)` - 0.5rem
- `var(--space-sm)` - 0.7rem  
- `var(--space-base)` - 1rem
- `var(--space-md)` - 1.3rem
- `var(--space-lg)` - 1.8rem
- `var(--space-xl)` - 3.2rem
- `var(--space-2xl)` - 4.8rem

## Troubleshooting

### Common Issues

1. **Items not respecting minimum width**: Check that `--grid-auto-item-min-width` is set
2. **Unexpected column counts**: Verify container width and gap calculations
3. **Gaps not applying**: Ensure proper gap variable usage and inheritance
4. **CSS not loading**: Verify import path to the utilities CSS file

### Debug Helper

```css
/* Temporary debug styling to visualize grid behavior */
.grid-auto.debug {
  outline: 2px solid blue;
}

.grid-auto.debug > * {
  outline: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
```

## Resources

- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS @property Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CopyKit Space System](../stubs/_base/README.md#spacing-system)
