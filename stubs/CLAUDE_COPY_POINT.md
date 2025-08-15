# Copy-Point Creation Complete Guide

This file provides comprehensive guidance for creating new copy-points in the CopyKit project. Use this as your definitive reference for all copy-point creation workflows, standards, and requirements.

## Quick Start

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

## Copy-Point Creation Process

### 1. Script Features and Validation
The script (`scripts/create-copy-point.js`) automatically:

- **Validates naming**: Ensures kebab-case, no underscores (except `_base`), lowercase only
- **Prevents conflicts**: Checks if copy-point already exists
- **Creates structure**: Standard directories (`scripts/`, `styles/` with all 4 layers)
- **Generates templates**: Starter files with proper JSDoc comments and layer organization
- **Provides guidance**: Shows next steps and commit message format

## Script Options and Usage

### Command-Line Flags

The create-copy-point script supports several flags for quick setup without interactive prompts:

#### Basic Usage
```bash
pnpm run create-copy-point [name] [options]
```

#### Available Flags

**`--styles-only`** - Creates CSS-only copy point
```bash
pnpm run create-copy-point dark-theme --styles-only
```
Creates:
- ✅ `styles/01_defaults/variables.css`
- ✅ `styles/02_components/[name].css`
- ✅ `styles/03_utilities/[name].css`
- ✅ `styles/04_layouts/[name].css`
- ❌ No scripts directory

**`--scripts-only`** - Creates TypeScript-only copy point
```bash
pnpm run create-copy-point utils --scripts-only
```
Creates:
- ✅ `scripts/services/[name].ts`
- ✅ `scripts/utilities/[name].ts`
- ❌ No styles directory

**`--minimal`** - Creates minimal structure
```bash
pnpm run create-copy-point minimal --minimal
```
Creates:
- ✅ `README.md`
- ✅ `copy-point.json`
- ❌ No scripts or styles directories

### Interactive Mode

When no flags are provided, the script prompts for customization:

```bash
pnpm run create-copy-point advanced
# Enters interactive mode with the following prompts:
```

#### Interactive Prompts

**1. Scripts Templates**
```
? Include scripts templates? (y/N)
```
- Default: No
- If yes, enables TypeScript functionality

**1a. Services Templates** (if scripts enabled)
```
? Include scripts/services templates? (Y/n)
```
- Default: Yes
- Creates `scripts/services/[name].ts` with service template

**1b. Utilities Templates** (if scripts enabled)
```
? Include scripts/utilities templates? (y/N)
```
- Default: No
- Creates `scripts/utilities/[name].ts` with utility template

**2. Styles Templates**
```
? Include styles templates? (Y/n)
```
- Default: Yes
- If yes, enables CSS functionality

**2a. Defaults Templates** (if styles enabled)
```
? Include styles/01_defaults templates? (y/N)
```
- Default: No
- Creates `styles/01_defaults/variables.css` with CSS variables template

**2b. Components Templates** (if styles enabled)
```
? Include styles/02_components templates? (Y/n)
```
- Default: Yes
- Creates `styles/02_components/[name].css` with component template

**2c. Utilities Templates** (if styles enabled)
```
? Include styles/03_utilities templates? (y/N)
```
- Default: No
- Creates `styles/03_utilities/[name].css` with utility classes template

**2d. Layouts Templates** (if styles enabled)
```
? Include styles/04_layouts templates? (y/N)
```
- Default: No
- Creates `styles/04_layouts/[name].css` with layout template

### Naming Validation Rules

The script enforces strict naming conventions:

**✅ Valid Names:**
- `advanced` - Single word, lowercase
- `dark-theme` - Kebab-case with hyphens
- `components-extended` - Multiple words with hyphens
- `animations` - Descriptive purpose

**❌ Invalid Names:**
- `_advanced` - Cannot start with underscore (only `_base` allowed)
- `Advanced` - Cannot contain uppercase letters
- `dark_theme` - Cannot contain underscores
- `123advanced` - Cannot start with numbers
- `dark theme` - Cannot contain spaces

**Error Messages:**
```bash
❌ Error: Copy point names should not start with underscore (only _base has underscore)
❌ Error: Copy point name must be lowercase, start with a letter, and use only letters, numbers, and hyphens
❌ Error: Copy point "name" already exists
```

### Template Files Generated

Each option creates specific template files with boilerplate content:

#### Always Created
- `README.md` - Comprehensive documentation template
- `copy-point.json` - Metadata for CLI integration

#### CSS Templates (when styles enabled)
- `01_defaults/variables.css` - CSS custom properties and overrides
- `02_components/[name].css` - Component styling with JSDoc
- `03_utilities/[name].css` - Utility classes
- `04_layouts/[name].css` - Layout patterns

#### TypeScript Templates (when scripts enabled)
- `services/[name].ts` - Service implementation with init function
- `utilities/[name].ts` - Utility functions with examples

### Post-Creation Workflow

After running the script, it displays:

1. **Structure Created** - Visual tree of generated files
2. **Next Steps** - 8-step checklist including:
   - Complete metadata in `copy-point.json`
   - Complete documentation in `README.md`
   - Add scope to `.commitlintrc.cjs`
   - Develop actual components
   - Add UI-Doc comments
   - Create example pages
   - Register styles in `pages/style.css`
   - Test integration with `_base`
3. **Commit Command** - Proper conventional commit format

### 2. Copy-Point Naming Rules
- **Lowercase only**: `advanced`, `dark-theme`, `components-extended`
- **Kebab-case**: Use hyphens for multi-word names
- **No underscores**: Only `_base` uses underscore prefix
- **Descriptive**: Name should indicate purpose (`animations`, `advanced`, `dark-theme`)

### 3. Post-Script Workflow
1. **Script generates**: Complete structure in `stubs/[name]/` including metadata and README.md templates
2. **Complete metadata**: Update `copy-point.json` with accurate title, description, features, and keywords
3. **Complete documentation**: Fill out the generated README.md template with copy-point-specific information
4. **Update commitlint**: Add `stub:[name]` scope to `.commitlintrc.cjs`
5. **Develop components**: Replace template files with actual components
6. **Test integration**: Ensure compatibility with `_base` and other copy-points
7. **Create examples**: Add demonstration pages in `pages/`
8. **Commit changes**: Use `feat(stub:[name]): create [name] copy point`

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

## Metadata Configuration

### copy-point.json Purpose
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

## README.md Documentation Standards

### README.md Purpose
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

### Live Example Documentation Requirements

**When to Include Live Example Section:**
- Check if `/pages/[copy-point-name]/` directory exists with `index.html`
- If exists, add "Live Example" section immediately after "Overview"
- If no example page exists, omit this section entirely

**Live Example Section Format:**
```markdown
## Live Example

**[🌐 View Live Example](https://gherrink.github.io/copykit/[copy-point-name].html)** - See this copy point in action with interactive demonstrations.
```

**GitHub Pages URL Structure:**
- Use flattened HTML structure: `https://gherrink.github.io/copykit/[copy-point-name].html`
- NOT directory structure: `https://gherrink.github.io/copykit/[copy-point-name]/`
- Example: `accordion` copy point → `https://gherrink.github.io/copykit/accordion.html`

**Examples of Copy Points with Live Demos:**
- `accordion/` → `https://gherrink.github.io/copykit/accordion.html`
- `border/` → `https://gherrink.github.io/copykit/border.html`
- `rounded-simple/` → `https://gherrink.github.io/copykit/rounded-simple.html`
- `shadow/` → `https://gherrink.github.io/copykit/shadow.html`

### Main README.md Copy-Point Quick Reference Standards

When documenting copy-points in the main README.md "Available Copy Points" section:

**Required Documentation Format:**
```markdown
#### [`copy-point-name/`](stubs/copy-point-name/README.md) - Brief Title
Short description of the copy-point's purpose and functionality.

- **Feature 1** - Description of key feature
- **Feature 2** - Description of key feature
- **Feature 3** - Description of key feature

> **🌐 [Live Demo](https://gherrink.github.io/copykit/copy-point-name.html)** | **📖 [View complete copy-point-name documentation](stubs/copy-point-name/README.md)**
```

**Live Demo Link Requirements:**
- **Only add live demo links** if `/pages/[copy-point-name]/` directory exists with `index.html`
- **Use flattened HTML structure**: `https://gherrink.github.io/copykit/[copy-point-name].html`
- **NOT directory structure**: `https://gherrink.github.io/copykit/[copy-point-name]/`
- **Format**: `🌐 [Live Demo](url) | 📖 [View complete documentation](readme)`
- **No live demo**: Just use `📖 [View complete copy-point-name documentation](stubs/copy-point-name/README.md)`

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

## Development Standards

### TypeScript Files
**For complete TypeScript development guidelines, see [CLAUDE_TS.md](CLAUDE_TS.md).**

This covers:
- Core architectural principles (HTML attributes, DOM storage, ARIA state)
- Event-driven communication patterns
- Service composition and initialization
- Testing patterns (unit and accessibility)
- Memory management and cleanup
- Framework integration examples

### CSS Files
- **Always use colorset variables** instead of direct color values for consistency and theme switching
- Use CSS custom properties for theming
- Include JSDoc documentation for user-facing components
- Follow the 4-layer architecture
- Ensure accessibility compliance (WCAG 2.1 AA)

**For complete CSS guidelines, see [CLAUDE_CSS.md](CLAUDE_CSS.md)**

## Accessibility Implementation Requirements

Copy-points must follow CopyKit's comprehensive accessibility standards to ensure consistent, inclusive user experiences across all components.

### Component-Level Accessibility Rules
When developing copy-points, components should handle their own specific accessibility behaviors:

**Required Component Patterns:**
- **ARIA Management**: Use `aria-expanded`, `aria-controls`, `aria-hidden`, `role` attributes appropriately
- **Keyboard Navigation**: Implement arrow keys, Home/End navigation, focus management
- **Semantic HTML**: Use proper HTML elements before adding ARIA attributes
- **Progressive Enhancement**: Ensure functionality works without JavaScript first
- **State Management**: Handle expanded/collapsed, active/inactive states accessibly

**For detailed TypeScript implementation patterns, see [CLAUDE_TS.md](CLAUDE_TS.md).**

**For detailed CSS accessibility patterns, see [CLAUDE_CSS.md](CLAUDE_CSS.md)**

### Accessibility Testing Requirements
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

**For complete accessibility testing patterns and examples, see [CLAUDE_TS.md](CLAUDE_TS.md).**

### Documentation Requirements for Accessibility
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

## Testing Requirements

### Testing Standards
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

**For complete CSS writing guidelines and patterns, see [CLAUDE_CSS.md](CLAUDE_CSS.md).**

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