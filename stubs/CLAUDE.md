# Copy-Point Development Guide

This file provides guidance for working with copy-points in the CopyKit project.

## What Are Copy-Points?

Copy-points are reusable component and utility collections that can be selectively added to projects. Each copy-point is a self-contained directory with its own documentation, metadata, and implementation files.

## Copy-Point Organization

The `stubs/` directory contains all copy-points:

- **`_base/`** - Core foundation components (required by most copy-points)
- **Component copy-points** - Self-contained UI components (e.g., `accordion/`)
- **Utility copy-points** - Single-purpose utilities (e.g., `elevate/`, `shadow/`)

## Standard Copy-Point Structure

Every copy-point follows this consistent structure:

```
stubs/[name]/
├── README.md                        # User documentation
├── copy-point.json                  # CLI metadata
├── scripts/                         # TypeScript files (optional)
│   ├── services/                    # Business logic and component behavior
│   │   ├── [name].ts               # Main service implementation
│   │   ├── [name].test.ts          # Unit tests
│   │   └── [name].accessibility.test.ts # Accessibility tests
│   └── utilities/                   # Helper functions and utilities
│       ├── [utility].ts            # Utility implementation
│       └── [utility].test.ts       # Utility tests
└── styles/                          # CSS organized in layers
    ├── 01_defaults/                 # Variables, resets, typography
    ├── 02_components/               # Reusable UI components
    ├── 03_utilities/                # Single-purpose utility classes
    └── 04_layouts/                  # Page-level structural styles
```

### Special Notes:
- Only `_base/` has an `index.css` master import file
- Other copy-points import specific CSS files as needed
- Not all copy-points require JavaScript (some are CSS-only)
- Layer directories are created even if empty to maintain consistency

## README.md Purpose

Each copy-point's `README.md` serves as **user documentation** for developers who want to use the copy-point in their projects.

**Required Content:**
- **Overview** - Purpose and features of the copy-point
- **Live Example** - Direct link to GitHub Pages demo (if example page exists in `/pages/[copy-point-name]/`)
- **Dependencies** - Additional copy-points required beyond `_base` (omit `_base` as it's implicit)
- **Usage** - Basic usage examples and HTML structure
- **CSS Architecture** - Custom properties and component structure
- **Integration Guide** - How to import and use in projects
- **Customization** - Examples of theming and modifications
- **Browser Support** - Compatibility requirements
- **Best Practices** - Recommended usage patterns

**Audience:** End-users of the CopyKit CLI who want to understand how to use the copy-point in their projects.

## copy-point.json Purpose

The `copy-point.json` file provides structured metadata for the CopyKit CLI and development tools.

**Schema:**
```json
{
  "name": "copy-point-name",
  "title": "Human-readable Title",
  "description": "Detailed description of features and purpose",
  "version": "1.0.0",
  "features": [
    "List of key features",
    "What this copy point provides",
    "Technical capabilities"
  ],
  "dependencies": [],  // Only list additional copy-points beyond _base
  "author": "CopyKit",
  "keywords": ["relevant", "search", "terms"]
}
```

**CLI Integration:**
- `copykit list` - Shows name, title, and description
- `copykit info <name>` - Shows complete metadata
- Automatic discovery and loading by CLI tools
- Graceful fallback when metadata files are missing


## Copy-Point Creation

**For complete copy-point creation guidance, see [CLAUDE_COPY_POINT.md](CLAUDE_COPY_POINT.md).**

### Quick Reference
```bash
# Create new copy-point (always use this script)
pnpm run create-copy-point [name]
```

The complete creation guide covers:
- Automated script usage and validation
- Copy-point naming rules and standards
- Post-script workflow and development process
- Metadata configuration and documentation requirements
- Testing and accessibility implementation
- Conventional commit formats

## Copy-Point Development Standards

### TypeScript Files
**When working with scripts, always read [CLAUDE_SCRIPTS.md](CLAUDE_SCRIPTS.md) for complete TypeScript development guidelines.**

This covers:
- Core architectural principles (HTML attributes, DOM storage, ARIA state)
- Event-driven communication patterns
- Service composition and initialization
- Testing patterns (unit and accessibility)
- Memory management and cleanup
- Framework integration examples

### CSS Files
**When working with styles, always read [CLAUDE_STYLE.md](CLAUDE_STYLE.md) for complete CSS development guidelines.**

- **Always use colorset variables** instead of direct color values for consistency and theme switching
- Use CSS custom properties for theming
- Include JSDoc documentation for user-facing components
- Follow the 4-layer architecture
- Ensure accessibility compliance (WCAG 2.1 AA)

### Accessibility Implementation Requirements

Copy-points must follow CopyKit's comprehensive accessibility standards to ensure consistent, inclusive user experiences across all components.

#### Component-Level Accessibility Rules
When developing copy-points, components should handle their own specific accessibility behaviors:

**Required Component Patterns:**
- **ARIA Management**: Use `aria-expanded`, `aria-controls`, `aria-hidden`, `role` attributes appropriately
- **Keyboard Navigation**: Implement arrow keys, Home/End navigation, focus management
- **Semantic HTML**: Use proper HTML elements before adding ARIA attributes
- **Progressive Enhancement**: Ensure functionality works without JavaScript first
- **State Management**: Handle expanded/collapsed, active/inactive states accessibly

**For detailed TypeScript implementation patterns, see [CLAUDE_SCRIPTS.md](CLAUDE_SCRIPTS.md).**

**For detailed CSS accessibility patterns, see [CLAUDE_STYLE.md](CLAUDE_STYLE.md)**

#### Accessibility Testing Requirements
All copy-points with interactive elements must include comprehensive accessibility tests:

**Required Test Files:**
```
scripts/services/
├── [component].test.ts              # Unit functionality tests
└── [component].accessibility.test.ts # Accessibility compliance tests
```

**Accessibility Test Coverage:**
- **Keyboard Navigation**: Tab order, arrow keys, Home/End, Escape functionality
- **ARIA Compliance**: Verify `aria-expanded`, `aria-controls`, role attributes
- **Screen Reader Support**: Test with axe-core and manual screen reader testing
- **Focus Management**: Ensure proper focus indicators and focus trapping
- **User Preferences**: Test with `prefers-reduced-motion` and `prefers-contrast`

**For complete accessibility testing patterns and examples, see [CLAUDE_SCRIPTS.md](CLAUDE_SCRIPTS.md).**


#### Documentation Requirements for Accessibility
Copy-point README.md files must document accessibility features:

**Required Accessibility Documentation:**
```markdown
## Accessibility Features

- **WCAG 2.1 AA Compliant** - Meets accessibility guidelines
- **Keyboard Navigation** - Full keyboard support with arrow keys
- **Screen Reader Support** - Proper ARIA attributes and semantic HTML
- **High Contrast Support** - Automatic colorset adjustments
- **Reduced Motion Support** - Respects user motion preferences
- **Focus Management** - Clear focus indicators and logical tab order

### Keyboard Shortcuts
- **Arrow Keys** - Navigate between items
- **Home/End** - Jump to first/last item
- **Space/Enter** - Activate controls
- **Escape** - Close expanded content
```

### Testing Requirements
- Unit tests for all public APIs
- **Accessibility tests for UI components** (required for interactive elements)
- Integration tests with `_base` dependencies
- Cross-browser compatibility validation
- **User preference testing** (reduced motion, high contrast)
- **Keyboard-only navigation testing**

### Documentation Standards
- Complete README.md with usage examples
- **Live Example Links** - Include GitHub Pages demo link if example page exists
- Accurate copy-point.json metadata
- JSDoc comments for complex CSS patterns
- Integration examples for common use cases

### Live Example and Documentation Requirements

## Conventional Commits for Copy-Points

Use these commit message formats:

```bash
# Creating new copy-points
git commit -m "feat(stub:[name]): create [name] copy point"

# Working on copy-points
git commit -m "feat(stub:[name]): add enhanced button variants"
git commit -m "fix(stub:[name]): resolve transition timing issue"
git commit -m "style(stub:[name]): format CSS utility classes"
```

**Important**: After creating a new copy-point, you must manually add its scope to `.commitlintrc.cjs` in the `scope-enum` array.

## CSS Writing Standards

**For complete CSS writing guidelines and patterns, see [CLAUDE_STYLE.md](CLAUDE_STYLE.md).**

This dedicated CSS reference provides comprehensive guidance on:

### Core Standards
- **Colorset system** - Complete color variable usage and RGB space-separated format
- **CSS layer organization** - 4-layer architecture (defaults, components, utilities, layouts)
- **Pattern guidelines** - Component vs utility decision framework
- **Child selector strategy** - Clean HTML structure without verbose class names

### Implementation Details
- **Component patterns** - Prefix-based variations with examples
- **Utility patterns** - Compound class composition
- **Integration patterns** - Combining components, utilities, and layouts
- **Accessibility CSS** - Focus management, user preferences, colorset integration

### Documentation & Performance
- **JSDoc standards** - When and how to document CSS
- **@location key rules** - Unique naming for CSS documentation
- **Performance best practices** - Selector efficiency and optimization
- **Common pitfalls** - What to avoid when writing CSS

**Key Reminders:**
- Always use `rgb(var(--colorset-variable))` format
- Never use direct color values like `#000000` or `blue`
- Follow 4-layer organization for predictable cascade
- Use child selectors for clean component structure
- Include accessibility CSS for interactive elements
