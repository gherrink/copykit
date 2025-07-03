# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm install` - Install dependencies (uses pnpm, enforced by preinstall hook)
- `pnpm run dev` - Start development server using Vite
- `pnpm run build` - Build for production (TypeScript compilation + Vite build)
- `pnpm run preview` - Preview production build

### Code Quality
- `pnpm run lint` - Run all linters (CSS + JavaScript/TypeScript)
- `pnpm run lint:fix` - Auto-fix all linting issues
- `pnpm run lint:js` - ESLint for JavaScript/TypeScript files
- `pnpm run lint:css` - Stylelint for CSS files
- `pnpm run format` - Format code using Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run security` - Run security audit

### Copy Point Management
- `pnpm run create-copy-point [name]` - Generate new copy point with proper structure and templates

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
  - `_base/` - Core foundation components
    - `scripts/services/` - JavaScript services (e.g., expand functionality)
    - `scripts/utilities/` - Utility functions (DOM, cookies, selectors)
    - `styles/` - CSS organized in layers

### CSS Architecture
Uses CSS layers for organization:
1. **Defaults** (`01_defaults/`) - Browser resets, variables, typography
2. **Components** (`02_components/`) - Reusable UI components (buttons, controls, images)
3. **Utilities** (`03_utilities/`) - Single-purpose utility classes (spacing, layout, text)
4. **Layouts** (`04_layouts/`) - Page-level structural styles

### Build System
- **Vite** with TypeScript support
- **Multi-page application** with dynamic HTML page discovery
- **UI-Doc** plugin for component documentation generation
- **Alias**: `@/` points to `stubs/` directory
- **Root**: `pages/` directory for development

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

## Copy Point Creation

### IMPORTANT: Always Use the Automated Script
**Never create copy points manually.** Always use the `create-copy-point` script to ensure consistency and proper structure.

```bash
# REQUIRED: Use this script for all new copy points
pnpm run create-copy-point [name]

# Examples:
pnpm run create-copy-point advanced
pnpm run create-copy-point components-extended
pnpm run create-copy-point dark-theme
pnpm run create-copy-point animations
```

### Script Features and Validation
The script (`scripts/create-copy-point.js`) automatically:

- **Validates naming**: Ensures kebab-case, no underscores (except `_base`), lowercase only
- **Prevents conflicts**: Checks if copy point already exists
- **Creates structure**: Standard directories (`scripts/`, `styles/` with all 4 layers)
- **Generates templates**: Starter files with proper JSDoc comments and layer organization
- **Provides guidance**: Shows next steps and commit message format

### Script Output Structure
```
stubs/[name]/
├── scripts/
│   ├── services/example.ts          # Service template
│   └── utilities/example.ts         # Utility template
└── styles/
    ├── 01_defaults/variables.css    # Variables/overrides
    ├── 02_components/example.css    # Component templates
    ├── 03_utilities/example.css     # Utility templates
    └── 04_layouts/example.css       # Layout templates
```

**Note**: No `index.css` is created (only `_base` has this master import file)

### Post-Script Workflow
1. **Script generates**: Complete structure in `stubs/[name]/`
2. **Update commitlint**: Add `stub:[name]` scope to `.commitlintrc.cjs`
3. **Develop components**: Replace template files with actual components
4. **Test integration**: Ensure compatibility with `_base` and other copy points
5. **Create examples**: Add demonstration pages in `pages/`
6. **Commit changes**: Use `feat(stub:[name]): create [name] copy point`

### Copy Point Naming Rules
- **Lowercase only**: `advanced`, `dark-theme`, `components-extended`
- **Kebab-case**: Use hyphens for multi-word names
- **No underscores**: Only `_base` uses underscore prefix
- **Descriptive**: Name should indicate purpose (`animations`, `advanced`, `dark-theme`)

### Conventional Commits
This project uses [Conventional Commits](https://www.conventionalcommits.org/) with commitlint enforcement.

**Valid scopes** (defined in `.commitlintrc.cjs`):
- `docs`: Documentation changes
- `pages`: Changes to page templates
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

# General commits
git commit -m "feat(pages): add new themed page template"
git commit -m "docs: update component usage examples"
```

**Important**: After creating a new copy point, you must manually add its scope to `.commitlintrc.cjs` in the `scope-enum` array.