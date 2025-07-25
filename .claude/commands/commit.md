---
allowed-tools: Bash(git*,pnpm*)
description: Create a git commit following conventional commit standards
---

# Commit Changes

Create a git commit following the project's conventional commit standards defined in CLAUDE.md.

## Process:
1. **Run linting**: Execute `pnpm run lint` to ensure code quality (required by project standards)
2. **Check git status**: Review staged and unstaged changes
3. **Analyze changes**: Understand what files were modified and their purpose
4. **Generate commit message**: Create appropriate conventional commit message using:
   - Valid scopes: `docs`, `pages`, `stub:base`, `stub:[copy-point-name]`
   - Proper commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
5. **Create commit**: Use proper format with Claude Code attribution

## Commit Message Format:
```
type(scope): description

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Examples:
- `feat(stub:base): add new button variants`
- `fix(pages): resolve accordion animation timing`
- `docs: update component usage examples`
- `style(stub:accordion): format CSS utility classes`

Make sure to stage relevant files before committing and follow the project's conventional commit standards exactly as specified in CLAUDE.md.