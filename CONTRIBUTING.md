# Contributing to WebBase

We welcome contributions! Please follow these guidelines to ensure a smooth collaboration process.

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with commitlint enforcement.

**Valid scopes** (enforced by commitlint):
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

**Examples**:
```bash
git commit -m "feat(pages): add new themed page template"
git commit -m "fix(stub:base): resolve expand animation timing issue"
git commit -m "feat(stub:advanced): add new advanced button variants"
git commit -m "docs: update component usage examples"
git commit -m "style(stub:base): format CSS utility classes"
git commit -m "chore: update dependencies"
```

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project's code style
4. Ensure all linting and formatting passes (`pnpm run lint` and `pnpm run format`)
5. Commit your changes with conventional commit messages
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Quality Standards

Before submitting a pull request, ensure your code meets these standards:

### Linting and Formatting
- Run `pnpm run lint` to check for linting issues
- Run `pnpm run lint:fix` to automatically fix linting issues
- Run `pnpm run format` to format code with Prettier
- Run `pnpm run format:check` to verify formatting

### Code Style
- Follow TypeScript strict mode conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Ensure proper ARIA attributes for accessibility
- Use CSS custom properties for theming

### Testing
- Ensure your changes don't break existing functionality
- Test across different browsers if making UI changes
- Verify accessibility compliance

## Project Structure Guidelines

When contributing, follow these structural guidelines:

### CSS Architecture
- Place styles in the appropriate layer (`01_defaults`, `02_components`, `03_utilities`, `04_layouts`)
- Use CSS custom properties for theming
- Follow the existing naming conventions
- Document new CSS variables with JSDoc comments

### JavaScript/TypeScript
- Place reusable utilities in `stubs/_base/scripts/utilities/`
- Place feature services in `stubs/_base/scripts/services/`
- Use the `@/` alias for imports from `stubs/`
- Follow existing patterns for DOM manipulation and event handling

### HTML Templates
- Use semantic HTML elements
- Include proper ARIA attributes
- Follow accessibility best practices
- Use the established CSS class naming patterns

## Creating New Copy Points

WebBase is organized around copy points that users can copy into their projects. Here's how to create a new copy point:

### Copy Point Structure

All copy points (except `_base`) follow this naming and structure:

```
stubs/
├── _base/                   # Foundation copy point (with underscore)
└── [new-copy-point]/        # New copy points (no underscore)
    ├── scripts/
    │   ├── services/        # Interactive functionality
    │   └── utilities/       # Helper functions
    └── styles/
        ├── 01_defaults/     # Foundation extensions/overrides
        ├── 02_components/   # New or modified components
        ├── 03_utilities/    # New or modified utilities
        └── 04_layouts/      # New or modified layouts
```

### Guidelines for New Copy Points

1. **Naming Convention**:
   - Use descriptive names: `advanced`, `animations`, `components-extended`
   - No underscores (only `_base` has an underscore)
   - Use kebab-case for multi-word names

2. **Content Strategy**:
   - **Extend, don't replace**: Build upon `_base` foundation
   - **Layer-based organization**: Follow the CSS layer structure
   - **Modular approach**: Users should be able to copy individual files
   - **No index.css**: Only `_base` includes the main `index.css` file

3. **CSS Layer Guidelines**:
   - `01_defaults/`: Extend or override base variables and defaults
   - `02_components/`: New components or enhanced versions of base components
   - `03_utilities/`: Additional utility classes or enhanced base utilities
   - `04_layouts/`: New layout patterns or modifications

4. **JavaScript Guidelines**:
   - `services/`: New interactive functionality or enhanced services
   - `utilities/`: Additional helper functions or enhanced base utilities
   - Maintain compatibility with base utilities when possible

### Automated Script Benefits

The `create-copy-point` script provides several advantages:

- **Consistent Structure**: Automatically creates the standard directory layout
- **Template Files**: Generates starter files with proper JSDoc comments and structure
- **Validation**: Ensures naming conventions are followed (no underscores, kebab-case)
- **Error Prevention**: Checks if copy point already exists and validates input
- **Guidance**: Provides clear next steps after creation

### Step-by-Step Process

1. **Plan Your Copy Point**:
   - Define the purpose and scope
   - Determine what components/utilities it will provide
   - Ensure it complements existing copy points

2. **Generate with Script** (Recommended):
   ```bash
   # Create a new copy point with proper structure and templates
   pnpm run create-copy-point [copy-point-name]
   
   # Examples:
   pnpm run create-copy-point advanced
   pnpm run create-copy-point dark-theme
   pnpm run create-copy-point components-extended
   ```
   
   **Alternative: Manual Creation**:
   ```bash
   mkdir -p stubs/[copy-point-name]/scripts/{services,utilities}
   mkdir -p stubs/[copy-point-name]/styles/{01_defaults,02_components,03_utilities,04_layouts}
   ```

3. **Develop Components**:
   - Follow existing naming conventions
   - Use CSS custom properties for theming
   - Ensure accessibility compliance
   - Add JSDoc comments for documentation

4. **Test Integration**:
   - Test copying individual files
   - Test copying the entire copy point
   - Test mixing with `_base` and other copy points
   - Verify CSS layer cascading works properly

5. **Create Examples**:
   - Add demonstration pages in `pages/`
   - Show how components work with the `@/` alias
   - Document usage patterns

6. **Update Documentation**:
   - Add copy point to README.md
   - Update UI-Doc comments
   - Add examples and usage notes

### Commit Scope for New Copy Points

When creating a new copy point, use the appropriate commit scope:

```bash
# Creating a new copy point
git commit -m "feat(stub:[copy-point-name]): create [copy-point-name] copy point"

# Adding components to a copy point
git commit -m "feat(stub:[copy-point-name]): add advanced button variants"

# Fixing issues in a copy point
git commit -m "fix(stub:[copy-point-name]): resolve animation timing issue"
```

### Quality Checklist

Before submitting a new copy point:

- [ ] Follows the standard directory structure
- [ ] No `index.css` file (only in `_base`)
- [ ] All CSS uses appropriate layers
- [ ] JavaScript follows existing patterns
- [ ] Components are accessible (ARIA compliant)
- [ ] JSDoc comments are complete
- [ ] Integration testing completed
- [ ] Example pages created
- [ ] Documentation updated

## Pull Request Guidelines

When submitting a pull request:

1. **Title**: Use a clear, descriptive title following conventional commit format
2. **Description**: Explain what your changes do and why
3. **Testing**: Describe how you tested your changes
4. **Breaking Changes**: Clearly document any breaking changes
5. **Screenshots**: Include screenshots for UI changes

## Questions and Support

If you have questions about contributing:

1. Check existing issues and discussions
2. Review the project documentation
3. Open an issue for discussion before starting major changes

Thank you for contributing to WebBase! 🎉