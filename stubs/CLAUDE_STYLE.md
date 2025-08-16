# CSS Writing Standards for CopyKit

This document provides specific CSS writing guidelines and patterns to follow when developing copy-points in the CopyKit project.

## ⚠️ CRITICAL: Pre-Implementation Compliance Checklist

**Before writing ANY CSS, verify ALL of these requirements:**

### ✅ Selector Pattern Compliance
- [ ] **MANDATORY**: Use child selectors (`.component > .child`) instead of class proliferation (`.component-child`)
- [ ] **MANDATORY**: Keep selectors shallow (max 3 levels deep)
- [ ] **MANDATORY**: Use direct child selectors (>) for performance

### ✅ Variable Pattern Compliance  
- [ ] **MANDATORY**: Define component variables in component selector, NOT in `:root`
- [ ] **MANDATORY**: Component variables must reference base variables (`--component-color: var(--font-color)`)
- [ ] **MANDATORY**: Use colorset variables, NEVER hardcoded colors (`#000`, `blue`, `rgba()`)

### ✅ Architecture Compliance
- [ ] **MANDATORY**: Follow 4-layer organization (defaults, components, utilities, layouts)
- [ ] **MANDATORY**: Use RGB space-separated format for colors (`rgb(var(--color) / 0.5)`)

**❌ STOP: If any checklist item fails, fix it before proceeding**

---

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
  /* Components should define their own variables that reference base variables */
  --component-font-color: var(--font-color);
  --component-bg-color: var(--bg-color);
  --component-border-color: var(--border-color);
  --component-shadow-color: var(--shadow-color);
  --component-shadow-alpha: var(--shadow-alpha);
  
  color: rgb(var(--component-font-color));
  background: rgb(var(--component-bg-color));
  border: 1px solid rgb(var(--component-border-color));
  box-shadow: 0 2px 4px rgb(var(--component-shadow-color) / var(--component-shadow-alpha));
}

.component.accent {
  --component-font-color: var(--accent-font-color);
  --component-bg-color: var(--accent-bg-color);
}

.component:hover {
  --component-font-color: var(--accent-hover-font-color);
  --component-bg-color: var(--accent-hover-bg-color);
}

.component::selection {
  --component-font-color: var(--selection-color);
  --component-bg-color: var(--selection-bg-color);
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

## CSS Variables Quick Reference

The `_base` copy-point provides a comprehensive set of CSS variables that should be reused in new copy-points. Understanding these variables is essential for creating consistent, themeable components.

### Base Color Variables (RGB Space-Separated)
**Core palette colors used throughout the system:**
```css
--color-black: 40 40 40          /* Primary dark color */
--color-white: 255 255 255       /* Primary light color */
--color-gray-300: 209 213 219    /* Light gray */
--color-gray-500: 107 114 128    /* Medium gray */
--color-gray-600: 75 85 99       /* Dark gray */
```

**Usage Pattern:**
```css
.component {
  color: rgb(var(--color-black));
  background: rgba(var(--color-white) / 0.9); /* With alpha */
}
```

### Spacing System Variables
**Multiplier-based spacing system:**
```css
--space-unit: 1em                /* Base unit for all spacing calculations */
--space-xxs: 0.35                /* Extra extra small (0.35em) */
--space-xs: 0.5                  /* Extra small (0.5em) */
--space-sm: 0.7                  /* Small (0.7em) */
--space-base: 1                  /* Base/Medium (1em) */
--space-md: 1.3                  /* Medium (1.3em) */
--space-lg: 1.8                  /* Large (1.8em) */
--space-xl: 3.2                  /* Extra large (3.2em) */
--space-2xl: 4.8                 /* 2x extra large (4.8em) */
```

**Component Usage Pattern:**
```css
.component {
  /* Define component-specific spacing variables that reference base variables */
  --component-padding: var(--space-md);
  --component-margin: var(--space-lg);
  
  padding: calc(var(--space-unit) * var(--component-padding));
  margin: calc(var(--space-unit) * var(--component-margin));
}
```

### Animation/Transition Variables
**Standard timing values:**
```css
--transition-fast: 150ms         /* Quick transitions */
--transition-base: 250ms         /* Standard transitions */
--transition-slow: 350ms         /* Slow transitions */
```

**Component Usage Pattern:**
```css
.component {
  --component-transition-time: var(--transition-base);
  transition: all var(--component-transition-time) ease;
}
```

### Typography Variables
**Font families:**
```css
--font-family-base: system-ui, "Segoe UI", roboto, helvetica, arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
```

**Font weights:**
```css
--font-weight-normal: 400
--font-weight-bold: 700
```

**Font sizes:**
```css
--font-size-sm: 0.875em          /* Small text */
--font-size-base: 1em            /* Standard body text */
--font-size-md: 1.125em          /* Medium text */
--font-size-lg: 1.25em           /* Large text */
--font-size-xl: 1.25em           /* Extra large text */
--font-size-2xl: 1.5rem          /* 2x extra large text */
```

**Line heights:**
```css
--line-height-tight: 1.25        /* Compact line spacing */
--line-height-base: 1.4          /* Standard line spacing */
--line-height-relaxed: 1.6       /* Loose line spacing */
```

**Active typography variables (applied to elements):**
```css
--font-family: var(--font-family-base)     /* Active font family */
--font-weight: var(--font-weight-normal)   /* Active font weight */
--font-size: var(--font-size-base)         /* Active font size */
--font-line-height: var(--line-height-base) /* Active line height */
```

**Component Usage Pattern:**
```css
.component {
  /* Component should define its own font variables */
  --component-font-size: var(--font-size-sm);
  --component-font-weight: var(--font-weight-bold);
  --component-line-height: var(--line-height-tight);
  
  font-size: var(--component-font-size);
  font-weight: var(--component-font-weight);
  line-height: var(--component-line-height);
}
```

### Colorset System Variables
**Complete theming system for consistent UI colors:**

**Core Colors:**
```css
--font-color: var(--color-black)           /* Primary text color */
--bg-color: var(--color-white)             /* Main background color */
--border-color: var(--color-gray-300)      /* Border and divider color */
```

**Visual Enhancement:**
```css
--shadow-color: 0 0 0                      /* RGB for shadows */
--shadow-alpha: 0.1                        /* Shadow opacity (0.0-1.0) */
```

**Interactive Elements:**
```css
--accent-color: var(--color-gray-500)         /* Highlight/accent color */
--accent-font-color: var(--color-white)       /* Text on accent backgrounds */
--accent-bg-color: var(--accent-color)        /* Accent background color */
```

**Hover States:**
```css
--accent-hover-font-color: var(--color-white)  /* Hover text color */
--accent-hover-bg-color: var(--color-gray-600) /* Hover background color */
```

**Text Selection:**
```css
--selection-color: var(--bg-color)          /* Selected text color */
--selection-bg-color: var(--font-color)     /* Selected text background */
```

**Component Usage Pattern:**
```css
.component {
  /* Components should define their own colorset variables */
  --component-font-color: var(--font-color);
  --component-bg-color: var(--bg-color);
  --component-border-color: var(--border-color);
  --component-accent-color: var(--accent-color);
  
  color: rgb(var(--component-font-color));
  background: rgb(var(--component-bg-color));
  border: 1px solid rgb(var(--component-border-color));
}

.component.accent {
  --component-font-color: var(--accent-font-color);
  --component-bg-color: var(--accent-bg-color);
}

.component:hover {
  --component-font-color: var(--accent-hover-font-color);
  --component-bg-color: var(--accent-hover-bg-color);
}
```

### Layout Constraint Variables
**Responsive width system:**
```css
--width-sm: 640px                /* Small breakpoint */
--width-base: 1024px             /* Standard breakpoint */
--width-lg: 1280px               /* Large breakpoint */
--width-content: var(--width-base)  /* Active content width */
--width-min-offset-x: 22px       /* Minimum horizontal offset */
```

**Component Usage Pattern:**
```css
.component {
  --component-max-width: var(--width-content);
  max-width: var(--component-max-width);
}
```

### Headline Variables
**Heading and title styling:**
```css
--headline-space: var(--space-base)        /* Space above headlines */
--headline-family: var(--font-family-base) /* Headline font family */
--headline-weight: var(--font-weight-bold) /* Headline font weight */
--headline-line-height: var(--line-height-base) /* Headline line height */
--headline-color: inherit                   /* Headline text color */
--headline-scale: 1                        /* Headline size multiplier */
```

### Link Variables
**Link styling and behavior:**
```css
--link-color: inherit                       /* Link text color */
--link-decoration: underline                /* Link text decoration */
--link-hover-color: var(--accent-color)    /* Link hover color */
--link-hover-decoration: none               /* Link hover decoration */
--link-transition-time: var(--transition-base) /* Link transition timing */
```

### Variable Usage Best Practices

#### 1. Always Define Component Variables
**✅ Correct Pattern:**
```css
.btn {
  /* Component defines its own variables that reference base variables */
  --btn-font-color: var(--accent-font-color);
  --btn-bg-color: var(--accent-bg-color);
  --btn-font-size: var(--font-size);
  --btn-padding: var(--space-sm);
  
  color: rgb(var(--btn-font-color));
  background: rgb(var(--btn-bg-color));
  font-size: var(--btn-font-size);
  padding: calc(var(--space-unit) * var(--btn-padding));
}
```

**❌ Incorrect Pattern:**
```css
.btn {
  /* Never use base variables directly in component styles */
  color: rgb(var(--accent-font-color));
  background: rgb(var(--accent-bg-color));
  font-size: var(--font-size);
}
```

#### 2. Component Variable Naming Convention
```css
/* Format: --[component-name]-[property] */
--btn-font-color: var(--accent-font-color);
--accordion-border-color: var(--border-color);
--card-bg-color: var(--bg-color);
--modal-shadow-color: var(--shadow-color);
```

#### 3. Predefined vs. Referenced Values
**Predefined base variables** (contain actual values):
```css
--font-size-sm: 0.875em          /* Use when you need the specific small size */
--space-lg: 1.8                  /* Use when you need the specific large spacing */
--color-gray-500: 107 114 128    /* Use when you need the specific gray color */
```

**Referenced variables** (point to other variables):
```css
--font-size: var(--font-size-base)  /* Use when you want the "current" font size */
--accent-color: var(--color-gray-500) /* Use when you want the "current" accent color */
```

**Component Usage Example:**
```css
.component {
  /* Sometimes you need the specific predefined value */
  --component-small-text: var(--font-size-sm);
  
  /* Sometimes you need the current/active value */
  --component-font-size: var(--font-size);
}
```

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
  /* Component defines its own variables */
  --btn-font-color: var(--accent-font-color);
  --btn-bg-color: var(--accent-bg-color);
  --btn-border-color: var(--accent-color);
  
  cursor: pointer;
  color: rgb(var(--btn-font-color));
  background: rgb(var(--btn-bg-color));
}

/* Prefix-based variations */
.btn-primary { 
  --btn-bg-color: var(--accent-bg-color);
}

.btn-outline { 
  --btn-bg-color: transparent;
  border: 1px solid rgb(var(--btn-border-color));
}
```

### Child Selector Strategy
**🚨 CRITICAL REQUIREMENT**: Use child selectors to avoid verbose class names - this is MANDATORY per the compliance checklist above.

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
.component > .control {
  /* Focus indicators that work with colorset system */
  outline: 2px solid rgb(var(--accent-color));
  outline-offset: 2px;
}

.component > .control:focus {
  /* Enhanced focus for accessibility */
  outline-width: 3px;
}
```

#### Proper Content Hiding
```css
.component > .content[hidden] {
  /* Proper hiding for screen readers */
  display: none;
}

.component > .content[aria-hidden="true"] {
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
  /* Component defines its own variables that reference colorset variables */
  --component-font-color: var(--font-color);
  --component-bg-color: var(--bg-color);
  --component-border-color: var(--border-color);
  
  color: rgb(var(--component-font-color));
  background-color: rgb(var(--component-bg-color));
  border: 1px solid rgb(var(--component-border-color));
}

.component.accent {
  /* Accent variants override component variables */
  --component-font-color: var(--accent-font-color);
  --component-bg-color: var(--accent-bg-color);
}

.component:hover {
  /* Hover states override component variables */
  --component-font-color: var(--accent-hover-font-color);
  --component-bg-color: var(--accent-hover-bg-color);
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

**❌ THESE VIOLATIONS FAIL THE COMPLIANCE CHECKLIST:**

1. **Class Proliferation**: Using `.component-child` instead of `.component > .child` (**FAILS SELECTOR PATTERN COMPLIANCE**)
2. **Direct Colors**: Using `#000`, `blue`, `rgba()` instead of colorset variables (**FAILS VARIABLE PATTERN COMPLIANCE**)
3. **Root Variables**: Defining component variables in `:root` instead of component selector (**FAILS VARIABLE PATTERN COMPLIANCE**)
4. **Deep Nesting**: Selectors deeper than 3 levels (**FAILS SELECTOR PATTERN COMPLIANCE**)
5. **Mixing Patterns**: Using compound classes for component variations (**FAILS ARCHITECTURE COMPLIANCE**)
6. **Utility Components**: Creating utilities that behave like components (**FAILS ARCHITECTURE COMPLIANCE**)

**🚨 Always check the compliance checklist at the top of this document before writing CSS**

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
 * <div class="component component-variant">
 *   <div class="child">Complete example</div>
 * </div>
 */
.component.component-variant {
  /* CSS implementation */
}

.component.component-variant > .child {
  /* Child element styling using proper child selectors */
}
```

### @location Key Rules
- Use dot notation: `category.component.variant`
- Each key must be globally unique across the entire project
- Follow hierarchical patterns for better organization
- Examples: `components.button`, `components.button.primary`, `functions.expand`, `utilities.dom.select`
