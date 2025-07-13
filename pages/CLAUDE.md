# CLAUDE.md - Pages Directory

This file provides guidance for creating new page examples in the CopyKit project.

## Page Creation Process

### 1. Create Page Directory Structure

```
pages/[page-name]/
├── index.html          # Main page content (required)
├── [page-name].ts      # TypeScript file for interactivity (optional)
└── style.css           # Custom styles (optional)
```

### 2. Use Consistent Directory Naming
- **Lowercase only**: `basic`, `themed`, `accordion`
- **Kebab-case**: Use hyphens for multi-word names (`dark-theme`, `advanced-grid`)
- **Descriptive**: Name should indicate the page's purpose or demo focus

### 3. Auto-Discovery System
Pages are automatically discovered by `pages.ts` using the glob pattern:
```typescript
const pages = import.meta.glob('/[a-z0-9][a-z0-9-_]*/index.html')
```

**Requirements for Auto-Discovery:**
- Directory must start with lowercase letter or number
- Must contain `index.html` file
- Will appear automatically on the main pages list

## HTML Structure Template

### Basic Page Structure
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
    <link rel="shortcut icon" href="../favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Page Title] | CopyKit</title>
    <link rel="stylesheet" href="../style.css" />
    <!-- Optional: Custom styles -->
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <header class="wrapper width-content py bg cs-primary">
      <nav class="flex items-center justify-between">
        <a href="../" class="control">← Back to Pages</a>
        <h1 class="headline no-space">[Page Title]</h1>
      </nav>
    </header>
    <main class="wrapper width-content py" style="--py-space: var(--space-xl)">
      <!-- Page content -->
    </main>
    <footer class="wrapper width-content py bg cs-primary">Footer</footer>
    
    <!-- Optional: TypeScript file -->
    <script type="module" src="./page-name.ts"></script>
  </body>
</html>
```

### Critical Requirements

#### 1. **ALWAYS Include Back Navigation**
```html
<a href="../" class="control">← Back to Pages</a>
```
- Must be in header navigation
- Use `class="control"` for consistent styling
- Always link to `../` (parent directory)

#### 2. **Consistent Title Format**
```html
<title>[Page Name] | CopyKit</title>
```

#### 3. **Base CSS Import**
```html
<link rel="stylesheet" href="../style.css" />
```
- Always import from parent directory (`../style.css`)
- This provides access to all @stubs/_base/ styles

#### 4. **Standard Meta Tags**
```html
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="../favicon.svg" />
<link rel="shortcut icon" href="../favicon.ico" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## CSS Integration Guide

### Base Styles Import
The `../style.css` file imports all foundation styles:
```css
@import url("../stubs/_base/styles/index.css");
@import url("../stubs/accordion/styles/02_components/accordion.css");
@import url("../stubs/elevate/styles/03_utilities/elevate.css");
@import url("../stubs/shadow/styles/03_utilities/shadow.css");
```

### Custom Page Styles
Create `style.css` in your page directory for custom styles using the colorset system:

```css
:root {
  /* Define custom colors as RGB values */
  --color-custom-red: 255 0 0;
  --color-custom-green: 0 128 0;
  --color-custom-purple: 128 0 128;
}

@layer utilities {
  /* Create complete colorsets with all required variables */
  .cs-danger {
    --font-color: var(--color-white);
    --bg-color: var(--color-custom-red);
    --border-color: var(--color-gray);
    --shadow-color: var(--color-custom-red);
    --shadow-alpha: 0.1;
    --accent-color: var(--color-white);
    --accent-font-color: var(--color-custom-red);
    --accent-bg-color: var(--color-white);
    --accent-hover-font-color: var(--color-custom-red);
    --accent-hover-bg-color: var(--color-white);
    --selection-color: var(--color-custom-red);
    --selection-bg-color: var(--color-white);
  }

  .cs-success {
    --font-color: var(--color-white);
    --bg-color: var(--color-custom-green);
    --border-color: var(--color-gray);
    --shadow-color: var(--color-custom-green);
    --shadow-alpha: 0.1;
    --accent-color: var(--color-white);
    --accent-font-color: var(--color-custom-green);
    --accent-bg-color: var(--color-white);
    --accent-hover-font-color: var(--color-custom-green);
    --accent-hover-bg-color: var(--color-white);
    --selection-color: var(--color-custom-green);
    --selection-bg-color: var(--color-white);
  }
}
```

**IMPORTANT: Always use the colorset system** instead of individual color properties:
- ✅ **Correct**: Define complete `.cs-` classes with all colorset variables
- ❌ **Incorrect**: Setting individual `--bg-color` or `--font-color` without the full colorset
- ✅ **Benefits**: Automatic theme compatibility, consistent styling, easy switching between color schemes

## Available Base Styles Summary

### Layout & Container Utilities

#### Wrapper & Width
- **`wrapper`** - Content wrapper that resets margins on first/last child
- **`width-content`** - Content-width container (default: 1024px, customizable via `--width-content`)
- **`width-base`** - Same as `width-content` (1024px)
- **`width-sm`** - Small width container (640px)
- **`width-lg`** - Large width container (1280px)
- **`width-full`** - Full width (100%)
- **`width-auto`** - Auto width
- **`width-fit`** - Fit-content width

#### Height
- **`height-full`** - Full height (100%)
- **`height-auto`** - Auto height
- **`height-fit`** - Fit-content height

### Spacing System

#### Margin Utilities
- **`mt`** - Margin top (configurable via `--mt-space`)
- **`mr`** - Margin right (configurable via `--mr-space`)
- **`mb`** - Margin bottom (configurable via `--mb-space`)
- **`ml`** - Margin left (configurable via `--ml-space`)
- **`mx`** - Margin left and right (configurable via `--mx-space`)
- **`my`** - Margin top and bottom (configurable via `--my-space`)
- **`margin`**, **`mxy`** - All margins

#### Padding Utilities
- **`pt`** - Padding top (configurable via `--pt-space`)
- **`pr`** - Padding right (configurable via `--pr-space`)
- **`pb`** - Padding bottom (configurable via `--pb-space`)
- **`pl`** - Padding left (configurable via `--pl-space`)
- **`px`** - Padding left and right (configurable via `--px-space`)
- **`py`** - Padding top and bottom (configurable via `--py-space`)
- **`padding`**, **`pxy`** - All paddings

#### Spacing Customization
Use CSS variables to customize spacing:
```css
/* Examples */
.my-element {
  --py-space: var(--space-xl); /* Large vertical padding */
  --mt-space: var(--space-lg);  /* Large top margin */
}
```

### Flexbox System

#### Basic Flex
- **`flex`** - Display flex
- **`row`** - Flex direction row (default, with `.pull-right` support)
- **`column`** - Flex direction column
- **`wrap`** - Flex wrap
- **`nowrap`** - Flex nowrap

#### Justify Content
- **`justify-start`** - Justify content flex-start
- **`justify-center`** - Justify content center
- **`justify-end`** - Justify content flex-end
- **`justify-between`** - Justify content space-between
- **`justify-around`** - Justify content space-around
- **`justify-evenly`** - Justify content space-evenly

#### Align Items
- **`items-start`** - Align items flex-start
- **`items-center`** - Align items center
- **`items-end`** - Align items flex-end
- **`items-stretch`** - Align items stretch
- **`items-baseline`** - Align items baseline

#### Flex Helpers
- **`pull-right`** - Used with `.row` to push elements to the right

### Grid System

#### Basic Grid
- **`grid`** - Display grid
- **`cols`** - Enable 12-column grid system (customizable via `--grid-cols`)

#### Grid Columns (1-12)
- **`col-span-1`** to **`col-span-12`** - Column span utilities
- **`col-start-1`** to **`col-start-12`** - Column start position
- **`col-end-1`** to **`col-end-12`** - Column end position (inclusive)

#### Grid Examples
```html
<div class="grid cols gap">
  <div class="col-span-6">Half width</div>
  <div class="col-span-3">Quarter width</div>
  <div class="col-start-10 col-span-3">Right aligned</div>
</div>
```

### Gap System

#### Gap Sizes
- **`gap`** - Default gap (uses `--space-base`)
- **`gap-xs`** - Extra small gap
- **`gap-sm`** - Small gap
- **`gap-base`** - Base gap
- **`gap-md`** - Medium gap
- **`gap-lg`** - Large gap
- **`gap-xl`** - Extra large gap
- **`gap-2xl`** - 2x extra large gap

#### Directional Gaps
- **`gap-x-[size]`** - Horizontal gap only
- **`gap-y-[size]`** - Vertical gap only

### Typography & Text

#### Text Alignment
- **`text-left`** - Text align left
- **`text-center`** - Text align center
- **`text-right`** - Text align right
- **`text-justify`** - Text align justify

#### Text Colors
- **`tc`** - Apply text color (uses `--font-color`)
- **`tc-white`** - White text color
- **`tc-black`** - Black text color

#### Typography Classes (from pages)
- **`headline`** - Headline text styles
- **`h1`**, **`h2`**, **`h3`**, **`h4`** - Heading size variants
- **`no-space`** - Remove margin/padding from typography

### Colorset System

CopyKit uses a comprehensive **colorset** approach for systematic color management. A colorset provides all essential color variables needed for consistent theming across your entire application.

#### Colorset Variables
Every colorset defines these variables:
- **`--font-color`** - Primary text color for readable content
- **`--bg-color`** - Main background color for containers and surfaces  
- **`--border-color`** - Color for borders, dividers, and outlines
- **`--shadow-color`** - RGB values for drop shadows and depth effects
- **`--shadow-alpha`** - Opacity level for shadow transparency (0.0-1.0)
- **`--accent-color`** - Highlight color for UI elements and emphasis
- **`--accent-font-color`** - Text color when displayed on accent backgrounds
- **`--accent-bg-color`** - Background color for accent elements and highlights
- **`--accent-hover-font-color`** - Text color for interactive elements on hover
- **`--accent-hover-bg-color`** - Background color for interactive elements on hover
- **`--selection-color`** - Text color when selected by user
- **`--selection-bg-color`** - Background color for selected text

#### Using Colorsets
Apply colorsets with `.cs-` utility classes:
```html
<!-- Apply colorset to container -->
<div class="bg cs-primary">Content with primary colorset</div>

<!-- Apply colorset to button -->
<button class="btn cs-secondary">Secondary Button</button>

<!-- Colorsets work with any component -->
<header class="wrapper py bg cs-primary">Header content</header>
```

#### Default Colorset
The default colorset is defined in `:root` and inherited by all elements unless overridden.

#### Benefits
- **Component theming** - Apply consistent colors across buttons, cards, forms
- **Theme variations** - Create light/dark modes or brand-specific color schemes  
- **Easy theme switching** - Swap entire color schemes without touching individual components
- **Systematic design** - Maintain visual consistency with predefined color relationships

### Background System

#### Background Base
- **`bg`** - Apply background system (required for colorset utilities)

#### Available Colorset Classes
- **`cs-primary`** - Default primary colorset (black background, white text, gray accents)
- **Custom colorsets** - Create additional `.cs-` classes in page-specific stylesheets (see themed page example)

#### Usage with Background System
```html
<!-- Apply default primary colorset to background containers -->
<div class="bg cs-primary">Primary themed content (black bg, white text)</div>

<!-- Colorsets work without background system for text-only styling -->
<span class="cs-primary">Themed text with primary colors</span>

<!-- Custom colorsets (defined in page-specific stylesheets) -->
<div class="bg cs-custom">Custom themed content</div>
```

### Component System

#### Button Component
- **`btn`** - Base button component
- **Color variants**: Combine with colorset classes (`.cs-primary`, `.cs-secondary`, etc.)
- **States**: `:disabled`, `[aria-disabled="true"]`, `.no-hover`
- **Customization**: Use `--btn-*` CSS variables or inherit from colorset variables

```html
<button class="btn">Default Button (inherits default colorset)</button>
<button class="btn cs-primary">Primary Button (black bg, white text)</button>
<button class="btn cs-custom">Custom Button (defined in page stylesheet)</button>
<button class="btn" disabled>Disabled Button</button>
```

#### Control Component
- **`control`** - Base control element (links, buttons)
- **`chevron`** - Add chevron indicator (used in accordions)
- **Padding**: Add `px`, `py`, or `pxy` for padding
- **States**: `:disabled`, `[aria-disabled="true"]`, `.no-hover`

```html
<a href="../" class="control">← Back Link</a>
<button class="control chevron" aria-expanded="false">Expandable</button>
```

### CSS Custom Properties (Variables)

#### Colors
```css
--color-black: 40 40 40;
--color-gray: 128 128 128;
--color-white: 255 255 255;

/* Usage colors */
--bg-color: var(--color-white);
--font-color: /* inherited from context */
--accent-color: var(--color-gray);
```

#### Spacing Scale
```css
--space-unit: 1em;
--space-xxs: 0.35;  /* 0.35em */
--space-xs: 0.5;    /* 0.5em */
--space-sm: 0.7;    /* 0.7em */
--space-base: 1;    /* 1em */
--space-md: 1.3;    /* 1.3em */
--space-lg: 1.8;    /* 1.8em */
--space-xl: 3.2;    /* 3.2em */
--space-2xl: 4.8;   /* 4.8em */
```

#### Width Constraints
```css
--width-sm: 640px;
--width-base: 1024px;
--width-lg: 1280px;
--width-content: var(--width-base);
--width-min-offset-x: 22px; /* Minimum side padding */
```

#### Transitions
```css
--transition-fast: 150ms;
--transition-base: 250ms;
--transition-slow: 350ms;
```

#### Border Radius
```css
--border-radius-base: 0.25em;
--border-radius-full: 9999px;
```

### Utility Combinations & Patterns

#### Common Layout Patterns
```html
<!-- Header with back navigation -->
<header class="wrapper width-content py bg cs-primary">
  <nav class="flex items-center justify-between">
    <a href="../" class="control">← Back</a>
    <h1 class="headline no-space">Page Title</h1>
  </nav>
</header>

<!-- Content container -->
<main class="wrapper width-content py" style="--py-space: var(--space-xl)">
  <section class="mt-lg">
    <h2 class="headline h4">Section Title</h2>
    <p>Content here</p>
  </section>
</main>

<!-- Button group -->
<div class="flex gap items-center">
  <button class="btn cs-primary">Primary</button>
  <button class="btn">Default</button>
</div>

<!-- Grid layout -->
<div class="grid cols gap">
  <div class="col-span-8">Main content</div>
  <div class="col-span-4">Sidebar</div>
</div>
```

#### Responsive Spacing
```css
.my-section {
  --py-space: var(--space-lg);
  --mt-space: var(--space-xl);
}

@media (max-width: 768px) {
  .my-section {
    --py-space: var(--space-md);
    --mt-space: var(--space-lg);
  }
}
```

## TypeScript Integration

### Basic TypeScript Setup
Create `[page-name].ts` for interactivity:
```typescript
import { initExpand } from '@/_base/scripts/services/expand.ts'

// Initialize base functionality
initExpand()

// Page-specific functionality
console.log('Page loaded')
```

### Common Imports
```typescript
// Base services
import { initExpand } from '@/_base/scripts/services/expand.ts'

// Base utilities
import { cookie } from '@/_base/scripts/utilities/cookie.ts'
import { dom } from '@/_base/scripts/utilities/dom.ts'
import { EventEmitter } from '@/_base/scripts/utilities/event-emitter.ts'

// Component services (if needed)
import { initAccordions } from '@/accordion/scripts/services/accordion.ts'
```

## Page Examples and Patterns

### 1. Basic Content Page
Simple page with static content:
```html
<main class="wrapper width-content py" style="--py-space: var(--space-xl)">
  <h2>Page Title</h2>
  <p>Basic content here</p>
</main>
```

### 2. Component Demo Page
Page showcasing a specific component:
```html
<main class="width-content">
  <section class="mt-lg">
    <h2 class="headline h4">Component Name</h2>
    <p>Description of the component and its features.</p>
    
    <!-- Component example -->
    <div class="component-example">
      <!-- Component HTML -->
    </div>
  </section>
</main>
```

### 3. Themed Page
Page with custom colorsets (example: blue/orange theme):
```html
<!-- In head -->
<link rel="stylesheet" href="./theme.css" />

<!-- In body -->
<header class="wrapper width-content py bg cs-primary">
  <!-- Header content with custom blue theme -->
</header>

<!-- Content with custom secondary colorset -->
<section class="wrapper width-content bg cs-secondary py">
  <p>Content with custom orange theme</p>
  <button class="btn cs-secondary">Orange Themed Button</button>
</section>
```

**Note**: The `cs-primary` and `cs-secondary` classes in this example are custom colorsets defined in the themed page's `theme.css` file with blue and orange colors. By default, only `cs-primary` exists (black/gray theme).

### 4. Interactive Page
Page with TypeScript functionality:
```html
<!-- In body -->
<main class="wrapper width-content py">
  <button class="btn bg-black" onclick="handleClick()">Interactive Button</button>
</main>

<script type="module" src="./interactive.ts"></script>
```

## Best Practices

### 1. **Always Include Back Navigation**
Every page must have a way to return to the main pages list.

### 2. **Use Semantic HTML**
- Use proper heading hierarchy (h1, h2, h3, h4)
- Include meaningful `<section>` elements
- Use appropriate ARIA attributes when needed

### 3. **Follow Spacing Conventions**
- Use `py` for vertical spacing with CSS variables
- Use `gap` for flex item spacing
- Use `mt-lg`, `mb` for section spacing

### 4. **Consistent Styling**
- Use base utility classes before custom CSS
- Follow the CSS layer organization
- Use CSS custom properties for theming

### 5. **Progressive Enhancement**
- Ensure pages work without JavaScript
- Use TypeScript for enhanced functionality
- Test with and without JavaScript enabled

### 6. **Accessibility**
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## Common Patterns

### Section with Code Example
```html
<section class="mt-lg">
  <h2 class="headline h4">Code Example</h2>
  <p>Description of the code example.</p>
  
  <pre class="p bg-gray" style="border-radius: 4px; overflow-x: auto;"><code>// Code example here
const example = 'Hello World'
console.log(example)</code></pre>
</section>
```

### Interactive Demo Section
```html
<section class="mt-lg">
  <h2 class="headline h4">Interactive Demo</h2>
  <p>Try the interactive features below:</p>
  
  <div class="flex gap items-center mb">
    <button class="btn cs-primary" onclick="demoFunction()">Demo Button</button>
    <button class="btn" onclick="resetDemo()">Reset</button>
  </div>
  
  <div class="demo-area">
    <!-- Interactive content -->
  </div>
</section>
```

### Multi-Section Layout
```html
<main class="width-content">
  <section class="mt-lg">
    <h2 class="headline h4">Section 1</h2>
    <!-- Content -->
  </section>

  <section class="mt-lg">
    <h2 class="headline h4">Section 2</h2>
    <!-- Content -->
  </section>
</main>
```

## Testing Your Page

1. **Check Auto-Discovery**: Navigate to `/` and verify your page appears in the list
2. **Test Back Navigation**: Ensure the back button works correctly
3. **Verify Styling**: Check that base styles are applied correctly
4. **Test Responsiveness**: Ensure page works on different screen sizes
5. **Accessibility Check**: Test keyboard navigation and screen reader support
6. **JavaScript Functionality**: Test any interactive features

## Resources

- [Base Styles Documentation](../stubs/_base/README.md)
- [CSS Layer Architecture](../stubs/CLAUDE.md)
- [Component Examples](../stubs/accordion/README.md)
- [CopyKit Documentation](../README.md)
