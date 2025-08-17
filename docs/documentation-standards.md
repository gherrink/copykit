# CSS Documentation Standards

This guide establishes the standards for documenting CSS in the CopyKit project, focusing on `@location` usage, JSDoc best practices, and consistent documentation patterns.

## UI-Doc Integration

This project uses [UI-Doc](https://github.com/gherrink/ui-doc/) for generating component documentation from JSDoc comments in CSS and TypeScript files. UI-Doc automatically processes JSDoc tags to create interactive documentation pages.

**Available JSDoc Tags**: For a complete list of supported JSDoc tags and their usage, see the [UI-Doc core documentation](https://github.com/gherrink/ui-doc/blob/master/packages/core/README.md).

## Documentation Requirements

### 1. All CSS Must Be Documented

Every CSS class that provides user-facing functionality must include proper JSDoc documentation with:

- **Purpose description**: What the class does and when to use it
- **@location key**: Unique identifier for documentation organization
- **@example block**: Complete, functional HTML example
- **Usage notes**: Any special considerations or requirements

### 2. @location Usage (Required)

All CSS documentation **must** use `@location` for organizing content within UI-Doc pages.

#### ✅ Required: @location Pattern

```css
/**
 * Button component that uses colorset variables for theming
 *
 * @location components.button Button
 * @example
 * <button class="btn">Default Button</button>
 * <button class="btn btn-primary">Primary Button</button>
 * <button class="btn" disabled>Disabled Button</button>
 */
.btn {
  /* CSS implementation */
}
```

#### ✅ @page Pattern (For UI-Doc Pages)

```css
/**
 * @page components Components
 */
```

Use `@page` to define new pages in UI-Doc. Each `@page` creates a separate documentation page.

#### ❌ Deprecated: @page + @section Pattern

```css
/**
 * @page components
 * @section button Button
 * @example
 * <button class="btn">Button</button>
 */
.btn {
  /* This @page + @section combination is deprecated - use @location instead */
}
```

### 3. @location Key Rules

**Critical**: `@location` keys must be **globally unique** across the entire project.

#### Naming Convention

Use **dot notation** for hierarchical organization:

```
category.component.variant
```

#### Key Categories

- **`components.*`**: Self-contained UI components
- **`utilities.*`**: Single-purpose utility classes
- **`variables.*`**: CSS custom properties and color systems
- **`functions.*`**: JavaScript functions and services

#### Examples of Good @location Keys

```css
/* Components */
@location components.button Button
@location components.button.primary Primary Button
@location components.button.disabled Disabled Button
@location components.accordion Accordion
@location components.accordion.single Single-select Accordion
@location components.accordion.chevron Accordion with Chevron

/* Utilities */
@location utilities.flex Flex
@location utilities.flex.gap Flex with Gap
@location utilities.grid Grid
@location utilities.grid.cols Grid with Columns
@location utilities.padding Padding
@location utilities.padding.x Padding x-axis

/* Variables */
@location variables.colorset Colorset System
@location variables.space Space System
@location variables.typography Typography

/* Functions */
@location functions.expand Expand Service
@location functions.accordion Accordion Service;
```

#### @location Key Uniqueness Check

Before adding a new `@location` key, verify it doesn't already exist:

```bash
# Search for existing location keys
grep -r "@location" stubs/ docs/ --include="*.css" --include="*.ts" --include="*.md"
```

**Never reuse location keys** - each must be unique across the entire project.

## Documentation Patterns by Type

### Component Documentation

Components require comprehensive documentation showing all variations:

```css
/**
 * Accordion component that uses the base expand functionality with aria-expanded and aria-controls.
 * Each accordion item consists of a control (button) and content area.
 * 
 * For single-select accordions, use `data-accordion="single"` on the accordion container.
 * For animated accordions, add `data-animate="accordion"` to content areas.
 *
 * @location components.accordion Accordion
 * @example
 * <div class="accordion">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="content-1">
 *       Item 1 Header
 *     </button>
 *     <div class="content" id="content-1" hidden>
 *       Item 1 content goes here
 *     </div>
 *   </div>
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="content-2">
 *       Item 2 Header  
 *     </button>
 *     <div class="content" id="content-2" hidden>
 *       Item 2 content goes here
 *     </div>
 *   </div>
 * </div>
 */
.accordion {
  /* Implementation */
}

/**
 * Accordion control with chevron indicator
 *
 * @location components.accordion.chevron Accordion with Chevron
 * @example
 * <div class="accordion">
 *   <div class="item">
 *     <button class="control chevron" aria-expanded="false" aria-controls="content-1">
 *       Header with chevron
 *     </button>
 *     <div class="content" id="content-1" hidden>Content here</div>
 *   </div>
 * </div>
 */
.accordion > .item > .control.chevron::after {
  /* Chevron implementation */
}
```

### Utility Documentation

Utilities focus on practical usage and combination patterns:

```css
/**
 * Using `padding` to add paddings top, right, bottom and left to your element.
 * Possible variables are:
 * - **--[space]** - set directly a spacing unit
 * - **--[space]-space** - set a predefined space
 * 
 * Possible <spaces> are:
 * - **pt** - padding-top
 * - **pr** - padding-right  
 * - **pb** - padding-bottom
 * - **pl** - padding-left
 *
 * @location utilities.padding Padding
 * @example
 * <div class="padding bg"><div style="background: rgb(var(--bg-color)); color: rgb(var(--font-color));">text</div></div>
 */
.padding,
.pxy {
  padding: var(--pt) var(--pr) var(--pb) var(--pl);
}

/**
 * Using `px` to add paddings left and right with same size to your element.
 * Possible variables are:
 * - **--px** - set directly a spacing unit
 * - **--px-space** - set a predefined space
 *
 * @location utilities.padding.x Padding x-axis
 * @example
 * <div class="px bg"><div style="background: rgb(var(--bg-color)); color: rgb(var(--font-color));">text</div></div>
 */
.px {
  padding-left: var(--px);
  padding-right: var(--px);
}
```

### Variable Documentation

Document CSS custom properties and their purpose:

```css
/**
 * Colorset system provides comprehensive color management for UI components.
 * A colorset defines all essential color variables needed for consistent theming.
 *
 * @location variables.colorset Colorset System
 * @example
 * <div class="bg px py">
 *   <p>Uses colorset font and background colors</p>
 *   <button class="btn">Uses colorset accent colors</button>
 * </div>
 */
:root {
  /* Core Colors */
  --font-color: 0 0 0;
  --bg-color: 255 255 255;
  --border-color: 200 200 200;

  /* Interactive Elements */
  --accent-color: 59 130 246;
  --accent-font-color: 255 255 255;
  --accent-bg-color: 59 130 246;

  /* Hover States */
  --accent-hover-font-color: 255 255 255;
  --accent-hover-bg-color: 37 99 235;
}
```

## Example Standards

### Complete Examples Required

All `@example` blocks must show **complete, functional HTML** that can be copied and used immediately:

#### ✅ Good: Complete Example

```css
/**
 * @location components.button.colors Button Colors
 * @example
 * <button class="btn">Button (use current accent colors)</button>
 * <button class="btn cs-primary">Button (use primary colorset)</button>
 * <button class="btn cs-success">Button (use success colorset)</button>
 */
```

#### ❌ Incomplete: Fragment Example

```css
/**
 * @location components.button.colors Button Colors  
 * @example
 * class="btn cs-primary"
 */
```

### Realistic Context

Examples should show realistic usage, not abstract demos:

#### ✅ Good: Realistic Context

```css
/**
 * @location utilities.flex.layout Flex Layout
 * @example
 * <header class="flex gap justify-between items-center px py">
 *   <h1>Site Title</h1>
 *   <nav class="flex gap">
 *     <a href="#" class="btn btn-text">Home</a>
 *     <a href="#" class="btn btn-text">About</a>
 *     <a href="#" class="btn btn-primary">Contact</a>
 *   </nav>
 * </header>
 */
```

#### ❌ Poor: Abstract Demo

```css
/**
 * @location utilities.flex.layout Flex Layout
 * @example
 * <div class="flex gap">
 *   <div>Item</div>
 *   <div>Item</div>
 * </div>
 */
```

## Files Requiring Documentation Updates

Based on codebase analysis, these files need `@page` + `@section` to `@location` conversion:

### 1. Flex Utilities

**File**: `stubs/_base/styles/03_utilities/flex.css`

Current issues:

- Uses deprecated `@page` + `@section` pattern
- Needs conversion to `@location utilities.flex.*` pattern
- Missing documentation for some utility combinations

### 2. Grid Utilities

**File**: `stubs/_base/styles/03_utilities/grid.css`

Current issues:

- Uses deprecated `@page` + `@section` pattern
- Needs conversion to `@location utilities.grid.*` pattern
- Column utilities need better documentation

### 3. Missing Documentation

Files lacking JSDoc documentation entirely:

- `stubs/_base/styles/03_utilities/background.css` (partially documented)
- `stubs/_base/styles/03_utilities/width.css` (no documentation)
- `stubs/_base/styles/03_utilities/height.css` (no documentation)
- `stubs/_base/styles/03_utilities/hidden.css` (no documentation)
- `stubs/_base/styles/03_utilities/wrapper.css` (no documentation)

## Documentation Update Process

### Step 1: Identify Files to Update

```bash
# Find files using deprecated @page pattern
grep -r "@page" stubs/ --include="*.css"

# Find CSS files without any JSDoc
find stubs/ -name "*.css" -exec grep -L "@location\|@page" {} \;
```

### Step 2: Convert @page + @section to @location

```css
/* Before */
/**
 * @page utilities
 * @section flex Flex
 */

/* After */
/**
 * @location utilities.flex Flex
 */
```

### Step 3: Add Missing Documentation

For undocumented utilities, add complete JSDoc blocks:

```css
/**
 * Utility class description and purpose
 *
 * @location utilities.category.name Display Name
 * @example
 * <complete>HTML example</complete>
 */
.utility-class {
  /* Implementation */
}
```

### Step 4: Verify Uniqueness

After adding new `@location` keys, verify no duplicates exist:

```bash
# Extract all @location keys and check for duplicates
grep -r "@location" stubs/ docs/ --include="*.css" --include="*.ts" --include="*.md" \
  | sed 's/.*@location //' | sed 's/ .*//' | sort | uniq -d
```

## TypeScript Documentation Standards

For TypeScript services and utilities, use similar patterns:

````typescript
/**
 * Expand service manages ARIA-based expand/collapse functionality for components.
 * Handles aria-expanded, aria-controls, inert attributes, and keyboard navigation.
 *
 * @location functions.expand Expand Service
 * @example
 * ```typescript
 * import { ExpandService } from '@/services/expand'
 *
 * const expandService = new ExpandService()
 * expandService.init(document.querySelector('.accordion'))
 * ```
 */
export class ExpandService {
  // Implementation
}
````

## Documentation Quality Checklist

Before submitting CSS documentation, verify:

- [ ] **@location key is unique** across entire project
- [ ] **@location follows dot notation** (category.component.variant)
- [ ] **Description explains purpose** and when to use the class
- [ ] **Example is complete and functional** HTML that can be copied
- [ ] **Example shows realistic usage** not abstract demos
- [ ] **All variations are documented** with separate @location keys
- [ ] **Custom properties are explained** with available options
- [ ] **Accessibility considerations** are mentioned for interactive elements
- [ ] **Integration examples** show how to combine with other classes

## Common Documentation Mistakes

### ❌ Duplicate @location Keys

```css
/* File 1 */
@location utilities.text Text

/* File 2 */  
@location utilities.text Text; /* DUPLICATE - NOT ALLOWED */
```

### ❌ Generic @location Keys

```css
@location button Button  /* Too generic */
@location utility Utility; /* Meaningless */
```

### ❌ Incomplete Examples

```css
/**
 * @example
 * <div class="btn">  <!-- Missing closing tag -->
 */
```

### ❌ No Context Examples

```css
/**
 * @example
 * <div>Test</div>  <!-- Doesn't show actual usage -->
 */
```

### ❌ Missing Variations

```css
/**
 * @location components.button Button
 * @example
 * <button class="btn">Button</button>
 * <!-- Missing btn-primary, btn-text, disabled examples -->
 */
```

Following these documentation standards ensures consistent, discoverable, and useful CSS documentation throughout the CopyKit project.
