# Shadow Copy Point

Material Design-inspired shadow utilities with customizable levels, colors, and opacity controls using umbra, penumbra, and ambient shadow layers.

## Overview

The shadow copy point provides a comprehensive shadow system based on Material Design principles, offering 24 levels of elevation (0-24) with scientifically-accurate shadow calculations using umbra, penumbra, and ambient light layers.

## Dependencies

> **⚠️ Important**: The `shadow` copy-point requires the `_base` copy-point to be installed first.

## Features

- **24-level shadow system** (0-24) for precise elevation control
- **Material Design shadow calculation** using umbra, penumbra, and ambient layers
- **Customizable shadow colors** via CSS custom properties
- **Adjustable shadow opacity** and boost controls
- **CSS @property declarations** for type-safe shadow customization

## Usage

### Basic Usage

```html
<!-- Basic shadow with level 4 -->
<div class="shadow" style="--level: 4;">
  Elevated content
</div>

<!-- Custom shadow color -->
<div class="shadow" style="--level: 8; --shadow-color: 255 0 0;">
  Red shadow
</div>
```

### Shadow Levels

The shadow system supports 24 levels (0-24) where higher numbers create more pronounced shadows:

```html
<!-- No shadow -->
<div class="shadow" style="--level: 0;">Level 0</div>

<!-- Subtle shadow -->
<div class="shadow" style="--level: 2;">Level 2</div>

<!-- Medium shadow -->
<div class="shadow" style="--level: 8;">Level 8</div>

<!-- Strong shadow -->
<div class="shadow" style="--level: 16;">Level 16</div>

<!-- Maximum shadow -->
<div class="shadow" style="--level: 24;">Level 24</div>
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
  /* Shadow color (RGB values without alpha) */
  --shadow-color: 0 0 0;
  
  /* Shadow opacity controls */
  --shadow-umbra: 0.2;      /* Direct shadow opacity */
  --shadow-penumbra: 0.14;  /* Soft shadow opacity */  
  --shadow-ambient: 0.12;   /* Ambient shadow opacity */
  --shadow-boost: 0;        /* Additional opacity boost */
}

/* Element-specific shadow customization */
.card {
  --level: 4;
  --shadow-color: 0 0 0;
}

.elevated-card {
  --level: 8;
  --shadow-boost: 0.1; /* Increase shadow intensity */
}
```

### Shadow Layers

The shadow system uses three layers based on Material Design:

1. **Umbra** - The sharp, direct shadow cast by the element
2. **Penumbra** - The soft, blurred shadow around the umbra
3. **Ambient** - The subtle ambient occlusion shadow

## Integration Guide

### Installation

Use the WebBase CLI:
```bash
webbase add shadow
```

Or copy manually:
```bash
cp -r stubs/shadow/ your-project/src/
```

### Import in Your CSS

```css
/* Import shadow utilities */
@import "./stubs/shadow/styles/03_utilities/shadow.css";
```

## Customization

### Custom Shadow Colors

```html
<!-- Blue shadow -->
<div class="shadow" style="--level: 6; --shadow-color: 0 100 255;">
  Blue shadow
</div>

<!-- Green shadow -->
<div class="shadow" style="--level: 6; --shadow-color: 0 200 100;">
  Green shadow
</div>
```

### Adjusting Shadow Intensity

```html
<!-- Boost shadow intensity -->
<div class="shadow" style="--level: 4; --shadow-boost: 0.2;">
  Intensified shadow
</div>

<!-- Reduce shadow opacity -->
<div class="shadow" style="--level: 8; --shadow-umbra: 0.1; --shadow-penumbra: 0.07;">
  Subtle shadow
</div>
```

### Theme Integration

```css
/* Light theme */
[data-theme="light"] {
  --shadow-color: 0 0 0;
  --shadow-umbra: 0.2;
  --shadow-penumbra: 0.14;
  --shadow-ambient: 0.12;
}

/* Dark theme */
[data-theme="dark"] {
  --shadow-color: 255 255 255;
  --shadow-umbra: 0.1;
  --shadow-penumbra: 0.07;
  --shadow-ambient: 0.06;
}
```

## Browser Support

- Modern browsers with CSS Custom Properties support
- CSS @property support (enhanced type safety)
- CSS calc() function support
- No JavaScript dependencies

## Best Practices

1. **Use appropriate levels** - Cards typically use levels 2-8, dialogs use 16-24
2. **Maintain consistency** - Use the same shadow level for similar UI elements
3. **Consider accessibility** - Ensure sufficient contrast between shadows and backgrounds
4. **Performance** - Avoid animating shadow properties; use transform instead
5. **Theme integration** - Adjust shadow colors and opacity for light/dark themes

## Resources

- [Material Design Elevation Guidelines](https://material.io/design/environment/elevation.html)
- [CSS @property Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [WebBase CLI Documentation](https://github.com/your-org/webbase-cli)
