# Elevate Copy Point

Visual enhancement utilities that create depth and elevation effects using advanced CSS color-mixing techniques, inspired by Material Design principles.

## Overview

The elevate copy-point provides sophisticated elevation effects without requiring shadow or border properties. Using modern CSS `color-mix()` functions, it creates Material Design-inspired elevation with 25 precise levels (0-24) and customizable colors and boost values.

## Features

- **25 Elevation Levels**: Precisely calculated levels 0-24 following Material Design guidelines
- **Advanced Color Mixing**: Uses CSS `color-mix()` function for sophisticated color blending
- **Customizable Colors**: Control elevation color and boost values
- **Material Design Compliance**: Elevation levels match Material Design specifications
- **Performance Optimized**: Uses CSS custom properties for efficient rendering
- **No Shadow Dependencies**: Creates depth through color mixing, not shadows

## Usage

### Basic Usage

```html
<!-- Basic elevation with level 4 -->
<div class="elevate" style="--level: 4; --bg-color: 255 255 255;">
  Elevated content
</div>

<!-- Multiple elevation levels -->
<div class="elevate" style="--level: 0; --bg-color: 248 250 252;">No elevation</div>
<div class="elevate" style="--level: 2; --bg-color: 248 250 252;">Subtle elevation</div>
<div class="elevate" style="--level: 8; --bg-color: 248 250 252;">Medium elevation</div>
<div class="elevate" style="--level: 16; --bg-color: 248 250 252;">High elevation</div>
```

### Advanced Examples

```html
<!-- Custom elevation color -->
<div class="elevate" style="--level: 8; --bg-color: 255 255 255; --elevate-color: 59 130 246;">
  Blue elevation effect
</div>

<!-- Elevation with boost -->
<div class="elevate" style="--level: 4; --bg-color: 255 255 255; --elevate-boost: 5%;">
  Boosted elevation intensity
</div>

<!-- Dark theme elevation -->
<div class="elevate" style="--level: 8; --bg-color: 24 24 27; --elevate-color: 17 24 39;">
  Dark theme elevation
</div>
```

### CSS Integration

```css
/* Import elevate utilities */
@import "./stubs/elevate/styles/03_utilities/elevate.css";
```

## CSS Architecture

### Custom Properties

The elevate utility uses CSS custom properties for flexible customization:

```css
:root {
  /* Core elevation properties */
  --level: 0;                    /* Elevation level (0-24) */
  --elevate-color: 255 255 255;  /* RGB color for elevation mixing */
  --elevate-boost: 0%;           /* Additional elevation boost */
  
  /* Required background color */
  --bg-color: 255 255 255;       /* Element background color */
  --font-color: 17 24 39;        /* Text color */
}
```

### Color Mixing Algorithm

The elevation effect uses sophisticated color mixing calculations:

- **Levels 0-2**: 0% to 7% elevation with 2% increments
- **Levels 3-6**: 8% to 11% elevation with 1% increments  
- **Levels 7-12**: 11.5% to 14% elevation with 0.5% increments
- **Levels 13-16**: 14.25% to 15% elevation with 0.25% increments
- **Levels 17-24**: 15.125% to 16% elevation with 0.125% increments

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add elevate
```

Or copy manually:
```bash
cp -r stubs/elevate/ your-project/src/
```

### Theme Integration

```css
/* Light theme elevation */
:root {
  --elevate-color: 255 255 255;
  --bg-color: 255 255 255;
  --font-color: 17 24 39;
}

/* Dark theme elevation */
[data-theme="dark"] {
  --elevate-color: 17 24 39;
  --bg-color: 24 24 27;
  --font-color: 255 255 255;
}
```

### Component Integration

```css
/* Card with elevation */
.card {
  --bg-color: 255 255 255;
  --level: 2;
}

.card.elevated {
  --level: 8;
}

.card.floating {
  --level: 16;
}
```

## Customization

### Component Variants

```css
/* Elevation utility classes */
.elevation-0 { --level: 0; }
.elevation-2 { --level: 2; }
.elevation-4 { --level: 4; }
.elevation-6 { --level: 6; }
.elevation-8 { --level: 8; }
.elevation-12 { --level: 12; }
.elevation-16 { --level: 16; }
.elevation-24 { --level: 24; }

/* Hover elevation effects */
.hover-elevate:hover {
  --level: calc(var(--level, 0) + 4);
  transition: background-color 0.2s ease;
}

/* Focus elevation effects */
.focus-elevate:focus {
  --level: calc(var(--level, 0) + 2);
  --elevate-boost: 2%;
}
```

### Responsive Design

```css
/* Mobile-first elevation */
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

```css
/* Smooth elevation transitions */
.animated-elevation {
  --level: 2;
  transition: background-color 0.3s ease;
}

.animated-elevation:hover {
  --level: 8;
}

/* Button elevation states */
.btn.elevated {
  --level: 2;
  transition: background-color 0.2s ease;
}

.btn.elevated:hover {
  --level: 6;
}

.btn.elevated:active {
  --level: 1;
}
```

## Material Design Integration

### Elevation Level Mapping

The elevation levels correspond to Material Design specifications:

| Level | Material Design Use Case | Typical Usage |
|-------|-------------------------|---------------|
| 0     | No elevation | Flat surfaces |
| 1-2   | Switch, text button | Subtle elements |
| 3-4   | Raised button, card | Interactive elements |
| 6-8   | Floating action button | Prominent elements |
| 9-12  | Navigation drawer | Navigation components |
| 16    | Modal surfaces | Dialogs and overlays |
| 24    | Dialog surfaces | Critical dialogs |

### Design System Integration

```css
/* Design system elevation tokens */
:root {
  --elevation-none: 0;
  --elevation-subtle: 2;
  --elevation-low: 4;
  --elevation-medium: 8;
  --elevation-high: 16;
  --elevation-maximum: 24;
}

.surface-elevated {
  --level: var(--elevation-medium);
}

.dialog-elevated {
  --level: var(--elevation-high);
}
```

## Browser Support

- **CSS `color-mix()` support required** (Modern browsers)
- **CSS Custom Properties** support required
- **CSS `calc()` function** support for level calculations

### Fallback Patterns

```css
/* Fallback for browsers without color-mix() support */
.elevate {
  background: rgb(var(--bg-color));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Enhanced styles for modern browsers */
@supports (background: color-mix(in srgb, red, blue)) {
  .elevate {
    background: color-mix(
      in srgb,
      rgb(var(--bg-color)),
      rgb(var(--elevate-color)) calc(var(--elevation-percentage) + var(--elevate-boost))
    );
    box-shadow: none;
  }
}
```

## Performance Considerations

- **CSS Custom Properties**: Changes trigger repaints, not reflows
- **Color Mixing**: May trigger GPU acceleration for smooth rendering
- **Animation Performance**: Smooth transitions for elevation changes
- **Memory Usage**: Minimal overhead with efficient property calculations

## Best Practices

1. **Use consistent levels** - Stick to standard elevation levels for design consistency
2. **Provide background colors** - Always set `--bg-color` for proper elevation effect
3. **Consider accessibility** - Ensure sufficient contrast with elevated backgrounds
4. **Test browser support** - Provide fallbacks for older browsers
5. **Limit animations** - Use elevation animations sparingly for performance
6. **Theme coordination** - Adjust elevation colors based on light/dark themes

## Common Patterns

### Interactive Elements

```css
/* Buttons with elevation states */
.btn-elevated {
  --level: 2;
  --bg-color: 255 255 255;
  transition: background-color 0.2s ease;
}

.btn-elevated:hover {
  --level: 6;
}

.btn-elevated:active {
  --level: 1;
}
```

### Layout Components

```css
/* Card components */
.card {
  --bg-color: 255 255 255;
  --level: 2;
}

.card.prominent {
  --level: 8;
}

/* Modal overlays */
.modal {
  --bg-color: 255 255 255;
  --level: 24;
}
```

### State Management

```html
<!-- Elevation based on state -->
<div class="elevate" data-state="active" style="--level: 8; --bg-color: 255 255 255;">
  State-based elevation
</div>

<div class="elevate" data-state="inactive" style="--level: 2; --bg-color: 255 255 255;">
  Lower elevation state
</div>
```

## Troubleshooting

### Common Issues

1. **Elevation not visible**: Ensure `--bg-color` is set and differs from `--elevate-color`
2. **Color mixing not working**: Check browser support for `color-mix()` function
3. **Animations not smooth**: Verify transition properties target `background-color`
4. **Theme colors not updating**: Check CSS custom property inheritance

### Debug Mode

```css
/* Debug elevation levels */
.elevate.debug::before {
  content: "Level: " attr(style);
  position: absolute;
  top: 0;
  left: 0;
  background: red;
  color: white;
  padding: 2px 4px;
  font-size: 10px;
}
```

### Testing Elevation

```javascript
// Test elevation color mixing
const element = document.querySelector('.elevate')
const computedStyle = getComputedStyle(element)
console.log('Background color:', computedStyle.backgroundColor)
console.log('Elevation level:', computedStyle.getPropertyValue('--level'))
```

## Resources

- [CSS `color-mix()` Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [Material Design Elevation](https://m3.material.io/styles/elevation/overview)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Color Theory in Design](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors)
- [Modern CSS Features](https://web.dev/css-color-mix/)