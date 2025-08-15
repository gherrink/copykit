# CSS Writing Standards for CopyKit

This document provides specific CSS writing guidelines and patterns to follow when developing copy-points in the CopyKit project.

## Core CSS Principles

### 1. Hybrid Pattern Architecture
Use different CSS patterns for different purposes:

- **Components**: Prefix-based variations (`.btn`, `.btn-primary`)
- **Utilities**: Compound classes (`.flex.gap.column`) 
- **Structure**: Child selectors (`.accordion > .item > .control`)

### 2. Always Use Colorset Variables
**REQUIRED**: Never use direct color values. Always use colorset variables for consistent theming.

#### Colorset System Overview
CopyKit uses a **colorset** approach for systematic color management. A colorset is a comprehensive color definition system that establishes a complete visual identity for UI components or sections, providing all essential color variables needed for consistent theming across your entire application.

#### Available Colorset Variables

**Core Colors:**
- `--font-color` - Primary text color for readable content
- `--bg-color` - Main background color for containers and surfaces
- `--border-color` - Color for borders, dividers, and outlines

**Visual Enhancement:**
- `--shadow-color` - RGB values for drop shadows and depth effects
- `--shadow-alpha` - Opacity level for shadow transparency (0.0-1.0)

**Interactive Elements:**
- `--accent-color` - Highlight color for UI elements and emphasis
- `--accent-font-color` - Text color when displayed on accent backgrounds
- `--accent-bg-color` - Background color for accent elements and highlights

**Hover States:**
- `--accent-hover-font-color` - Text color for interactive elements on hover
- `--accent-hover-bg-color` - Background color for interactive elements on hover

**Text Selection:**
- `--selection-color` - Text color when selected by user
- `--selection-bg-color` - Background color for selected text

**✅ Required Pattern:**
```css
.component {
  color: rgb(var(--font-color));
  background: rgb(var(--bg-color));
  border: 1px solid rgb(var(--border-color));
  box-shadow: 0 2px 4px rgb(var(--shadow-color) / var(--shadow-alpha));
}

.component.accent {
  color: rgb(var(--accent-font-color));
  background: rgb(var(--accent-bg-color));
}

.component:hover {
  color: rgb(var(--accent-hover-font-color));
  background: rgb(var(--accent-hover-bg-color));
}

.component::selection {
  color: rgb(var(--selection-color));
  background: rgb(var(--selection-bg-color));
}
```

**❌ Forbidden Patterns:**
```css
.component {
  color: #000000;
  background: blue;
  border: 1px solid #cccccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

#### Benefits of Colorsets
- **Component theming** - Apply consistent colors across buttons, cards, forms, and other UI elements
- **Section-based styling** - Define distinct visual zones like headers, sidebars, or content areas
- **Theme variations** - Create light/dark modes or brand-specific color schemes
- **Contextual styling** - Differentiate between states like default, success, warning, or error
- **Systematic design** - Maintain visual consistency with predefined color relationships
- **Easy theme switching** - Swap entire color schemes without touching individual component styles
- **Automatic theme compatibility** - Works across all copy-points
- **Consistent visual identity** - When mixing copy-points
- **Easy customization** - Override colorset variables for new themes
- **Future-proof** - For light/dark mode implementations

#### Development Guidelines
- Always use colorset variables instead of direct color values
- Create new colorsets for different themes or component contexts
- Ensure all colorset variables work harmoniously together
- Test color combinations for accessibility and contrast requirements

## Available Classes from `_base` Copy-Point

The `_base` copy-point provides a comprehensive foundation that should be reused in new copy-points rather than recreated. Here's a quick reference of what's available:

### Reset & Defaults (Automatic)
**Applied automatically when importing `_base`:**
- **Border-box sizing** - All elements use `box-sizing: border-box`
- **Responsive media** - Images, videos, canvas responsive by default (`max-width: 100%`)
- **Smooth scrolling** - `scroll-behavior: smooth` with scroll padding support
- **Text selection** - Uses colorset variables for consistent selection colors
- **Typography base** - Font smoothing, inheritance, overflow-wrap for readability
- **Form inheritance** - Inputs, buttons inherit font settings

### Variables & Colorset (Always Available)
**CSS custom properties defined in `:root`:**
- **Colors**: `--color-black`, `--color-white`, `--color-gray-*` (RGB space-separated)
- **Spacing**: `--space-xxs` through `--space-2xl` (0.35 - 4.8 multipliers)
- **Animation**: `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (350ms)
- **Colorset system**: Complete set of theme variables (font, bg, border, accent, hover, selection colors)
- **Typography**: Font families, weights, sizes, line heights
- **Width constraints**: `--width-sm` (640px), `--width-base` (1024px), `--width-lg` (1280px)

### Typography Classes
**Headlines:**
- `.headline` + `.h1` through `.h6` - Semantic headline styling without HTML semantics
- `.headline.no-space` - Remove top margin from headlines
- `h1` through `h6` - Standard HTML headlines with consistent sizing scale

**Text formatting (applied via CSS reset):**
- `strong`, `b` - Bold weight using `--font-weight-bold`
- `small` - Smaller text using `--font-size-sm`
- `a` - Consistent link styling with hover transitions

### Component Classes
**Buttons (`.btn`):**
- `.btn` - Base button component with colorset integration
- `.btn[disabled]`, `.btn[aria-disabled="true"]` - Disabled states
- `.btn.cs-*` - Use with colorset classes for theming
- `.btn.no-hover` - Disable hover effects

**Controls (`.control`):**
- `.control` - Base control component (lightweight button alternative)
- `.control.py`, `.control.px`, `.control.pxy` - Padding modifiers
- Works with colorset system and accessibility states

**Images (`.image`):**
- `.image` - Responsive image container for `<picture>` elements
- Provides proper responsive behavior and positioning

### Layout Utilities
**Flexbox (`.flex`):**
- `.flex` - Base flexbox container
- `.flex.gap` - Add gap spacing (customizable with `--gap-space`)
- `.flex.row` / `.flex.column` - Direction control
- `.flex.wrap` / `.flex.nowrap` - Wrap behavior
- **Justification**: `.justify-start`, `.justify-between`, `.justify-around`, `.justify-evenly`, `.justify-end`
- **Alignment**: `.items-start`, `.items-center`, `.items-end`, `.items-stretch`, `.items-baseline`
- **Special**: `.pull-right` - Auto-margin for right alignment in flex rows

**Grid (`.grid`):**
- `.grid` - Base grid container
- `.grid.gap` - Add gap spacing
- `.grid.cols` - 12-column grid system
- **Column spanning**: `.col-span-1` through `.col-span-12`
- **Column positioning**: `.col-start-1` through `.col-start-12`, `.col-end-1` through `.col-end-12`

### Spacing Utilities
**Margin:**
- **Individual**: `.mt`, `.mr`, `.mb`, `.ml` - Single direction margins
- **Axis**: `.mx` (left+right), `.my` (top+bottom), `.mxy` (all)
- **Full**: `.margin` - All directions
- Customizable with `--*-space` variables (e.g., `--mt-space: var(--space-lg)`)

**Padding:**
- **Individual**: `.pt`, `.pr`, `.pb`, `.pl` - Single direction padding
- **Axis**: `.px` (left+right), `.py` (top+bottom), `.pxy` (all)
- **Full**: `.padding` - All directions
- Customizable with `--*-space` variables (e.g., `--px-space: var(--space-md)`)

### Sizing Utilities
**Width:**
- **Content constraints**: `.width-content`, `.width-base`, `.width-sm`, `.width-lg`
- **Responsive**: Uses `--width-content` and `--width-min-offset-x` for smart responsive behavior
- **Basic**: `.width-full` (100%), `.width-auto`, `.width-fit` (fit-content)

**Height:**
- `.height-full` (100%), `.height-auto`, `.height-fit` (fit-content)

### Visual Utilities
**Background:**
- `.bg` - Apply colorset background and text colors
- Automatically integrates with colorset system
- Inverts selection colors for better contrast

**Text:**
- **Alignment**: `.text-left`, `.text-center`, `.text-right`, `.text-justify`
- **Colors**: `.tc` (current colorset), `.tc-white`, `.tc-black`

**Visibility:**
- `.hidden` - Hide elements (`display: none`)
- `[hidden]` - Attribute-based hiding (preferred for accessibility)

### Container Utilities
**Wrapper:**
- `.wrapper` - Remove margins from first/last children to prevent spacing issues

### Usage Examples in New Copy-Points
```html
<!-- Reusing _base components and utilities -->
<div class="flex gap items-center">
  <button class="btn cs-primary">Primary Action</button>
  <button class="control px py">Secondary</button>
</div>

<div class="grid cols gap width-content">
  <div class="col-span-8">
    <div class="wrapper px py bg">
      <h2>Content uses base styles</h2>
      <p>Inherits typography and spacing</p>
    </div>
  </div>
  <div class="col-span-4 px py">
    <picture class="image">
      <img src="..." alt="Uses base image component" />
    </picture>
  </div>
</div>
```

**Key Benefits of Reusing `_base` Classes:**
- **Consistent theming** - All classes integrate with colorset system
- **Accessibility built-in** - Focus management, ARIA support, user preferences
- **Performance** - No duplicate CSS, smaller bundle sizes
- **Maintenance** - Updates to `_base` benefit all copy-points
- **Predictable behavior** - Well-tested, standardized implementations

### 3. RGB Space-Separated Format
Use RGB format with space-separated values for alpha transparency support:

```css
/* Enables alpha transparency */
.component {
  background: rgb(var(--accent-color) / 0.1);
  border: 1px solid rgb(var(--accent-color) / 0.5);
}
```

## Component Pattern Guidelines

### When to Use Component Pattern
- Creating distinct UI elements (buttons, cards, accordions)
- Element has multiple visual or functional variations
- Need consistent behavior across all variations
- Element represents a complete interface component

### Component Implementation
```css
/* Base component */
.btn {
  cursor: pointer;
  color: rgb(var(--accent-font-color));
  background: rgb(var(--accent-bg-color));
}

/* Prefix-based variations */
.btn-primary { 
  background: rgb(var(--accent-bg-color)); 
}

.btn-outline { 
  background: transparent;
  border: 1px solid rgb(var(--accent-color));
}
```

### Child Selector Strategy
Use child selectors to avoid verbose class names:

**✅ Clean Structure:**
```html
<div class="accordion">
  <div class="item">
    <button class="control chevron">Header</button>
    <div class="content">Content</div>
  </div>
</div>
```

```css
.accordion > .item > .control {
  width: 100%;
  text-align: left;
}

.accordion > .item > .control.chevron::after {
  content: "";
  border-right: 2px solid currentcolor;
  border-bottom: 2px solid currentcolor;
  transform: rotate(45deg);
}
```

**Child Selector Rules:**
- Keep selectors shallow (max 3 levels)
- Use direct child selectors (>) for performance
- Combine with state selectors when needed
- Don't use for utilities (utilities should be independent)

## Utility Pattern Guidelines

### When to Use Utility Pattern
- Creating single-purpose styling (spacing, layout, colors)
- Want composable, chainable functionality
- Styling applies to many different elements
- Building flexible layout systems

### Utility Implementation
```css
/* Compound class pattern */
.flex { display: flex; }
.flex.gap { gap: var(--gap-space); }
.flex.column { flex-direction: column; }
.flex.items-center { align-items: center; }

/* Smart grid system */
.grid.cols { 
  grid-template-columns: repeat(var(--grid-cols, 12), minmax(0, 1fr));
}

.grid.cols > .col-span-6 {
  grid-column: span 6;
}
```

## CSS Layer Organization

Copy-points use a 4-layer CSS architecture that provides clear separation of concerns and predictable cascade behavior.

### 4-Layer Structure
1. **01_defaults/**: Variables, resets, typography, global properties
2. **02_components/**: Self-contained UI components
3. **03_utilities/**: Single-purpose utility classes  
4. **04_layouts/**: Page-level structural styles

### Layer Structure and Purpose

**1. Defaults (`01_defaults/`):**
- **Why first**: Establishes foundation that everything else builds on
- **Contains**: CSS custom properties, browser resets, base typography
- Browser resets and normalizations
- CSS custom properties and colorset variables
- Typography base styles
- Global configuration

**2. Components (`02_components/`):**
- **Why second**: Components need default values but override them
- **Contains**: Buttons, accordions, controls, modals, cards
- Reusable UI components
- Self-contained component styles
- Component variants and states
- Interactive element styling
- Component states (hover, focus, active)
- ARIA and accessibility styles

**3. Utilities (`03_utilities/`):**
- **Why third**: Utilities can override component defaults when needed
- **Contains**: Spacing, layout, colors, text alignment
- Single-purpose utility classes
- Spacing, layout, and positioning
- Text and color utilities
- Responsive helpers

**4. Layouts (`04_layouts/`):**
- **Why last**: Layouts can override anything for specific page needs
- **Contains**: Page containers, section layouts, responsive breakpoints
- Page-level structural styles
- Grid and flexbox layouts
- Container and wrapper styles
- Layout-specific component arrangements
- Accessibility overrides (prefers-contrast, reduced-motion)

### Benefits of Layer Organization

**Predictable Cascade:**
- Utilities can override component styles when combined
- Layout styles can override both components and utilities
- Clear hierarchy prevents unexpected style conflicts

**Easy Maintenance:**
- Related styles are logically grouped
- Easy to find and modify specific types of styles
- Clear boundaries between different style purposes

### Special Notes
- Only `_base/` has an `index.css` master import file
- Other copy-points import specific CSS files as needed
- Not all copy-points require JavaScript (some are CSS-only)
- Layer directories are created even if empty to maintain consistency

## Integration Patterns

### Components + Utilities
```html
<!-- Natural composition -->
<button class="btn btn-primary px py mt">Enhanced Button</button>

<div class="accordion mt mb">
  <div class="item">
    <button class="control chevron px py">Padded Control</button>
  </div>
</div>
```

### Layout + Components
```html
<div class="flex gap justify-between items-center">
  <h1>Title</h1>
  <div class="flex gap">
    <button class="btn btn-text">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

## Accessibility CSS Requirements

Copy-points must follow comprehensive accessibility standards to ensure consistent, inclusive user experiences across all components.

### Component-Level Accessibility CSS

When developing copy-points, components should handle their own specific accessibility behaviors through CSS:

#### Focus Management
```css
.component .control {
  /* Focus indicators that work with colorset system */
  outline: 2px solid rgb(var(--accent-color));
  outline-offset: 2px;
}

.component .control:focus {
  /* Enhanced focus for accessibility */
  outline-width: 3px;
}
```

#### Proper Content Hiding
```css
.component .content[hidden] {
  /* Proper hiding for screen readers */
  display: none;
}

.component .content[aria-hidden="true"] {
  /* Alternative hiding method */
  visibility: hidden;
}
```

### Layout-Level Accessibility CSS

Copy-points should include layout files (`04_layouts/`) only for global accessibility overrides:

#### User Preference Handling
```css
/* 04_layouts/prefers-contrast.css - Override colorset for high contrast */
@media (prefers-contrast: more) {
  .component {
    --font-color: 0 0 0;
    --bg-color: 255 255 255;
    --border-color: 0 0 0;
    --accent-color: 0 0 0;
  }
}

/* 04_layouts/reduced-motion.css - Disable animations */
@media (prefers-reduced-motion: reduce) {
  .component {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}
```

#### When to Add Layout Accessibility Files
- **Always add** if your copy-point introduces new interactive elements
- **Include prefers-contrast overrides** if using custom colorset variations
- **Include reduced-motion overrides** if adding animations or transitions
- **Follow the _base pattern** for consistent implementation

### Colorset Accessibility Integration

Always ensure copy-point colors work with accessibility overrides:

#### Required Colorset Patterns
```css
.component {
  /* Use colorset variables for automatic accessibility support */
  color: rgb(var(--font-color));
  background-color: rgb(var(--bg-color));
  border: 1px solid rgb(var(--border-color));
}

.component.accent {
  /* Accent variants must use colorset accent variables */
  color: rgb(var(--accent-font-color));
  background-color: rgb(var(--accent-bg-color));
}

.component:hover {
  /* Hover states use colorset hover variables */
  color: rgb(var(--accent-hover-font-color));
  background-color: rgb(var(--accent-hover-bg-color));
}

/* Selection states for accessibility */
.component::selection {
  color: rgb(var(--selection-color));
  background-color: rgb(var(--selection-bg-color));
}
```

### Accessibility Requirements Summary

**Component CSS Must Include:**
- Focus indicators using colorset system
- Proper content hiding for screen readers
- ARIA state styling support
- Keyboard navigation visual feedback

**Layout CSS Should Include:**
- User preference media queries (prefers-contrast, prefers-reduced-motion)
- Colorset overrides for accessibility modes
- Animation and transition controls
- High contrast color schemes

**Documentation Requirements:**
Copy-point README.md files must document accessibility features with required sections covering WCAG compliance, keyboard navigation, screen reader support, and user preference handling.

## Performance Best Practices

### Selector Efficiency
- Child selectors (>) are more efficient than descendant selectors
- Class selectors are faster than attribute or pseudo-selectors
- Keep selectors shallow (max 3 levels)

### CSS Size Optimization
- Utilities prevent property duplication
- Child selectors reduce total number of classes needed
- Colorset variables enable theme switching without duplicate CSS

## Common Pitfalls to Avoid

1. **Mixing Patterns**: Don't use compound classes for component variations
2. **Deep Nesting**: Keep child selectors shallow (max 3 levels)
3. **Utility Components**: Don't create utilities that behave like components
4. **Direct Colors**: Always use colorset variables, never direct color values
5. **Class Proliferation**: Use child selectors instead of verbose class names

## CSS Documentation Standards

### When to Add JSDoc Documentation
Only document CSS where it provides meaningful showcase value:

**Document these patterns:**
- Base components with complete usage examples
- Component variants that showcase different behaviors
- Interactive features with special behaviors
- Complex patterns requiring specific HTML structure

**Don't document these patterns:**
- Simple structural elements
- Basic utility classes or state selectors
- Internal implementation details

### Documentation Template
```css
/**
 * Brief description of the component variant and its purpose
 *
 * @location components.component-name.variant Component Variant Name
 * @example
 * <!-- Complete, minimal example showing full functional structure -->
 * <div class="component variant">
 *   <div class="child">Complete example</div>
 * </div>
 */
.component.variant {
  /* CSS implementation */
}
```

### @location Key Rules
- Use dot notation: `category.component.variant`
- Each key must be globally unique across the entire project
- Follow hierarchical patterns for better organization
- Examples: `components.button`, `components.button.primary`, `functions.expand`, `utilities.dom.select`
