# Accordion Component Styling Guide

This guide provides comprehensive information on customizing the accordion component using CSS custom properties and modifier classes.

## Overview

The accordion component is built using CSS custom properties (CSS variables) that allow for easy customization without modifying the core CSS. All accordion styles are contained within the `components` CSS layer. The accordion uses simplified selectors with `.accordion > .item`, `.accordion > .control`, and `.accordion > .content` structure.

## HTML Structure

The accordion uses a simplified HTML structure:

```html
<div class="accordion">
  <div class="item">
    <button class="control chevron" aria-expanded="false" aria-controls="content-1">
      Accordion Header
    </button>
    <div class="content" id="content-1" hidden data-animate="accordion">
      Accordion content goes here
    </div>
  </div>
</div>
```

### Key Elements

- **`.accordion`** - Container element
- **`.item`** - Individual accordion item wrapper (replaces `.accordion-item`)
- **`.control`** - Interactive button that toggles content (replaces `.accordion-header`, uses base `.control` class)
- **`.content`** - Collapsible content area (replaces `.accordion-content`, no separate body wrapper needed)

### Selector Structure

All accordion styles use direct child selectors for better specificity and cleaner CSS:

- **`.accordion > .item`** - Targets accordion items
- **`.accordion > .item > .control`** - Targets control buttons within items
- **`.accordion > .item > .content`** - Targets content areas within items

## CSS Custom Properties

### Color Properties

The accordion uses several CSS custom properties for colors:

```css
/* Border colors */
--accordion-border-color: 220 220 220; /* Light gray border */

/* Control colors */
--accordion-control-bg-color: 248 248 248; /* Light gray background */
--accordion-control-hover-bg-color: 240 240 240; /* Slightly darker on hover */

/* Content colors */
--accordion-content-bg-color: 255 255 255; /* White background */
```

### Spacing and Layout Properties

```css
/* Border and layout */
--accordion-border-width: 1px;
--accordion-border-radius: 0;

/* Typography */
--accordion-font-size: var(--font-size);

/* Animation */
--accordion-transition-time: var(--transition-base);
```

## Customization Examples

### 1. Dark Theme Accordion

```css
.accordion.dark {
  --accordion-border-color: 64 64 64;
  --accordion-control-bg-color: 32 32 32;
  --accordion-control-hover-bg-color: 48 48 48;
  --accordion-content-bg-color: 24 24 24;
  --font-color: 255 255 255;
}
```

### 2. Colored Accordion

```css
.accordion.blue {
  --accordion-border-color: 59 130 246;
  --accordion-control-bg-color: 239 246 255;
  --accordion-control-hover-bg-color: 219 234 254;
  --accordion-content-bg-color: 255 255 255;
}

.accordion.green {
  --accordion-border-color: 34 197 94;
  --accordion-control-bg-color: 240 253 244;
  --accordion-control-hover-bg-color: 220 252 231;
  --accordion-content-bg-color: 255 255 255;
}
```

### 3. Rounded Accordion

```css
.accordion.rounded {
  --accordion-border-radius: 8px;
}

.accordion.rounded-lg {
  --accordion-border-radius: 12px;
}
```

### 4. Larger Accordion

```css
.accordion.large {
  --accordion-font-size: var(--font-size-lg);
  --control-py-space: var(--space-md);
  --control-px-space: var(--space-lg);
}
```

### 5. Compact Accordion

```css
.accordion.compact {
  --accordion-font-size: var(--font-size-sm);
  --control-py-space: var(--space-xs);
  --control-px-space: var(--space-sm);
}
```

## Built-in Modifier Classes

### Single-Select Accordion

```css
.accordion.single-select
```

Provides visual styling for single-select behavior. Must be combined with `data-hide-same-level` attribute on controls.

### Chevron Controls

```css
.accordion > .item > .control.chevron
```

Adds a rotating chevron indicator to the control.

## Animation Customization

### Custom Animation Duration

```css
.accordion.slow {
  --accordion-transition-time: var(--transition-slow);
}

.accordion.fast {
  --accordion-transition-time: var(--transition-fast);
}
```

### Custom Animation Effects

You can create custom animation effects by modifying the animation classes:

```css
/* Slide animation */
.accordion.slide .accordion-enter-active,
.accordion.slide .accordion-leave-active {
  transform-origin: top;
  transition: 
    transform var(--accordion-transition-time) ease,
    opacity var(--accordion-transition-time) ease;
}

.accordion.slide .accordion-enter-from,
.accordion.slide .accordion-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade animation */
.accordion.fade .accordion-enter-active,
.accordion.fade .accordion-leave-active {
  transition: opacity var(--accordion-transition-time) ease;
}

.accordion.fade .accordion-enter-from,
.accordion.fade .accordion-leave-to {
  opacity: 0;
}
```

## Advanced Customization

### Custom Control Styles

```css
.accordion > .item > .control.custom {
  --control-font-color: var(--color-white);
  --control-bg-color: var(--color-black);
  --control-hover-bg-color: var(--color-gray);
  
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Custom Content Styles

```css
.accordion > .item > .content.custom {
  --accordion-content-bg-color: 248 250 252;
  
  border-left: 3px solid rgb(var(--accent-color));
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}
```

### Icon Controls

```css
.accordion > .item > .control.icon {
  display: flex;
  align-items: center;
  gap: calc(var(--space-unit) * var(--space-sm));
}

.accordion > .item > .control.icon::before {
  content: '';
  width: 1.25rem;
  height: 1.25rem;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') no-repeat center;
  background-size: contain;
}
```

## Responsive Design

### Mobile-First Approach

```css
.accordion {
  --accordion-font-size: var(--font-size-sm);
  --control-py-space: var(--space-xs);
  --control-px-space: var(--space-sm);
}

@media (min-width: 768px) {
  .accordion {
    --accordion-font-size: var(--font-size-base);
    --control-py-space: var(--space-sm);
    --control-px-space: var(--space-base);
  }
}

@media (min-width: 1024px) {
  .accordion {
    --accordion-font-size: var(--font-size-md);
    --control-py-space: var(--space-base);
    --control-px-space: var(--space-md);
  }
}
```

## Best Practices

1. **Use CSS Custom Properties**: Always use the provided custom properties for consistent theming.

2. **Layer Specificity**: Use modifier classes rather than overriding base styles to maintain specificity.

3. **Accessibility**: Ensure sufficient color contrast when customizing colors.

4. **Animation Performance**: Keep animations lightweight for better performance.

5. **Mobile Considerations**: Test accordion behavior on touch devices.

## Integration with Design Systems

### Using with CSS-in-JS

```javascript
const accordionTheme = {
  '--accordion-border-color': '59 130 246',
  '--accordion-control-bg-color': '239 246 255',
  '--accordion-control-hover-bg-color': '219 234 254',
  '--accordion-content-bg-color': '255 255 255',
}

// Apply to accordion element
Object.assign(accordionElement.style, accordionTheme)
```

### Using with Tailwind CSS

```html
<div class="accordion" style="--accordion-border-color: 59 130 246;">
  <!-- accordion content -->
</div>
```

## Troubleshooting

### Common Issues

1. **Accordion not expanding**: Ensure `aria-controls` matches the content `id`.
2. **Animations not working**: Check that `data-animate="accordion"` is present on content.
3. **Styling not applying**: Verify CSS custom property names are correct.
4. **Keyboard navigation not working**: Ensure the accordion service is properly initialized.

### Debug Mode

Add this CSS to debug accordion structure:

```css
.accordion.debug > .item {
  outline: 2px solid red;
}

.accordion.debug > .item > .control {
  outline: 2px solid blue;
}

.accordion.debug > .item > .content {
  outline: 2px solid green;
}
```

## Resources

- [MDN: Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [CSS Animations Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance)