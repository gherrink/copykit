# elevate Copy Point - Visual Enhancement Utilities

The `elevate` copy-point provides utility classes for adding visual depth and elevation to components using advanced CSS color-mixing techniques. It creates Material Design-inspired elevation effects without requiring shadow or border properties.

## Overview

The `elevate` copy-point contains:
- **Advanced Color Mixing**: Uses `color-mix()` CSS function for elevation effects
- **Material Design Inspired**: 25 elevation levels (0-24) following Material Design principles
- **Customizable**: Configurable elevation color and boost values
- **Performance Optimized**: Uses CSS custom properties and modern CSS features

## Features

- **25 Elevation Levels**: Levels 0-24 with precisely calculated elevation percentages
- **Advanced Color Mixing**: Uses CSS `color-mix()` for sophisticated color blending
- **Customizable Elevation Color**: Control the color used for elevation mixing
- **Boost Functionality**: Additional elevation boost for enhanced effects
- **Material Design Compliance**: Elevation levels follow Material Design guidelines

## Dependencies

> **⚠️ Important**: The `elevate` copy-point requires the `_base` copy-point to be installed first, as it depends on the foundation styles and CSS custom properties.

## CSS Architecture

### Custom Properties

The elevate utility uses three main CSS custom properties:

```css
--level: 0;                    /* Elevation level (0-24) */
--elevate-boost: 0%;           /* Additional elevation boost percentage */
--elevate-color: 255 255 255;  /* RGB color used for elevation mixing */
```

### Color Mixing Algorithm

The elevation effect is achieved through sophisticated color mixing calculations:

- **Levels 0-2**: 0% to 7% elevation with 2% increments
- **Levels 3-6**: 8% to 11% elevation with 1% increments  
- **Levels 7-12**: 11.5% to 14% elevation with 0.5% increments
- **Levels 13-16**: 14.25% to 15% elevation with 0.25% increments
- **Levels 17-24**: 15.125% to 16% elevation with 0.125% increments

## Usage

### Basic Usage

Apply the `.elevate` class and set the `--level` custom property:

```html
<div class="elevate" style="--level: 6;">
  Elevated content
</div>
```

### Elevation Levels

Choose from 25 elevation levels (0-24):

```html
<!-- No elevation -->
<div class="elevate" style="--level: 0;">Level 0</div>

<!-- Low elevation -->
<div class="elevate" style="--level: 2;">Level 2</div>

<!-- Medium elevation -->
<div class="elevate" style="--level: 8;">Level 8</div>

<!-- High elevation -->
<div class="elevate" style="--level: 16;">Level 16</div>

<!-- Maximum elevation -->
<div class="elevate" style="--level: 24;">Level 24</div>
```

### Custom Elevation Color

Change the elevation color by setting `--elevate-color`:

```html
<!-- Blue elevation -->
<div class="elevate" style="--level: 8; --elevate-color: 59 130 246;">
  Blue elevation
</div>

<!-- Green elevation -->
<div class="elevate" style="--level: 8; --elevate-color: 34 197 94;">
  Green elevation
</div>

<!-- Dark elevation -->
<div class="elevate" style="--level: 8; --elevate-color: 17 24 39;">
  Dark elevation
</div>
```

### Elevation Boost

Add extra elevation with `--elevate-boost`:

```html
<!-- Normal elevation -->
<div class="elevate" style="--level: 4;">
  Normal elevation
</div>

<!-- Boosted elevation -->
<div class="elevate" style="--level: 4; --elevate-boost: 5%;">
  Boosted elevation (+5%)
</div>
```

## Integration Guide

### CSS Integration

Import the elevate utilities in your CSS:

```css
/* Import elevate utilities */
@import "./stubs/elevate/styles/03_utilities/elevate.css";
```

### Theme Integration

Set global elevation colors in your theme:

```css
:root {
  /* Light theme elevation */
  --elevate-color: 255 255 255;
}

[data-theme="dark"] {
  /* Dark theme elevation */
  --elevate-color: 17 24 39;
}
```

## Examples

### Card with Elevation

```html
<div class="card elevate" style="--level: 4; --bg-color: 248 250 252;">
  <h3>Elevated Card</h3>
  <p>This card has level 4 elevation.</p>
</div>
```

### Button with Hover Elevation

```css
.btn.elevated {
  --level: 2;
  transition: --level 0.2s ease;
}

.btn.elevated:hover {
  --level: 6;
}
```

```html
<button class="btn elevated elevate">
  Hover for elevation
</button>
```

### Modal with Maximum Elevation

```html
<div class="modal elevate" style="--level: 24; --bg-color: 255 255 255;">
  <h2>Modal Dialog</h2>
  <p>This modal has maximum elevation.</p>
</div>
```

## Advanced Customization

### Component-Specific Elevation

Create component-specific elevation utilities:

```css
.card {
  --level: 2;
}

.card.elevated {
  --level: 8;
}

.card.floating {
  --level: 16;
}
```

### Responsive Elevation

Apply different elevation at different screen sizes:

```css
.responsive-elevation {
  --level: 2;
}

@media (min-width: 768px) {
  .responsive-elevation {
    --level: 6;
  }
}

@media (min-width: 1024px) {
  .responsive-elevation {
    --level: 12;
  }
}
```

### Animation Support

Animate elevation changes:

```css
.animated-elevation {
  --level: 2;
  transition: background-color 0.3s ease;
}

.animated-elevation:hover {
  --level: 8;
}
```

## Color Requirements

### Background Color Dependency

The elevate utility requires a `--bg-color` property to be set:

```css
.my-element {
  --bg-color: 255 255 255; /* White background */
}
```

### Font Color Coordination

The utility also sets appropriate text color based on `--font-color`:

```css
.my-element {
  --bg-color: 255 255 255;   /* White background */
  --font-color: 17 24 39;    /* Dark text */
}
```

## Material Design Mapping

The elevation levels correspond to Material Design elevation values:

| Level | Material Design Use Case |
|-------|-------------------------|
| 0     | No elevation |
| 1-2   | Switch, text button |
| 3-4   | Raised button, card |
| 6-8   | Floating action button |
| 9-12  | Navigation drawer |
| 16    | Modal surfaces |
| 24    | Dialog surfaces |

## Browser Support

- **CSS `color-mix()` support required** (Modern browsers)
- **CSS Custom Properties support required**
- **CSS `@property` support recommended** for enhanced functionality

### Fallback Support

For browsers without `color-mix()` support, consider providing fallbacks:

```css
.elevate {
  /* Fallback for older browsers */
  background: rgb(var(--bg-color));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@supports (background: color-mix(in srgb, red, blue)) {
  .elevate {
    /* Modern color-mix implementation */
    background: color-mix(/* ... */);
    box-shadow: none;
  }
}
```

## Performance Considerations

- **GPU Acceleration**: Color mixing may trigger GPU acceleration
- **Repaint Optimization**: Changes to `--level` trigger repaints, not reflows
- **Animation Performance**: Smooth transitions for elevation changes

## Best Practices

1. **Use Consistent Levels**: Stick to standard elevation levels for consistency
2. **Consider Accessibility**: Ensure sufficient contrast with elevated backgrounds
3. **Progressive Enhancement**: Provide fallbacks for older browsers
4. **Performance**: Limit elevation animations to user interactions
5. **Theme Coordination**: Adjust elevation colors based on theme

## Common Patterns

### Elevation Utilities

```css
.elevation-0 { --level: 0; }
.elevation-2 { --level: 2; }
.elevation-4 { --level: 4; }
.elevation-6 { --level: 6; }
.elevation-8 { --level: 8; }
.elevation-12 { --level: 12; }
.elevation-16 { --level: 16; }
.elevation-24 { --level: 24; }
```

### Hover Effects

```css
.hover-elevate:hover {
  --level: calc(var(--level, 0) + 4);
}
```

### Focus States

```css
.focus-elevate:focus {
  --level: calc(var(--level, 0) + 2);
  --elevate-boost: 2%;
}
```

## Resources

- [CSS `color-mix()` Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [Material Design Elevation](https://m3.material.io/styles/elevation/overview)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)