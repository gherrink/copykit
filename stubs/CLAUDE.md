# Copy-Point Development Guide

This file provides guidance for working with copy-points in the WebBase project.

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
- **Dependencies** - Additional copy-points required beyond `_base` (omit `_base` as it's implicit)
- **Usage** - Basic usage examples and HTML structure
- **CSS Architecture** - Custom properties and component structure
- **Integration Guide** - How to import and use in projects
- **Customization** - Examples of theming and modifications
- **Browser Support** - Compatibility requirements
- **Best Practices** - Recommended usage patterns

**Audience:** End-users of the WebBase CLI who want to understand how to use the copy-point in their projects.

## copy-point.json Purpose

The `copy-point.json` file provides structured metadata for the WebBase CLI and development tools.

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
  "author": "WebBase",
  "keywords": ["relevant", "search", "terms"]
}
```

**CLI Integration:**
- `webbase list` - Shows name, title, and description
- `webbase info <name>` - Shows complete metadata
- Automatic discovery and loading by CLI tools
- Graceful fallback when metadata files are missing

## CSS Layer Organization

Copy-points use a 4-layer CSS architecture:

### 1. Defaults (`01_defaults/`)
- Browser resets and normalizations
- CSS custom properties and variables
- Typography base styles
- Global configuration

### 2. Components (`02_components/`)
- Reusable UI components
- Self-contained component styles
- Component variants and states
- Interactive element styling

### 3. Utilities (`03_utilities/`)
- Single-purpose utility classes
- Spacing, layout, and positioning
- Text and color utilities
- Responsive helpers

### 4. Layouts (`04_layouts/`)
- Page-level structural styles
- Grid and flexbox layouts
- Container and wrapper styles
- Layout-specific component arrangements

## Copy-Point Creation

### IMPORTANT: Always Use the Automated Script
**Never create copy-points manually.** Always use the automated script to ensure consistency and proper structure.

```bash
# REQUIRED: Use this script for all new copy-points
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
- **Prevents conflicts**: Checks if copy-point already exists
- **Creates structure**: Standard directories (`scripts/`, `styles/` with all 4 layers)
- **Generates templates**: Starter files with proper JSDoc comments and layer organization
- **Provides guidance**: Shows next steps and commit message format

### Copy-Point Naming Rules
- **Lowercase only**: `advanced`, `dark-theme`, `components-extended`
- **Kebab-case**: Use hyphens for multi-word names
- **No underscores**: Only `_base` uses underscore prefix
- **Descriptive**: Name should indicate purpose (`animations`, `advanced`, `dark-theme`)

### Post-Script Workflow
1. **Script generates**: Complete structure in `stubs/[name]/` including metadata and README.md templates
2. **Complete metadata**: Update `copy-point.json` with accurate title, description, features, and keywords
3. **Complete documentation**: Fill out the generated README.md template with copy-point-specific information
4. **Update commitlint**: Add `stub:[name]` scope to `.commitlintrc.cjs`
5. **Develop components**: Replace template files with actual components
6. **Test integration**: Ensure compatibility with `_base` and other copy-points
7. **Create examples**: Add demonstration pages in `pages/`
8. **Commit changes**: Use `feat(stub:[name]): create [name] copy point`

## Copy-Point Development Standards

### TypeScript Files
- Use strict TypeScript configuration
- Include comprehensive unit tests (`.test.ts`)
- Add accessibility tests for UI components (`.accessibility.test.ts`)
- Follow existing code patterns and conventions

### CSS Files
- Use CSS custom properties for theming
- Include JSDoc documentation for user-facing components
- Follow the 4-layer architecture
- Ensure accessibility compliance (WCAG 2.1 AA)

### Testing Requirements
- Unit tests for all public APIs
- Accessibility tests for UI components
- Integration tests with `_base` dependencies
- Cross-browser compatibility validation

### Documentation Standards
- Complete README.md with usage examples
- Accurate copy-point.json metadata
- JSDoc comments for complex CSS patterns
- Integration examples for common use cases

## Copy-Point Dependencies

### Base Dependency (_base)
**IMPORTANT**: Do not list `_base` as a dependency in README.md or copy-point.json files.

`_base` is an implicit foundation dependency that provides:
- CSS reset and normalization
- Core utility classes
- Base component styles
- JavaScript utilities (DOM, events, etc.)

### Inter-Copy-Point Dependencies
- **Only list additional copy-points** beyond `_base` in `copy-point.json`
- **Only document non-base dependencies** in README.md
- Ensure compatibility with existing copy-points
- Test integration scenarios
- Provide fallback behavior when dependencies are missing

### Dependency Documentation Rules
- `dependencies: []` - For copy-points that only need `_base`
- `dependencies: ["other-copy-point"]` - For copy-points that need additional ones
- Never include `"_base"` in the dependencies array
- In README.md, only mention additional dependencies beyond `_base`

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