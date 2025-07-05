# WebBase

A foundational collection of scripts, styles, and components designed to be copied into your projects. WebBase provides essential building blocks that you can customize and modify completely according to your project's specific requirements.

## Overview

WebBase is a **copy-and-customize** component library that provides a starting point for web projects. Unlike traditional frameworks or libraries, WebBase components are meant to be copied directly into your project where you have full control to modify, extend, or adapt them to your specific needs. Once copied, the code becomes entirely yours to customize.

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

### WebBase CLI (Recommended)

The easiest way to use WebBase is through the CLI tool, which automatically copies copy-points into your project with proper structure and integration.

#### Installation

**Option A: Install globally**
```bash
npm install -g gherrink-web-base
# or
pnpm add -g gherrink-web-base
# or
yarn global add gherrink-web-base
```

**Option B: Use npx (no installation needed)**
```bash
npx gherrink-web-base <command>
```

#### Quick Start

```bash
# 1. Initialize your project with the base copy-point
webbase init

# 2. Add additional copy-points as needed
webbase add accordion
webbase add elevate

# 3. List available copy-points
webbase list
```

#### CLI Commands

**`webbase init`** - Initialize project with \_base copy-point
```bash
webbase init                   # Initialize in current directory
webbase init --overwrite       # Overwrite existing files
webbase init --skip-tests      # Skip copying test files
webbase init --help            # Show help for init command
```

**`webbase add <copy-point>`** - Add specific copy-point
```bash
webbase add accordion              # Add accordion copy-point
webbase add elevate                # Add elevate copy-point
webbase add accordion --overwrite  # Overwrite existing files
webbase add accordion --skip-tests # Skip copying test files
webbase add --help                 # Show help for add command
```

**`webbase list`** - List available copy-points
```bash
webbase list                   # Show all available copy-points with features
```

**`webbase help`** - Show general help
```bash
webbase --help                 # Show main help
webbase <command> --help       # Show command-specific help
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

#### Using WebBase Copy Points

WebBase is designed as a **copy-and-customize** library organized in copy points. Here's how to use it:

#### 1. Browse Copy Points
- Clone or download this repository to explore available copy points
- Visit the component showcase at `pages/index.html` to see components in action
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

### For WebBase Development

If you want to contribute to WebBase or run the development environment:

```bash
# Prerequisites: Node.js (v18+) and pnpm
git clone [repository-url]
cd gherrink-web-base
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

## Available Copy Points

Use `webbase list` to see all available copy-points, or view them below:

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

> **📖 [View complete accordion documentation](stubs/accordion/README.md)**

#### [`elevate/`](stubs/elevate/README.md) - Visual Enhancement Utilities
Utility classes for adding visual depth and elevation to components using advanced CSS color-mixing.

- **Material Design inspired** elevation levels (0-24)
- **Advanced color mixing** with CSS `color-mix()` function
- **Customizable elevation** color and boost values
- **Performance optimized** utility classes

> **📖 [View complete elevate documentation](stubs/elevate/README.md)**

### Future Copy Points
Additional copy points will follow the same structure:
- `advanced/` - Extended components and advanced features
- `animations/` - Enhanced animation utilities
- `forms/` - Advanced form components

### Copy Point Structure

Every copy point follows the same organized structure:

```
[name]/                     # Note: only _base has underscore prefix
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

**WebBase** - Building the web, one component at a time.
