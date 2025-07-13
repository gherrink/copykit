# Shadow Copy Point

Material Design-inspired shadow utilities with 24 elevation levels, scientifically-accurate shadow calculations using umbra, penumbra, and ambient shadow layers.

## Overview

The shadow copy-point provides a comprehensive shadow system based on Material Design principles. It offers 24 levels of elevation (0-24) with precise shadow calculations using the three-layer shadow system: umbra (direct shadow), penumbra (soft shadow), and ambient (environment shadow).

## Live Example

**[🌐 View Live Example](https://gherrink.github.io/copykit/shadow.html)** - See this copy point in action with interactive demonstrations.

## Features

- **24-Level Shadow System**: Precise elevation control from 0-24 following Material Design specifications
- **Scientific Shadow Calculation**: Uses umbra, penumbra, and ambient shadow layers for realistic depth
- **Customizable Shadow Colors**: Full control over shadow color and opacity via CSS custom properties
- **Material Design Compliance**: Shadow calculations match Material Design elevation guidelines
- **CSS @property Support**: Type-safe shadow customization with enhanced browser support
- **Performance Optimized**: Efficient CSS-only implementation with no JavaScript dependencies

## Usage

### Basic Usage

```html
<!-- Basic shadow with level 4 -->
<div class="shadow" style="--level: 4;">
  Elevated content with shadow
</div>

<!-- Multiple shadow levels -->
<div class="shadow" style="--level: 0;">No shadow</div>
<div class="shadow" style="--level: 2;">Subtle shadow</div>
<div class="shadow" style="--level: 8;">Medium shadow</div>
<div class="shadow" style="--level: 16;">Strong shadow</div>
<div class="shadow" style="--level: 24;">Maximum shadow</div>
```

### Advanced Examples

```html
<!-- Custom shadow color -->
<div class="shadow" style="--level: 8; --shadow-color: 255 0 0;">
  Red shadow effect
</div>

<!-- Intensified shadow -->
<div class="shadow" style="--level: 4; --shadow-boost: 0.2;">
  Boosted shadow intensity
</div>

<!-- Custom opacity controls -->
<div class="shadow" style="--level: 6; --shadow-umbra: 0.3; --shadow-penumbra: 0.2;">
  Custom shadow intensity
</div>
```

### CSS Integration

```css
/* Import shadow utilities */
@import "./stubs/shadow/styles/03_utilities/shadow.css";
```

## CSS Architecture

### Custom Properties

The shadow system uses CSS custom properties for flexible customization:

```css
:root {
  /* Core shadow properties */
  --level: 0;                /* Shadow level (0-24) */
  --shadow-color: 0 0 0;     /* RGB shadow color */
  
  /* Shadow layer opacity controls */
  --shadow-umbra: 0.2;       /* Direct shadow opacity */
  --shadow-penumbra: 0.14;   /* Soft shadow opacity */
  --shadow-ambient: 0.12;    /* Ambient shadow opacity */
  --shadow-boost: 0;         /* Additional opacity boost */
}
```

### Shadow Layer System

The shadow system uses three scientifically-accurate layers:

1. **Umbra** - The sharp, direct shadow cast by the element blocking light
2. **Penumbra** - The soft, blurred shadow around the umbra edge
3. **Ambient** - The subtle ambient occlusion shadow from environmental lighting

Each layer has precise calculations for offset, blur, and spread based on Material Design specifications.

## Integration Guide

### Installation

Use the CopyKit CLI:
```bash
copykit add shadow
```

Or copy manually:
```bash
cp -r stubs/shadow/ your-project/src/
```

### Theme Integration

```css
/* Light theme shadows */
:root {
  --shadow-color: 0 0 0;
  --shadow-umbra: 0.2;
  --shadow-penumbra: 0.14;
  --shadow-ambient: 0.12;
}

/* Dark theme shadows */
[data-theme="dark"] {
  --shadow-color: 0 0 0;
  --shadow-umbra: 0.3;
  --shadow-penumbra: 0.2;
  --shadow-ambient: 0.15;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --shadow-color: 0 0 0;
  --shadow-umbra: 0.4;
  --shadow-penumbra: 0.3;
  --shadow-ambient: 0.2;
}
```

### Component Integration

```css
/* Component-specific shadow levels */
.card {
  --level: 2;
}

.card.elevated {
  --level: 8;
}

.card.floating {
  --level: 16;
}

.modal {
  --level: 24;
}

.button {
  --level: 2;
  transition: box-shadow 0.2s ease;
}

.button:hover {
  --level: 6;
}
```

## Customization

### Component Variants

```css
/* Shadow utility classes */
.shadow-none { --level: 0; }
.shadow-sm { --level: 2; }
.shadow-md { --level: 4; }
.shadow-lg { --level: 8; }
.shadow-xl { --level: 16; }
.shadow-2xl { --level: 24; }

/* Colored shadows */
.shadow-blue { --shadow-color: 59 130 246; }
.shadow-green { --shadow-color: 34 197 94; }
.shadow-red { --shadow-color: 239 68 68; }
.shadow-purple { --shadow-color: 147 51 234; }

/* Shadow intensity variants */
.shadow-subtle {
  --shadow-umbra: 0.1;
  --shadow-penumbra: 0.07;
  --shadow-ambient: 0.06;
}

.shadow-intense {
  --shadow-umbra: 0.3;
  --shadow-penumbra: 0.2;
  --shadow-ambient: 0.18;
}
```

### Responsive Design

```css
/* Mobile-first shadow approach */
.responsive-shadow {
  --level: 2;
}

@media (min-width: 768px) {
  .responsive-shadow {
    --level: 4;
  }
}

@media (min-width: 1024px) {
  .responsive-shadow {
    --level: 8;
  }
}

/* Reduce shadows on small screens for performance */
@media (max-width: 480px) {
  .shadow {
    --shadow-penumbra: calc(var(--shadow-penumbra) * 0.5);
    --shadow-ambient: calc(var(--shadow-ambient) * 0.5);
  }
}
```

### Animation Support

```css
/* Smooth shadow transitions */
.animated-shadow {
  --level: 2;
  transition: box-shadow 0.3s ease;
}

.animated-shadow:hover {
  --level: 8;
}

/* Button shadow states */
.btn-shadow {
  --level: 2;
  transition: box-shadow 0.2s ease;
}

.btn-shadow:hover {
  --level: 6;
}

.btn-shadow:active {
  --level: 1;
}

/* Focus shadow enhancement */
.focus-shadow:focus {
  --shadow-boost: 0.1;
  --level: calc(var(--level) + 2);
}
```

## Material Design Integration

### Elevation Level Mapping

The shadow levels correspond to Material Design elevation specifications:

| Level | Material Design Use Case | Shadow Description |
|-------|-------------------------|-------------------|
| 0     | No elevation | No shadow |
| 1-2   | Switch, text button | Very subtle shadow |
| 3-4   | Raised button, card | Light shadow |
| 6-8   | Floating action button | Medium shadow |
| 9-12  | Navigation drawer | Prominent shadow |
| 16    | Modal surfaces | Strong shadow |
| 24    | Dialog surfaces | Maximum shadow |

### Design System Tokens

```css
/* Design system shadow tokens */
:root {
  --shadow-none: 0;
  --shadow-subtle: 2;
  --shadow-low: 4;
  --shadow-medium: 8;
  --shadow-high: 16;
  --shadow-maximum: 24;
}

/* Component shadow assignments */
.surface {
  --level: var(--shadow-subtle);
}

.interactive {
  --level: var(--shadow-low);
}

.elevated {
  --level: var(--shadow-medium);
}

.modal {
  --level: var(--shadow-maximum);
}
```

## Browser Support

- **Modern browsers** with CSS Custom Properties support
- **CSS `@property`** support for enhanced type safety (optional)
- **CSS `calc()` function** support for shadow calculations
- **CSS `box-shadow`** support (universal)

### Fallback Patterns

```css
/* Fallback for browsers without custom properties */
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Enhanced styles for modern browsers */
@supports (--level: 0) {
  .shadow {
    box-shadow: 
      var(--shadow-umbra-layer),
      var(--shadow-penumbra-layer),
      var(--shadow-ambient-layer);
  }
}

/* Progressive enhancement with @property */
@supports (background: color(display-p3 1 0 0)) {
  @property --level {
    syntax: '<integer>';
    initial-value: 0;
    inherits: false;
  }
}
```

## Performance Considerations

- **CSS-Only Implementation**: No JavaScript overhead or runtime calculations
- **GPU Acceleration**: box-shadow properties can trigger hardware acceleration
- **Efficient Calculations**: Pre-calculated shadow values for optimal performance
- **Animation Performance**: Smooth transitions without layout thrashing
- **Memory Usage**: Minimal memory footprint with efficient CSS properties

## Best Practices

1. **Use appropriate levels** - Match shadow intensity to component importance
2. **Maintain consistency** - Use the same shadow level for similar UI elements
3. **Consider accessibility** - Ensure sufficient contrast between shadows and backgrounds
4. **Test performance** - Monitor rendering performance with many shadowed elements
5. **Theme coordination** - Adjust shadow opacity and color for different themes
6. **Avoid shadow overuse** - Too many shadows can create visual clutter

## Common Patterns

### Interactive Elements

```css
/* Button with hover shadow */
.btn-interactive {
  --level: 2;
  transition: box-shadow 0.2s ease;
}

.btn-interactive:hover {
  --level: 6;
}

.btn-interactive:active {
  --level: 1;
}
```

### Layout Components

```css
/* Card components with shadows */
.card {
  --level: 2;
  background: white;
  border-radius: 8px;
}

.card.prominent {
  --level: 8;
}

/* Navigation elements */
.nav-drawer {
  --level: 12;
}

.app-bar {
  --level: 4;
}
```

### State Management

```html
<!-- Shadow based on component state -->
<div class="shadow" data-state="elevated" style="--level: 8;">
  Elevated state content
</div>

<div class="shadow" data-state="normal" style="--level: 2;">
  Normal state content
</div>
```

### Integration with Other Copy-Points

```html
<!-- Combining shadow with elevate -->
<div class="shadow elevate" style="--level: 8;">
  Content with both shadow and elevation effects
</div>
```

## Troubleshooting

### Common Issues

1. **Shadows not visible**: Check that shadow color contrasts with background
2. **Performance issues**: Reduce shadow complexity on lower-end devices
3. **Inconsistent appearance**: Verify shadow color and opacity values across themes
4. **Animation stuttering**: Ensure transitions target only box-shadow property

### Debug Mode

```css
/* Debug shadow calculations */
.shadow.debug::before {
  content: "Level: " var(--level);
  position: absolute;
  top: -20px;
  left: 0;
  background: red;
  color: white;
  padding: 2px 4px;
  font-size: 10px;
  z-index: 1000;
}
```

### Testing Shadows

```javascript
// Test shadow property values
const element = document.querySelector('.shadow')
const computedStyle = getComputedStyle(element)
console.log('Box shadow:', computedStyle.boxShadow)
console.log('Shadow level:', computedStyle.getPropertyValue('--level'))
console.log('Shadow color:', computedStyle.getPropertyValue('--shadow-color'))
```

### Accessibility Testing

```css
/* High contrast mode adjustments */
@media (prefers-contrast: high) {
  .shadow {
    --shadow-umbra: 0.4;
    --shadow-penumbra: 0.3;
    --shadow-ambient: 0.2;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .shadow {
    transition: none;
  }
}
```

## Resources

- [Material Design Elevation Guidelines](https://material.io/design/environment/elevation.html)
- [CSS `@property` Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Box Shadow Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [Accessibility and Shadows](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)