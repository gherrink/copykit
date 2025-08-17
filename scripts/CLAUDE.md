# CopyKit CLI Development Guide

This file provides guidance for developing and maintaining the CopyKit CLI tool that allows users to copy copy-points into their projects.

## CLI Commands

### Build & Development

- `pnpm run build:cli` - Build TypeScript CLI files to JavaScript
- `node scripts/copykit.js <command>` - Test CLI locally during development

### CLI Usage Commands

- `copykit init` - Initialize project with \_base copy-point
- `copykit add <copy-point>` - Add specific copy-point to project
- `copykit list` - List available copy-points with basic information
- `copykit info <copy-point>` - Show detailed copy-point information (features, dependencies, etc.)
- `copykit help` - Show CLI help information

## CLI Architecture

### File Structure

```
scripts/
├── copykit.ts              # Main CLI entry point with command parsing
├── copykit.js              # Compiled CLI executable (ignored by git)
├── create-copy-point.js    # Development script for creating new copy-points
├── CLAUDE.md               # This file - CLI development guidance
└── commands/               # CLI command modules (TypeScript)
    ├── types.ts            # TypeScript interfaces and type definitions
    ├── utils.ts            # Shared utilities (file ops, validation, logging)
    ├── init.ts             # Implementation of 'copykit init' command
    ├── add.ts              # Implementation of 'copykit add' command
    ├── list.ts             # Implementation of 'copykit list' command
    ├── info.ts             # Implementation of 'copykit info' command
    ├── help.ts             # Implementation of 'copykit help' command
    ├── registry.ts         # Command registry and help generation
    └── *.js                # Compiled JavaScript files (ignored by git)
```

### Command Architecture

- **Main Entry** (`copykit.ts`): Command parsing, help system, error handling
- **Commands** (`commands/`): Individual command implementations with validation
- **Utilities** (`commands/utils.ts`): File operations, path resolution, validation
- **Types** (`commands/types.ts`): TypeScript interfaces for type safety

### Path Resolution Strategy

The CLI uses dynamic path resolution to find source copy-points:

```typescript
// From commands/utils.ts
export function getSourceStubsPath(): string {
  const scriptPath = fileURLToPath(import.meta.url)
  const commandsDir = dirname(scriptPath) // commands/
  const scriptsDir = dirname(commandsDir) // scripts/
  const packageRoot = dirname(scriptsDir) // project root
  return join(packageRoot, 'stubs') // /stubs/
}
```

## Development Workflow

### 1. TypeScript Development

- Edit TypeScript files in `scripts/` and `scripts/commands/`
- Use strict TypeScript with ES2020+ features
- Follow existing patterns for command structure

### 2. Build Process

```bash
# Build CLI after making changes
pnpm run build:cli

# This compiles:
# scripts/copykit.ts → scripts/copykit.js
# scripts/commands/*.ts → scripts/commands/*.js
```

### 3. Local Testing

```bash
# Test CLI commands locally
node scripts/copykit.js --help
node scripts/copykit.js list
node scripts/copykit.js info accordion
node scripts/copykit.js init
node scripts/copykit.js add accordion
```

### 4. Validation Workflow

1. **Edit TypeScript** - Make changes to .ts files
2. **Build CLI** - Run `pnpm run build:cli`
3. **Test Commands** - Verify functionality with `node scripts/copykit.js`
4. **Test Integration** - Create test directory and verify copy operations
5. **Commit Changes** - Only commit .ts files (JS files are ignored)

## Conventional Commits for CLI Development

Use the `scripts` scope for all CLI and development tool changes:

**Examples:**

- `feat(scripts): add new copykit command`
- `fix(scripts): resolve CLI path resolution issue`
- `refactor(scripts): move CLI commands to subdirectory`
- `docs(scripts): update CLI development guide`
- `test(scripts): add CLI functionality tests`
- `style(scripts): format TypeScript CLI code`

**When to use `scripts` scope:**

- Changes to `copykit.ts` or CLI command files in `commands/`
- Updates to build scripts or development tools
- CLI-related documentation in `scripts/CLAUDE.md`
- TypeScript compilation or configuration changes
- CLI testing and validation improvements

**Scope Reference:** See [../CLAUDE.md](../CLAUDE.md) for complete list of valid scopes and general commit guidelines.

## Testing the CLI

### Manual Testing Process

```bash
# 1. Build the CLI
pnpm run build:cli

# 2. Test command parsing
node scripts/copykit.js --help
node scripts/copykit.js list
node scripts/copykit.js info accordion

# 3. Test copy operations in a temporary directory
mkdir test-cli && cd test-cli

# 4. Test init command
node ../scripts/copykit.js init
ls -la stubs/  # Should show _base/ directory

# 5. Test add command
node ../scripts/copykit.js add accordion
ls -la stubs/  # Should show _base/ and accordion/

# 6. Clean up
cd .. && rm -rf test-cli
```

### Validation Checklist

- [ ] `copykit --help` shows proper help text
- [ ] `copykit list` displays all available copy-points with basic information
- [ ] `copykit info <name>` shows detailed copy-point information
- [ ] `copykit info nonexistent` shows helpful error with available options
- [ ] `copykit init` copies \_base copy-point successfully
- [ ] `copykit add <name>` copies specific copy-point
- [ ] File operations work with proper validation
- [ ] Error messages are clear and helpful
- [ ] CLI works from any directory (path resolution)

## CLI Implementation Details

### Command Structure

Each command follows this pattern:

```typescript
// commands/[command].ts
export async function execute[Command](options: CommandOptions): Promise<boolean> {
  // 1. Validation
  // 2. File operations
  // 3. User feedback
  // 4. Return success status
}

export function show[Command]Help(): void {
  // Command-specific help text
}
```

### Copy Point Metadata System

The CLI now uses a dynamic metadata loading system for rich copy point information:

**Metadata Files** (`copy-point.json`):

```json
{
  "name": "accordion",
  "title": "Accordion Component",
  "description": "Advanced accordion component with full accessibility support...",
  "version": "1.0.0",
  "features": ["ARIA compliant accessibility", "Keyboard navigation support"],
  "dependencies": [],
  "author": "CopyKit",
  "keywords": ["accordion", "component", "accessible"]
}
```

**Command Behavior**:

- `copykit list` - Shows name, title, and description only (clean overview)
- `copykit info <name>` - Shows complete metadata including features, dependencies, version, etc.

**Implementation**:

- `utils.ts` - `loadCopyPointMetadata()` function reads JSON files
- `analyzeCopyPoint()` - Merges metadata with structural analysis
- Gracefully handles missing metadata files

### Error Handling

- Commands return `boolean` for success/failure
- Use `logError()`, `logWarning()`, `logSuccess()` for consistent output
- Provide clear, actionable error messages
- Exit with appropriate status codes (0 = success, 1 = error)

### File Operations

- Use `fs/promises` for async file operations
- Validate paths before operations
- Handle overwrite scenarios with `--overwrite` flag
- Support `--skip-tests` for excluding test files
- Create directory structures recursively

## Distribution & Packaging

### Package.json Configuration

```json
{
  "bin": {
    "copykit": "scripts/copykit.js"
  },
  "scripts": {
    "build:cli": "tsc scripts/copykit.ts scripts/commands/*.ts --outDir scripts --target es2020 --module node16 --moduleResolution node16 --esModuleInterop"
  }
}
```

### Build Output

- TypeScript compiles to `scripts/copykit.js` (main executable)
- Command modules compile to `scripts/commands/*.js`
- All `.js` files are ignored by git but included in npm package
- Main executable has `#!/usr/bin/env node` shebang

### Installation Methods

Users can install via:

```bash
# Global installation
npm install -g copykit

# Or use without installation
npx copykit <command>
```

## TypeScript Configuration

### Compilation Settings

```bash
# CLI build command uses these TypeScript settings:
--target es2020           # Modern JavaScript features
--module node16          # Node.js ES modules
--moduleResolution node16 # Node.js module resolution
--esModuleInterop        # CommonJS interop
--outDir scripts         # Output to scripts directory
```

### Import Patterns

```typescript
// Use .js extensions in imports (for compiled output)
import { executeInit } from './commands/init.js'
import type { CLIOptions } from './commands/types.js'

// Use ES modules throughout
export function myFunction() {}
```

## Ignore Files & Git

### Files Ignored

All compiled JavaScript files are ignored by:

- **Git** (`.gitignore`): `scripts/copykit.js`, `scripts/commands/*.js`
- **ESLint** (`.eslintignore`): Same pattern
- **Prettier** (`.prettierignore`): Same pattern

### Workflow Impact

- Only commit TypeScript source files
- Compiled JavaScript is generated during build
- Users receive compiled JavaScript in npm package
- Development works with TypeScript exclusively

## Troubleshooting

### Common Issues

**"Copy-point not found" errors:**

- Check `getSourceStubsPath()` is resolving correctly
- Verify source copy-points exist in `/stubs/` directory
- Test path resolution with `console.log()` if needed

**TypeScript compilation errors:**

- Check import paths use `.js` extensions
- Verify all required types are exported
- Ensure ES module syntax throughout

**CLI not working after changes:**

- Run `pnpm run build:cli` after editing TypeScript
- Check file permissions on `scripts/copykit.js`
- Verify shebang line is present in compiled file

**Path resolution issues:**

- CLI must work from any directory
- Test in temporary directories outside project
- Verify `fileURLToPath(import.meta.url)` works correctly

### Debugging Tips

```bash
# Add logging to debug path resolution
console.log('Script path:', scriptPath)
console.log('Source stubs path:', getSourceStubsPath())

# Test CLI from different directories
cd /tmp && node /path/to/project/scripts/copykit.js list
```

## Adding New Commands

### 1. Create Command File

```typescript
// commands/new-command.ts
export async function executeNewCommand(options: NewCommandOptions): Promise<boolean> {
  // Implementation
}

export function showNewCommandHelp(): void {
  // Help text
}
```

### 2. Update Types

```typescript
// commands/types.ts
export type Command = 'init' | 'add' | 'list' | 'info' | 'new-command' | 'help'

export interface NewCommandOptions {
  // Command-specific options
}
```

### 3. Update Main CLI

```typescript
// copykit.ts
import { executeNewCommand, showNewCommandHelp } from './commands/new-command.js'

// Add case to switch statement
case 'new-command': {
  // Handle command
}
```

### 4. Register Command

```typescript
// commands/registry.ts - Add to createCommandRegistry()
registry.registerCommand({
  name: 'new-command',
  description: 'Description of new command',
  usage: 'copykit new-command [options]',
  examples: ['copykit new-command'],
  options: [{ flag: '--help', description: 'Show help' }],
  executeFunction: executeNewCommand,
  showHelpFunction: showNewCommandHelp,
})
```

### 5. Build & Test

```bash
pnpm run build:cli
node scripts/copykit.js new-command --help
```

## Code Standards

### TypeScript Guidelines

- Use strict TypeScript settings
- Export interfaces from `commands/types.ts`
- Use async/await for file operations
- Return `Promise<boolean>` from command functions

### CLI UX Guidelines

- Use emoji icons for visual feedback (✅ ❌ ⚠️ ℹ️)
- Provide clear success/error messages
- Show progress for long operations
- Include next steps after successful operations
- Support `--help` for all commands

### File Operation Guidelines

- Always validate paths before operations
- Use recursive directory creation
- Handle file conflicts gracefully
- Support dry-run mode where applicable
- Log all file operations for transparency

---

For general project development guidance, see [../CLAUDE.md](../CLAUDE.md).
