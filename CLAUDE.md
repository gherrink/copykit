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

### Testing
- `pnpm test` - Run the complete test suite using Vitest
- Tests use jsdom environment for DOM manipulation and browser API testing
- Automated accessibility testing with axe-core integration
- 178+ tests covering utilities, services, components, and accessibility

### Copy Point Management
- `pnpm run create-copy-point [name]` - Generate new copy point with proper structure and templates

### WebBase CLI Development
- See [scripts/CLAUDE.md](scripts/CLAUDE.md) - CLI development, testing, and distribution guidance
- `pnpm run build:cli` - Build TypeScript CLI files to JavaScript

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

### CSS Documentation Standards
Only add JSDoc documentation to CSS where it provides meaningful showcase value:

**Document these CSS patterns:**
- **Base components** with complete usage examples
- **Component variants** that showcase different behaviors (`.accordion.flush`, `.btn.primary`)
- **Interactive features** with special behaviors (`.control.chevron`, animations)
- **Complex patterns** requiring specific HTML structure or data attributes

**Don't document these CSS patterns:**
- Simple structural elements (`.accordion > .item`, basic containers)
- Basic utility classes or state selectors (`:hover`, `[hidden]`)
- Internal implementation details

**Documentation template:**
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

**Guidelines:**
- Show **complete functional examples**, not code fragments
- Use **descriptive @location paths** that group related variants
- Focus on **user-facing functionality** rather than implementation details
- Keep examples **minimal but complete** - show the essential structure
- **CRITICAL**: `@location` keys must be **unique across the entire project** - never reuse the same location key

**@location Key Rules:**
- Use **dot notation**: `category.component.variant` (e.g., `components.accordion.single`)
- Each key must be **globally unique** - check existing documentation before adding new locations
- Follow hierarchical patterns for better organization
- Examples: `components.button`, `components.button.primary`, `functions.expand`, `utilities.dom.select`

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
git commit -m "feat(scripts): add webbase CLI with init and add commands"
git commit -m "fix(scripts): resolve TypeScript type errors in CLI"
git commit -m "refactor(scripts): restructure CLI command modules"

# General commits
git commit -m "feat(pages): add new themed page template"
git commit -m "docs: update component usage examples"
```

**Important**: After creating a new copy point, you must manually add its scope to `.commitlintrc.cjs` in the `scope-enum` array.

## Testing Framework and Standards

### Test Environment
- **Framework**: Vitest with TypeScript support
- **Environment**: jsdom for DOM manipulation and browser API simulation
- **Coverage**: Comprehensive testing for utilities, services, components, and accessibility
- **Accessibility**: Automated testing with axe-core integration and manual ARIA validation

### Test File Naming Convention
**CRITICAL**: Always follow this exact naming convention for test files:

#### Unit Tests: `[name].test.ts`
Use for testing individual functions, classes, services, or component functionality:
```
cookie.test.ts                    # Tests for cookie utility functions
event-emitter.test.ts            # Tests for EventEmitter class
expand.test.ts                   # Tests for expand service
accordion.test.ts                # Tests for accordion component functionality
```

#### Accessibility Tests: `[name].accessibility.test.ts`
Use for testing WCAG compliance, ARIA attributes, keyboard navigation, and automated scanning:
```
accordion.accessibility.test.ts           # Accessibility tests for accordion component
aria-fundamentals.accessibility.test.ts   # Basic ARIA and accessibility fundamentals
axe-core-integration.accessibility.test.ts # Automated accessibility scanning tests
```

### Test Directory Structure
```
test/                                    # Global test infrastructure
├── setup.ts                           # Test environment configuration (Canvas API mocks, etc.)
├── utils.ts                           # Shared test utilities and helpers
├── aria-fundamentals.accessibility.test.ts    # Basic ARIA and accessibility patterns
└── axe-core-integration.accessibility.test.ts # Automated accessibility violation detection

stubs/_base/scripts/
├── utilities/
│   ├── cookie.test.ts                  # Cookie read/write function tests
│   ├── dom.test.ts                     # DOM manipulation utility tests
│   ├── event-emitter.test.ts          # Type-safe EventEmitter tests
│   └── select.test.ts                  # Parent selector utility tests
└── services/
    └── expand.test.ts                  # Expand/collapse service tests

stubs/accordion/scripts/services/
├── accordion.test.ts                   # Accordion component functionality tests
└── accordion.accessibility.test.ts    # Accordion WCAG compliance and ARIA tests
```

### Testing Standards

#### Unit Test Requirements
- **Complete API Coverage**: Test all public methods, functions, and classes
- **Edge Cases**: Test boundary conditions, empty inputs, null/undefined values
- **Error Handling**: Verify proper error throwing and graceful degradation
- **TypeScript Integration**: Test type safety and generic constraints
- **Event Handling**: Test event emission, listener management, and cleanup

#### Accessibility Test Requirements
- **ARIA Compliance**: Verify proper aria-expanded, aria-controls, aria-hidden attributes
- **Keyboard Navigation**: Test arrow keys, Home/End, Space/Enter activation
- **Focus Management**: Test focus indicators, tabindex management, focus trapping
- **Screen Reader Support**: Test semantic HTML structure and accessible content
- **Automated Scanning**: Use axe-core to detect WCAG violations automatically
- **Color Contrast**: Verify sufficient contrast ratios and visual accessibility

#### Test Utilities (`@test/utils`)
The test utilities provide comprehensive helpers for testing:

**DOM Utilities**:
```typescript
createTestContainer()           # Create isolated test container
cleanupTestContainer()          # Clean up after tests
createElement(tag, attrs, content) # Create elements with attributes
```

**Accessibility Utilities**:
```typescript
expectAccessible(element)       # Run axe-core accessibility scan
expectExpanded(element)         # Verify aria-expanded="true"
expectCollapsed(element)        # Verify aria-expanded="false"
expectFocusedElement(element)   # Verify element has focus
```

**Accordion-Specific Utilities**:
```typescript
createAccordionElement(options) # Create accordion with items/controls
getAccordionControls(accordion) # Get all control buttons
getAccordionContents(accordion) # Get all content panels
navigateAccordion(control, key) # Simulate keyboard navigation
expectAccordionState(accordion, state) # Verify open/closed state
```

### Writing Tests

#### Unit Test Example
```typescript
import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from './event-emitter'

interface TestEvents {
  test: (data: string) => void
}

describe('EventEmitter', () => {
  it('should emit events with type safety', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn()
    
    emitter.on('test', listener)
    emitter.emit('test', 'hello')
    
    expect(listener).toHaveBeenCalledWith('hello')
  })
})
```

#### Accessibility Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { 
  createAccordionElement, 
  expectAccessible,
  getAccordionControls,
  navigateAccordion 
} from '@test/utils'

describe('Accordion Accessibility', () => {
  it('should support keyboard navigation', async () => {
    const accordion = createAccordionElement({ itemCount: 3 })
    const controls = getAccordionControls(accordion)
    
    controls[0].focus()
    await navigateAccordion(controls[0], 'ArrowDown')
    
    expect(document.activeElement).toBe(controls[1])
    await expectAccessible(accordion)
  })
})
```

### Test Coverage Goals
- **Unit Tests**: 100% coverage of public APIs and critical paths
- **Accessibility Tests**: WCAG 2.1 AA compliance verification
- **Integration Tests**: Component interaction and event flow testing
- **Cross-browser**: Functionality works across modern browsers
- **Performance**: No significant performance regressions

### Running Tests
```bash
pnpm test                 # Run all tests
pnpm test cookie          # Run specific test file
pnpm test accessibility   # Run accessibility tests only
```

### Adding Tests for New Features
When adding new features:

1. **Create unit tests** first using `[name].test.ts` convention
2. **Add accessibility tests** if creating UI components using `[name].accessibility.test.ts`
3. **Update test utilities** in `@test/utils` if adding reusable patterns
4. **Ensure all tests pass** before committing changes
5. **Add test coverage** for edge cases and error conditions

### Mock and Test Environment
- **document.cookie**: Properly mocked for cookie utility testing
- **Canvas API**: Mocked for axe-core color contrast testing
- **Event listeners**: Full event simulation and cleanup testing
- **ARIA attributes**: Complete ARIA state management testing
- **Focus management**: Browser focus behavior simulation