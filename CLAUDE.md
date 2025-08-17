# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Organization

This project maintains clear separation between different types of documentation to serve different audiences:

### README.md - User Documentation

**Audience**: Developers who installed the CopyKit CLI package and want to use copy-points in their projects **Content**:

- Installation instructions (global npm install, npx usage)
- CLI command reference with examples (`copykit init`, `copykit add`, `copykit list`, `copykit info`)
- Copy-point overview and available options with live demo links when example pages exist
- Integration examples (CSS imports, JavaScript usage, HTML structure)
- Getting started tutorials for end-users
- Copy-point structure explanation for users
- Philosophy and features from user perspective

### CONTRIBUTING.md - Developer Documentation

**Audience**: Developers who want to contribute to the CopyKit project itself **Content**:

- Development workflow and contribution process
- Code quality standards and linting requirements
- Testing framework and naming conventions
- Creating new copy-points (structure, metadata, validation)
- CopyKit CLI development and testing procedures
- Commit message formats and scopes
- Pull request guidelines
- Technical implementation details for contributors

### scripts/CLAUDE.md - CLI Development Guidance

**Audience**: Claude Code AI assistant working specifically on CLI functionality **Content**:

- CLI architecture and command structure
- TypeScript compilation and build processes
- Testing procedures for CLI commands
- Distribution and packaging details
- Command implementation patterns

### stubs/CLAUDE_SCRIPTS.md - TypeScript Development Guidance

**Audience**: Claude Code AI assistant working on TypeScript functionality in copy-points **Content**:

- Core architectural principles (HTML attributes, DOM storage, ARIA state)
- Event-driven communication patterns and typed EventEmitter
- Service composition and initialization patterns
- Testing patterns (unit and accessibility testing with examples)
- Memory management and cleanup strategies
- Framework integration examples and auto-discovery patterns

### stubs/CLAUDE_STYLE.md - CSS Development Guidance

**Audience**: Claude Code AI assistant working on CSS styling in copy-points **Content**:

- Colorset system and RGB space-separated format requirements
- CSS layer organization and 4-layer architecture
- Component vs utility pattern decision framework
- Child selector strategy and performance best practices
- Accessibility CSS patterns and user preference support
- JSDoc documentation standards and @location key rules

**Key Principle**: Keep user-facing information in README.md, contributor information in CONTRIBUTING.md, and AI development guidance in CLAUDE.md files.

## Commands

### Development

- `pnpm install` - Install dependencies (uses pnpm, enforced by preinstall hook)
- `pnpm run dev` - Start development server for both pages and UI documentation (uses concurrently)
- `pnpm run dev:pages` - Start development server for pages only
- `pnpm run dev:uidoc` - Start development server for UI documentation only
- `pnpm run build` - Build for production (both pages and UI documentation)
- `pnpm run build:pages` - Build pages for production (TypeScript compilation + Vite build)
- `pnpm run build:uidoc` - Build UI documentation for production
- `pnpm run preview` - Preview production build for both pages and UI documentation
- `pnpm run preview:pages` - Preview pages production build only
- `pnpm run preview:uidoc` - Preview UI documentation production build only

### Code Quality

- `pnpm run lint` - Run all linters (CSS + JavaScript/TypeScript)
- `pnpm run lint:fix` - Auto-fix all linting issues
- `pnpm run lint:js` - ESLint for JavaScript/TypeScript files
- `pnpm run lint:js:fix` - Auto-fix JavaScript/TypeScript linting issues
- `pnpm run lint:css` - Stylelint for CSS files
- `pnpm run lint:css:fix` - Auto-fix CSS linting issues
- `pnpm run format` - Format code using Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run format:docs` - Format README.md and CHANGELOG.md files
- `pnpm run format:json` - Format tsconfig.json files
- `pnpm run format:package` - Format package.json file
- `pnpm run security` - Run security audit

### Testing

- `pnpm test` - Run the complete test suite using Vitest
- `pnpm run test:coverage` - Run tests with coverage reporting
- `pnpm run test:ui` - Run tests with Vitest UI interface
- `pnpm run test:watch` - Run tests in watch mode
- Tests use jsdom environment for DOM manipulation and browser API testing
- Automated accessibility testing with axe-core integration
- 178+ tests covering utilities, services, components, and accessibility

### Copy Point Management

- `pnpm run create-copy-point [name]` - Generate new copy point with proper structure and templates

### CopyKit CLI Development

- See [scripts/CLAUDE.md](scripts/CLAUDE.md) - CLI development, testing, and distribution guidance
- `pnpm run build:cli` - Build TypeScript CLI files to JavaScript

### Infrastructure

- `pnpm run preinstall` - Automatically enforces pnpm usage (prevents npm/yarn)
- `pnpm run prepare` - Sets up Husky git hooks

### Pre-commit Hooks

- Husky + lint-staged automatically run linting and formatting on staged files
- ESLint fixes JavaScript/TypeScript files
- Stylelint fixes CSS files
- Prettier formats package.json, tsconfig files, and documentation

## Project Architecture

### Core Structure

- **`pages/`** - Contains HTML pages and entry points
  - `index.html` - Main page
  - `app.ts` - Main application entry point
  - `style.css` - Global styles
  - Subdirectories for additional pages (e.g., `basic/`, `themed/`)

- **`stubs/`** - Reusable components and utilities (aliased as `@/` in imports)
  - Contains copy-points: self-contained component and utility collections
  - See [stubs/CLAUDE.md](stubs/CLAUDE.md) for complete copy-point development guide
  - `_base/` - Core foundation components required by most copy-points

### CSS Architecture

Uses CSS layers for organization:

1. **Defaults** (`01_defaults/`) - Browser resets, variables, typography
2. **Components** (`02_components/`) - Reusable UI components (buttons, controls, images)
3. **Utilities** (`03_utilities/`) - Single-purpose utility classes (spacing, layout, text)
4. **Layouts** (`04_layouts/`) - Page-level structural styles

### Colorset System

CopyKit uses a **colorset** approach for systematic color management. A colorset is a comprehensive color definition system that establishes a complete visual identity for UI components or sections, providing all essential color variables needed for consistent theming across your entire application.

**Colorset Variables** (defined in `stubs/_base/styles/01_defaults/variables.css`):

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

**Benefits of Colorsets**:

- **Component theming** - Apply consistent colors across buttons, cards, forms, and other UI elements
- **Section-based styling** - Define distinct visual zones like headers, sidebars, or content areas
- **Theme variations** - Create light/dark modes or brand-specific color schemes
- **Contextual styling** - Differentiate between states like default, success, warning, or error
- **Systematic design** - Maintain visual consistency with predefined color relationships
- **Easy theme switching** - Swap entire color schemes without touching individual component styles

**Development Guidelines**:

- Always use colorset variables instead of direct color values
- Create new colorsets for different themes or component contexts
- Ensure all colorset variables work harmoniously together
- Test color combinations for accessibility and contrast requirements

### Build System

- **Vite** with TypeScript support
- **Dual-build architecture**: Pages and UI documentation built separately but served concurrently
- **Multi-page application** with dynamic HTML page discovery
- **UI-Doc** plugin for component documentation generation
- **Concurrent development**: Both pages and UI documentation run simultaneously via `concurrently`
- **Alias**: `@/` points to `stubs/` directory
- **Root**: `pages/` directory for development
- **Documentation**: Separate Vite configuration for UI-Doc generation

### Key Features

- **Expand/Collapse System**: Sophisticated ARIA-based expand/collapse functionality with:
  - `aria-expanded` and `aria-controls` attributes
  - Animation support via `data-animate` attribute
  - Inert attribute management for accessibility
  - Tabindex management for keyboard navigation
- **Modular CSS**: Component-based styling with CSS custom properties
- **Accessibility First**: WCAG compliant components with proper ARIA attributes
- **TypeScript**: Strict mode enabled with modern ES2020+ features

### Development Workflow

1. Components are developed in `stubs/` for reusability
2. Pages consume components via the `@/` alias
3. UI-Doc generates documentation from JSDoc comments in CSS/TypeScript
4. Build process handles multiple entry points and static assets

### Code Standards

- **ESLint**: TypeScript-focused rules with Prettier integration
- **Stylelint**: CSS standards with automatic ordering
- **TypeScript**: Strict mode with modern module resolution
- **Prettier**: Consistent code formatting across all file types
- **No console**: Console statements trigger warnings
- **Accessibility**: Components must include proper ARIA attributes and keyboard navigation

### CSS Documentation Standards

**For complete CSS writing guidelines and documentation standards, see [stubs/CLAUDE_STYLE.md](stubs/CLAUDE_STYLE.md).**

Key requirements:

- Always use colorset variables instead of direct color values
- Follow 4-layer architecture (defaults, components, utilities, layouts)
- Use child selectors for clean component structure
- Include JSDoc documentation for user-facing components only
- Ensure unique `@location` keys across the entire project

## Copy-Point Development

**For complete copy-point creation and development guidance, see [stubs/CLAUDE_COPY_POINT.md](stubs/CLAUDE_COPY_POINT.md).**

### Quick Reference

- **Create new copy-point**: `pnpm run create-copy-point [name]`
- **Development standards**: See [stubs/CLAUDE.md](stubs/CLAUDE.md) for essential requirements
- **CSS guidelines**: See [stubs/CLAUDE_STYLE.md](stubs/CLAUDE_STYLE.md) for complete CSS standards
- **TypeScript patterns**: See [stubs/CLAUDE_SCRIPTS.md](stubs/CLAUDE_SCRIPTS.md) for TypeScript development
- **Commit format**: `feat(stub:[name]): create [name] copy point`

### Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with commitlint enforcement.

**Valid scopes** (defined in `.commitlintrc.cjs`):

- `docs`: Documentation changes
- `pages`: Changes to page templates
- `scripts`: Changes to CLI scripts and development tools
- `stub:base`: Changes to base components and utilities
- `stub:[copy-point-name]`: Changes to specific copy points (e.g., `stub:advanced`, `stub:animations`)

**Common commit types**:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Copy Point Commit Examples**:

```bash
# Creating new copy points
git commit -m "feat(stub:advanced): create advanced copy point"
git commit -m "feat(stub:dark-theme): create dark-theme copy point"

# Working on copy points
git commit -m "feat(stub:advanced): add enhanced button variants"
git commit -m "fix(stub:animations): resolve transition timing issue"
git commit -m "style(stub:base): format CSS utility classes"

# CLI and development scripts
git commit -m "feat(scripts): add copykit CLI with init and add commands"
git commit -m "fix(scripts): resolve TypeScript type errors in CLI"
git commit -m "refactor(scripts): restructure CLI command modules"

# General commits
git commit -m "feat(pages): add new themed page template"
git commit -m "docs: update component usage examples"
```

**Important**: After creating a new copy point, you must manually add its scope to `.commitlintrc.cjs` in the `scope-enum` array.

## Testing Framework and Standards

**For complete testing framework standards, patterns, and examples, see [stubs/CLAUDE_SCRIPTS.md](stubs/CLAUDE_SCRIPTS.md).**

### Quick Reference

- **Framework**: Vitest with TypeScript and jsdom environment
- **Test files**: Use `[name].test.ts` for unit tests, `[name].accessibility.test.ts` for accessibility tests
- **Run tests**: `pnpm test` (all tests), `pnpm test [pattern]` (specific tests)
- **Coverage**: 178+ tests covering utilities, services, components, and accessibility
- **Requirements**: All copy-points with interactive elements must include comprehensive accessibility tests
