# CopyKit

A foundational collection of scripts, styles, and components designed to be copied into your projects. CopyKit provides essential building blocks that you can customize and modify completely according to your project's specific requirements.

## Overview

CopyKit is a **copy-and-customize** component library that provides a starting point for web projects. Unlike traditional frameworks or libraries, CopyKit components are meant to be copied directly into your project where you have full control to modify, extend, or adapt them to your specific needs. Once copied, the code becomes entirely yours to customize.

> **🌐 Live Demo & Documentation**
> 
> - **[📱 Example Pages](https://gherrink.github.io/copykit/)** - See all components in action with interactive examples
> - **[📚 Complete UI Documentation](https://gherrink.github.io/copykit/ui-doc/)** - Comprehensive component documentation and usage guides

## Features

- **Copy-and-Customize** - Take what you need, modify everything to fit your project
- **Modular CSS Components** - Reusable styles with CSS custom properties for easy theming
- **JavaScript Utilities** - Common functions and helpers for DOM manipulation and data handling
- **HTML Templates** - Semantic, accessible markup patterns
- **Build Tools Integration** - Compatible with modern bundlers and build systems
- **Responsive Design** - Mobile-first approach with flexible grid systems
- **Accessibility First** - WCAG compliant components and practices
- **Performance Optimized** - Minimal footprint with optional features
- **Full Ownership** - Once copied, the code is entirely yours to modify

## Project Structure

The repository contains multiple copy points, each with a consistent structure for easy integration:

```
├── pages/                  # Example pages demonstrating components
│   ├── index.html          # Component showcase and navigation
│   ├── app.ts              # Example application setup
│   ├── style.css           # Example global styles
│   └── [page-name]/        # Additional example pages
├── stubs/                  # 📁 COPY THESE - Multiple copy points
│   ├── _base/              # ✨ Core foundation copy point
│   ├── [copy-point]/       # ✨ Additional copy points (future)
│   └── [copy-point]/       # ✨ Each with consistent structure
├── assets/                 # Static assets for examples
└── dist/                   # Build output for development
```

### Copy Point Structure

**Each copy point in `stubs/` follows the same consistent structure:**

```
[copy-point-name]/          # Note: only _base has underscore prefix
├── scripts/                # JavaScript functionality
│   ├── services/           # Feature services (interactive components)
│   └── utilities/          # Helper functions and utilities
└── styles/                 # CSS organized in layers
    ├── 01_defaults/        # Foundation: resets, variables, typography
    ├── 02_components/      # UI components: buttons, forms, etc.
    ├── 03_utilities/       # Utility classes: spacing, layout, etc.
    ├── 04_layouts/         # Page-level structural styles
    └── index.css           # Main entry point (only in _base copy point)
```

> **Important**: Start with `_base` as it provides the foundation. The `index.css` file is only included in `_base` and imports all the CSS layers.

**This consistent structure means you can:**
- Copy entire copy points and they'll integrate the same way
- Mix and match between copy points easily
- Know exactly where to find specific types of code
- Paste into your project with predictable organization

## Getting Started

### CopyKit CLI (Recommended)

The easiest way to use CopyKit is through the CLI tool, which automatically copies copy-points into your project with proper structure and integration.

#### Installation

**Option A: Install globally**
```bash
npm install -g copykit
# or
pnpm add -g copykit
# or
yarn global add copykit
```

**Option B: Use npx (no installation needed)**
```bash
npx copykit <command>
```

#### Quick Start

```bash
# 1. Initialize your project with the base copy-point
copykit init

# 2. Add additional copy-points as needed
copykit add accordion
copykit add elevate

# 3. List available copy-points
copykit list

# 4. Get detailed information about a copy-point
copykit info accordion
```

#### CLI Commands

**`copykit init`** - Initialize project with \_base copy-point
```bash
copykit init                   # Initialize in current directory
copykit init --overwrite       # Overwrite existing files
copykit init --skip-tests      # Skip copying test files
copykit init --help            # Show help for init command
```

**`copykit add <copy-point>`** - Add specific copy-point
```bash
copykit add accordion              # Add accordion copy-point
copykit add elevate                # Add elevate copy-point
copykit add accordion --overwrite  # Overwrite existing files
copykit add accordion --skip-tests # Skip copying test files
copykit add --help                 # Show help for add command
```

**`copykit list`** - List available copy-points
```bash
copykit list                   # Show all available copy-points with basic info
```

**`copykit info <copy-point>`** - Show detailed copy-point information
```bash
copykit info accordion        # Show detailed info about accordion copy-point
copykit info _base           # Show detailed info about base copy-point
copykit info elevate         # Show detailed info about elevate copy-point
```

**`copykit help`** - Show general help
```bash
copykit --help                 # Show main help
copykit <command> --help       # Show command-specific help
```

#### Integration After CLI Usage

After using the CLI, integrate the copied files into your project:

**CSS Integration:**
```css
/* Import base styles in your main CSS file */
@import "./stubs/_base/styles/index.css";

/* Or import specific copy-point styles */
@import "./stubs/accordion/styles/02_components/accordion.css";
@import "./stubs/elevate/styles/03_utilities/elevate.css";
```

**JavaScript Integration:**
```javascript
// Import services and utilities
import { expand } from "./stubs/_base/scripts/services/expand.js"
import { selectParent } from "./stubs/_base/scripts/utilities/select.js"
import { Accordion } from "./stubs/accordion/scripts/services/accordion.js"

// Initialize functionality
expand.init()
const accordion = new Accordion()
```

**HTML Usage:**
```html
<!-- Use copied components with their classes -->
<div class="accordion" data-animate>
  <div class="item">
    <button class="control" aria-expanded="false">Toggle</button>
    <div class="content">Content here</div>
  </div>
</div>
```

### Manual Copy (Alternative Method)

If you prefer manual control, you can copy files directly:

#### Using CopyKit Copy Points

CopyKit is designed as a **copy-and-customize** library organized in copy points. Here's how to use it:

#### 1. Browse Copy Points
- **[🌐 Live Example Pages](https://gherrink.github.io/copykit/)** - See components in action with interactive demos
- **[📚 Complete UI Documentation](https://gherrink.github.io/copykit/ui-doc/)** - Explore detailed component documentation and usage guides
- Clone or download this repository to explore available copy points locally
- Browse the `stubs/` directory to explore different copy points
- Each copy point has the same structure, making integration predictable

#### 2. Copy What You Need

> **⚠️ Important**: Always start by copying `_base` first, as it contains the foundational styles and utilities that other copy points depend on.

**Option A: Copy an entire copy point**
```bash
# STEP 1: Always copy _base first (required foundation)
cp -r stubs/_base/ your-project/src/

# STEP 2: Copy additional copy points as needed
cp -r stubs/[copy-point]/ your-project/src/components/
```

**Option B: Copy specific parts**
```bash
# Copy specific components from any copy point
cp -r stubs/_base/styles/02_components/ your-project/styles/components/
cp -r stubs/_base/scripts/services/ your-project/scripts/services/

# Copy specific files
cp stubs/_base/styles/02_components/button.css your-project/styles/
cp stubs/_base/scripts/utilities/dom.ts your-project/scripts/
```

**Option C: Mix and match between copy points**
```bash
# Take utilities from _base and components from another copy point
cp -r stubs/_base/scripts/utilities/ your-project/scripts/
cp -r stubs/advanced/styles/02_components/ your-project/styles/components/
```

#### 3. Integrate with Consistent Structure
Thanks to the consistent structure, integration is predictable:
- CSS layers will organize properly (`01_defaults` → `02_components` → `03_utilities` → `04_layouts`)
- JavaScript modules will have expected folder organization
- You can import the main CSS with `@import "path/to/index.css"`

#### 4. Customize and Adapt
Once copied, the code is entirely yours:
- Modify CSS variables to match your design system
- Adapt JavaScript functions to your project's needs
- Rename classes, functions, or variables as needed
- Remove features you don't need
- Add new functionality

### For CopyKit Development

If you want to contribute to CopyKit or run the development environment:

```bash
# Prerequisites: Node.js (v18+) and pnpm
git clone [repository-url]
cd copykit
pnpm install
pnpm run dev  # Start development server
```

### Available Commands

```bash
# Development
pnpm run dev         # Start development server
pnpm run build       # Build for production
pnpm run preview     # Preview production build

# Code Quality
pnpm run lint        # Run all linters
pnpm run lint:fix    # Auto-fix linting issues
pnpm run format      # Format code with Prettier
pnpm run security    # Run security audit
```

## Colorset System

CopyKit uses a **colorset** approach for systematic color management. A colorset is a comprehensive collection of coordinated colors that establishes a complete visual identity for UI components or sections.

### What is a Colorset?

A colorset provides all essential color variables needed for consistent theming:
- Primary text and background colors
- Borders and shadows
- Accent colors and interactive states
- Hover and selection colors

### Why Use Colorsets?

**Component theming** - Apply consistent colors across buttons, cards, forms, and other UI elements
**Section-based styling** - Define distinct visual zones like headers, sidebars, or content areas  
**Theme variations** - Create light/dark modes or brand-specific color schemes
**Contextual styling** - Differentiate between states like default, success, warning, or error
**Systematic design** - Maintain visual consistency across your entire application with predefined color relationships

By using colorsets, you ensure that all related colors work harmoniously together while maintaining flexibility to swap entire color schemes without touching individual component styles.

## Accessibility Implementation Guidelines

CopyKit follows a comprehensive accessibility-first approach that ensures all components and utilities work seamlessly for users with diverse needs. These guidelines establish consistent patterns for implementing accessibility across the entire system.

### Core Accessibility Principles

**1. Component-Level Responsibility**
- Each component defines its own specific accessibility behaviors
- Components manage their own ARIA attributes, keyboard navigation, and focus management
- Interactive elements include proper semantic HTML and ARIA patterns
- Components work without JavaScript (progressive enhancement)

**2. Layout-Level Global Overrides**
- Layout files (`04_layouts/`) handle user preference media queries
- Global accessibility settings respect `prefers-contrast` and `prefers-reduced-motion`
- User preferences automatically override component defaults
- System-wide consistency through CSS custom property overrides

**3. User Preference Respect**
- All animations and transitions respect `prefers-reduced-motion: reduce`
- High contrast mode automatically adjusts colorset variables
- Focus indicators remain visible and accessible in all color schemes
- No accessibility features are disabled or removed based on user preferences

### Implementation Rules

#### When Components Handle Accessibility
Components should manage accessibility when:
- **Interactive behavior**: Buttons, controls, forms, and navigation elements
- **State management**: Expanded/collapsed states, active/inactive states
- **Keyboard navigation**: Arrow keys, Home/End navigation, focus management
- **ARIA attributes**: `aria-expanded`, `aria-controls`, `aria-hidden`, `role` attributes
- **Content structure**: Semantic HTML, heading hierarchy, landmark regions

**Example Pattern:**
```html
<!-- Component defines its own accessibility behavior -->
<button class="control" aria-expanded="false" aria-controls="content-1">
  Toggle Content
</button>
<div id="content-1" hidden data-animate="slide">
  Content here
</div>
```

#### When Layouts Handle Accessibility
Layout files should handle accessibility when:
- **User preferences**: `prefers-contrast`, `prefers-reduced-motion`, `prefers-color-scheme`
- **Global overrides**: System-wide color or motion changes
- **Universal patterns**: Focus outline styles, selection colors
- **Performance optimizations**: Disabling unnecessary animations

**Example Pattern:**
```css
/* Layout-level user preference override */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}
```

### Required Testing Standards

**1. Keyboard Navigation Testing**
- All interactive elements accessible via keyboard only
- Logical tab order and focus indicators
- Arrow key navigation where appropriate (menus, accordions)
- Escape key functionality for dismissible elements

**2. Screen Reader Testing**
- Semantic HTML structure with proper headings
- ARIA attributes accurately describe element states
- Dynamic content changes announced appropriately
- Alternative text for images and icons

**3. User Preference Testing**
- Test with `prefers-reduced-motion: reduce` enabled
- Test with `prefers-contrast: more` enabled
- Verify functionality works in forced-colors mode
- Test with different font sizes and zoom levels

**4. Color and Contrast Testing**
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text and UI elements
- Color is not the only means of conveying information
- Focus indicators have sufficient contrast

### Integration with CopyKit Architecture

**CSS Layer Integration:**
- `01_defaults/`: Accessibility variables and base focus styles
- `02_components/`: Component-specific ARIA and keyboard behavior
- `03_utilities/`: Accessibility utility classes (sr-only, focus management)
- `04_layouts/`: User preference overrides and global accessibility settings

**JavaScript Service Patterns:**
- Services like `expand.ts` provide ARIA-compliant interactive functionality
- Event listeners include proper cleanup and accessibility considerations
- Focus management follows WCAG guidelines
- Keyboard event handling respects user expectations

**Colorset Accessibility:**
- All colorsets include sufficient contrast ratios
- High contrast mode provides automatic colorset overrides
- Selection and focus colors work across all colorset variations
- Color combinations remain accessible in forced-colors mode

### Best Practices for Developers

1. **Start with semantic HTML** - Use appropriate elements before adding ARIA
2. **Test early and often** - Include accessibility testing in development workflow
3. **Respect user preferences** - Never override user accessibility settings
4. **Provide multiple interaction methods** - Support mouse, keyboard, and touch
5. **Follow progressive enhancement** - Ensure basic functionality without JavaScript
6. **Document accessibility features** - Include ARIA patterns and keyboard shortcuts in documentation

### Accessibility Resources

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Comprehensive ARIA implementation patterns
- **[WebAIM](https://webaim.org/)** - Practical accessibility guidance and testing tools
- **[MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)** - Technical implementation guides

## Available Copy Points

Use `copykit list` to see all available copy-points with basic information, or `copykit info <copy-point>` for detailed information. You can also explore the **[📚 Complete UI Documentation](https://gherrink.github.io/copykit/ui-doc/)** for interactive component examples and detailed usage guides.

Available copy-points:

### Currently Available

#### [`_base/`](stubs/_base/README.md) - Core Foundation Copy Point ⭐ **REQUIRED STARTING POINT**
The essential foundation that **must be copied first**. All other copy points build upon this base.

- **CSS Layers**: Browser resets, variables, components, utilities, and layouts
- **JavaScript**: Expand/collapse services and DOM utilities
- **Foundation**: Complete base styles and interactive functionality

> **📖 [View complete _base documentation](stubs/_base/README.md)**

#### [`accordion/`](stubs/accordion/README.md) - Accessible Accordion Component
Advanced accordion/collapsible component with full ARIA support and keyboard navigation.

- **WCAG 2.1 AA compliant** with keyboard navigation support
- **Customizable styling** with CSS custom properties
- **Animation support** with configurable timing
- **Multiple instances** support

> **🌐 [Live Demo](https://gherrink.github.io/copykit/accordion.html)** | **📖 [View complete accordion documentation](stubs/accordion/README.md)**

#### [`elevate/`](stubs/elevate/README.md) - Visual Enhancement Utilities
Utility classes for adding visual depth and elevation to components using advanced CSS color-mixing.

- **Material Design inspired** elevation levels (0-24)
- **Advanced color mixing** with CSS `color-mix()` function
- **Customizable elevation** color and boost values
- **Performance optimized** utility classes

> **📖 [View complete elevate documentation](stubs/elevate/README.md)**

#### [`border/`](stubs/border/README.md) - Comprehensive Border Utilities
Flexible border utility system with directional controls and CSS custom properties.

- **Directional Border Control** - Apply borders to specific sides (top, right, bottom, left)
- **Axis-Based Utilities** - Control horizontal (x-axis) and vertical (y-axis) borders together
- **CSS Custom Properties** - Flexible customization through CSS variables
- **Predefined Styles** - Quick style application with solid, dashed, dotted, and none classes

> **🌐 [Live Demo](https://gherrink.github.io/copykit/border.html)** | **📖 [View complete border documentation](stubs/border/README.md)**

#### [`rounded-simple/`](stubs/rounded-simple/README.md) - Border Radius Utilities
Simple and flexible border radius utilities for creating rounded corners on any element.

- **Configurable border radius sizes** (sm, base, md, lg, xl)
- **CSS custom properties** for per-corner customization
- **Utility classes** for common rounding patterns
- **Full circle and pill shapes** support

> **🌐 [Live Demo](https://gherrink.github.io/copykit/rounded-simple.html)** | **📖 [View complete rounded-simple documentation](stubs/rounded-simple/README.md)**

#### [`shadow/`](stubs/shadow/README.md) - Material Design Shadow System
Material Design-inspired shadow utilities with 24 elevation levels and scientifically-accurate calculations.

- **24-Level Shadow System** - Precise elevation control from 0-24
- **Scientific Shadow Calculation** - Uses umbra, penumbra, and ambient shadow layers
- **Customizable Shadow Colors** - Full control over shadow color and opacity
- **Material Design Compliance** - Shadow calculations match Material Design guidelines

> **🌐 [Live Demo](https://gherrink.github.io/copykit/shadow.html)** | **📖 [View complete shadow documentation](stubs/shadow/README.md)**

### Future Copy Points
Additional copy points will follow the same structure:
- `advanced/` - Extended components and advanced features
- `animations/` - Enhanced animation utilities
- `forms/` - Advanced form components

### Copy Point Structure

Every copy point follows the same organized structure:

```
[name]/                     # Note: only _base has underscore prefix
├── copy-point.json         # Metadata for CLI discovery and tooling
├── README.md               # Complete documentation for this copy point
├── scripts/
│   ├── services/           # Interactive functionality
│   └── utilities/          # Helper functions
└── styles/
    ├── 01_defaults/        # Foundation layer
    ├── 02_components/      # Component layer  
    ├── 03_utilities/       # Utility layer
    ├── 04_layouts/         # Layout layer
    └── index.css           # Main entry point (only in _base copy point)
```

> **Note**: Each copy point includes complete documentation in its `README.md` file with usage examples, customization options, and integration guides.

### Integration Benefits

- **Predictable Structure**: Every copy point organizes code the same way
- **Complete Documentation**: Each copy point has comprehensive documentation
- **Easy Mixing**: Combine components from different copy points seamlessly
- **Layer Organization**: CSS layers ensure proper cascade order
- **Modular Imports**: Take only what you need from any copy point

## Development

### Code Quality Tools

The project includes comprehensive code quality tools:

- **ESLint**: TypeScript-focused linting with Prettier integration
- **Stylelint**: CSS linting with automatic property ordering
- **Prettier**: Consistent code formatting
- **Husky + lint-staged**: Pre-commit hooks for automatic code quality
- **Commitlint**: Conventional commit message validation

### Build System

- **Vite**: Modern build tool with TypeScript support
- **Multi-page Application**: Automatic discovery of HTML pages
- **UI-Doc**: Component documentation generation from JSDoc comments
- **CSS Layers**: Organized styling with `@layer` declarations

### Development Workflow

1. Components are developed in `stubs/` for copying into other projects
2. Pages demonstrate component usage with the `@/` alias
3. CSS follows the layer hierarchy: defaults → components → utilities → layouts
4. JavaScript services provide ARIA-compliant interactive functionality
5. Everything is designed to be copied and customized in target projects

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on:

- Conventional commit message format and scopes
- Development process and workflow
- Code quality standards
- Pull request guidelines

## Philosophy

This project follows these principles:

- **Flexibility over Convention** - Provide tools, not rigid structures
- **Performance First** - Minimal overhead, maximum impact
- **Accessibility Always** - Inclusive design from the ground up
- **Developer Experience** - Easy to use, easy to customize
- **Future Friendly** - Built with modern standards and best practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**CopyKit** - Building the web, one component at a time.
