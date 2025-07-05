#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

/**
 * Create a new copy point with the standard WebBase structure
 */
async function createCopyPoint() {
  const args = process.argv.slice(2)
  const name = args[0]

  if (!name) {
    console.error('❌ Error: Copy point name is required')
    console.log('Usage: pnpm run create-copy-point [name] [options]')
    console.log('Examples:')
    console.log('  pnpm run create-copy-point advanced')
    console.log('  pnpm run create-copy-point dark-theme --styles-only')
    console.log('  pnpm run create-copy-point utils --scripts-only')
    console.log('  pnpm run create-copy-point minimal --minimal')
    process.exit(1)
  }

  // Validate name
  if (name.startsWith('_')) {
    console.error(
      '❌ Error: Copy point names should not start with underscore (only _base has underscore)',
    )
    process.exit(1)
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error(
      '❌ Error: Copy point name must be lowercase, start with a letter, and use only letters, numbers, and hyphens',
    )
    console.log('Examples: advanced, components-extended, dark-theme')
    process.exit(1)
  }

  const copyPointPath = join('stubs', name)

  // Check if copy point already exists
  if (existsSync(copyPointPath)) {
    console.error(`❌ Error: Copy point "${name}" already exists`)
    process.exit(1)
  }

  // Parse command line flags
  const flags = parseFlags(args.slice(1))

  // Determine what to create based on flags or user input
  const options = await determineOptions(flags)

  console.log(`🚀 Creating copy point "${name}"...`)

  try {
    // Create directory structure based on options
    const dirs = []

    if (options.includeScripts) {
      if (options.includeServices) dirs.push(join(copyPointPath, 'scripts', 'services'))
      if (options.includeUtilities) dirs.push(join(copyPointPath, 'scripts', 'utilities'))
    }

    if (options.includeStyles) {
      if (options.includeDefaults) dirs.push(join(copyPointPath, 'styles', '01_defaults'))
      if (options.includeComponents) dirs.push(join(copyPointPath, 'styles', '02_components'))
      if (options.includeStyleUtilities) dirs.push(join(copyPointPath, 'styles', '03_utilities'))
      if (options.includeLayouts) dirs.push(join(copyPointPath, 'styles', '04_layouts'))
    }

    for (const dir of dirs) {
      await mkdir(dir, { recursive: true })
    }

    // Create template files based on options
    await createTemplateFiles(copyPointPath, name, options)

    console.log('✅ Copy point created successfully!')
    console.log('')

    // Show dynamic structure based on what was created
    showCreatedStructure(name, options)

    console.log('')
    console.log('📝 Next steps:')
    console.log(`   1. Complete the documentation in stubs/${name}/README.md`)
    console.log(`   2. Add "stub:${name}" scope to .commitlintrc.cjs`)
    console.log(`   3. Develop components in stubs/${name}/`)
    console.log('   4. Add UI-Doc block comments')
    console.log('   5. May create example pages demonstrating the components')
    console.log('   6. Do not forget to register your styles in pages/style.css')
    console.log('   7. Test integration with _base copy point')
    console.log('')
    console.log('💡 Commit your changes:')
    console.log(`   git commit -m "feat(stub:${name}): init"`)
  } catch (error) {
    console.error('❌ Error creating copy point:', error.message)
    process.exit(1)
  }
}

/**
 * Show the created structure dynamically based on options
 */
function showCreatedStructure(name, options) {
  console.log('📁 Structure created:')
  console.log(`   stubs/${name}/`)
  console.log('   ├── README.md')

  if (options.includeScripts) {
    const hasStyles = options.includeStyles
    const scriptsPrefix = hasStyles ? '   ├── scripts/' : '   └── scripts/'
    console.log(scriptsPrefix)
    
    if (options.includeServices) console.log('   │   ├── services/')
    if (options.includeUtilities) {
      const prefix = options.includeServices ? '   │   └── utilities/' : '   │   └── utilities/'
      console.log(prefix)
    }
  }

  if (options.includeStyles) {
    console.log('   └── styles/')

    if (options.includeDefaults) console.log('       ├── 01_defaults/')
    if (options.includeComponents) console.log('       ├── 02_components/')
    if (options.includeStyleUtilities) console.log('       ├── 03_utilities/')
    if (options.includeLayouts) console.log('       └── 04_layouts/')
  }

  if (!options.includeScripts && !options.includeStyles) {
    console.log('   └── README.md (only)')
  }
}

/**
 * Parse command line flags
 */
function parseFlags(args) {
  return {
    stylesOnly: args.includes('--styles-only'),
    scriptsOnly: args.includes('--scripts-only'),
    minimal: args.includes('--minimal'),
  }
}

/**
 * Determine what to create based on flags or user input
 */
async function determineOptions(flags) {
  // Quick mode flags
  if (flags.minimal) {
    return {
      includeScripts: false,
      includeServices: false,
      includeUtilities: false,
      includeStyles: false,
      includeDefaults: false,
      includeComponents: false,
      includeStyleUtilities: false,
      includeLayouts: false,
    }
  }

  if (flags.stylesOnly) {
    return {
      includeScripts: false,
      includeServices: false,
      includeUtilities: false,
      includeStyles: true,
      includeDefaults: true,
      includeComponents: true,
      includeStyleUtilities: true,
      includeLayouts: true,
    }
  }

  if (flags.scriptsOnly) {
    return {
      includeScripts: true,
      includeServices: true,
      includeUtilities: true,
      includeStyles: false,
      includeDefaults: false,
      includeComponents: false,
      includeStyleUtilities: false,
      includeLayouts: false,
    }
  }

  // Interactive mode
  return await promptForOptions()
}

/**
 * Prompt user for what to include
 */
async function promptForOptions() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = prompt =>
    new Promise(resolve => {
      rl.question(prompt, resolve)
    })

  console.log('\n📝 What templates would you like to include?')

  const includeScripts = (await question('? Include scripts templates? (y/N) ')) === 'y'
  let includeServices = false
  let includeUtilities = false

  if (includeScripts) {
    includeServices = (await question('? Include scripts/services templates? (Y/n) ')) !== 'n'
    includeUtilities = (await question('? Include scripts/utilities templates? (y/N) ')) === 'y'
  }

  const includeStyles = (await question('? Include styles templates? (Y/n) ')) !== 'n'
  let includeDefaults = false
  let includeComponents = false
  let includeStyleUtilities = false
  let includeLayouts = false

  if (includeStyles) {
    includeDefaults = (await question('? Include styles/01_defaults templates? (y/N) ')) === 'y'
    includeComponents = (await question('? Include styles/02_components templates? (Y/n) ')) !== 'n'
    includeStyleUtilities =
      (await question('? Include styles/03_utilities templates? (y/N) ')) === 'y'
    includeLayouts = (await question('? Include styles/04_layouts templates? (y/N) ')) === 'y'
  }

  rl.close()

  return {
    includeScripts,
    includeServices,
    includeUtilities,
    includeStyles,
    includeDefaults,
    includeComponents,
    includeStyleUtilities,
    includeLayouts,
  }
}

/**
 * Create template files for the copy point
 */
async function createTemplateFiles(copyPointPath, name, options) {
  // Create README.md file
  const readmeContent = createReadmeTemplate(name)
  await writeFile(join(copyPointPath, 'README.md'), readmeContent)

  // CSS template files
  const cssTemplates = {}
  if (options.includeDefaults)
    cssTemplates['01_defaults/variables.css'] = createDefaultsTemplate(name)
  if (options.includeComponents)
    cssTemplates[`02_components/${name}.css`] = createComponentTemplate(name)
  if (options.includeStyleUtilities)
    cssTemplates[`03_utilities/${name}.css`] = createUtilityTemplate(name)
  if (options.includeLayouts) cssTemplates[`04_layouts/${name}.css`] = createLayoutTemplate(name)

  // JavaScript template files
  const jsTemplates = {}
  if (options.includeServices) jsTemplates[`services/${name}.ts`] = createServiceTemplate(name)
  if (options.includeUtilities)
    jsTemplates[`utilities/${name}.ts`] = createUtilityScriptTemplate(name)

  // Write CSS files
  for (const [path, content] of Object.entries(cssTemplates)) {
    await writeFile(join(copyPointPath, 'styles', path), content)
  }

  // Write JavaScript files
  for (const [path, content] of Object.entries(jsTemplates)) {
    await writeFile(join(copyPointPath, 'scripts', path), content)
  }
}

/**
 * Template generators
 */
function createDefaultsTemplate(name) {
  return `/**
 * Default variables and overrides for ${name} copy point
 *
 * Extend or override variables from _base copy point here.
 * These should build upon the foundation provided by _base.
 *
 * @location defaults.${name} ${name.charAt(0).toUpperCase() + name.slice(1)} Defaults
 * @order 10
 */

:root {
  /* Override or extend base variables */
  /* --example-color: 120 50 50; */

  /* Add new variables specific to ${name} */
  /* --${name}-primary: var(--color-blue); */
  /* --${name}-secondary: var(--color-gray); */
}
`
}

function createComponentTemplate(name) {
  return `/**
 * Example component for ${name} copy point
 *
 * This is a template component. Replace with actual components
 * that extend or enhance the base components.
 *
 * @location components.${name} ${name.charAt(0).toUpperCase() + name.slice(1)}
 * @order 10
 * @example
 * <div class="${name}">Example component</div>
 */

@layer components {
  .${name} {
    /* Base styles building on _base foundation */
    padding: calc(var(--space-unit) * var(--space-md));
    border-radius: var(--border-radius-base);

    /* ${name}-specific styling */
    /* Add your component styles here */
  }
}
`
}

function createUtilityTemplate(name) {
  return `/**
 * Example utilities for ${name} copy point
 *
 * Additional utility classes that extend the base utilities.
 *
 * @location utilities.${name} ${name.charAt(0).toUpperCase() + name.slice(1)}
 * @order 10
 */

@layer utilities {
  /* Example utility classes for ${name} */
  .${name}-spacing {
    /* Add spacing utilities specific to ${name} */
  }

  .${name}-layout {
    /* Add layout utilities specific to ${name} */
  }
}
`
}

function createLayoutTemplate(name) {
  return `/**
 * Example layouts for ${name} copy point
 *
 * Layout patterns and page-level styles that build upon base layouts.
 *
 * @location layouts.${name} ${name.charAt(0).toUpperCase() + name.slice(1)}
 * @order 10
 */

@layer layouts {
  /* Example layout for ${name} */
  .${name} {
    /* Add layout styles specific to ${name} */
  }
}
`
}

function createServiceTemplate(name) {
  return `/**
 * Example service for ${name} copy point
 *
 * Interactive functionality that extends base services.
 *
 * @location functions.${name} ${name.charAt(0).toUpperCase() + name.slice(1)}
 * @order 10
 */

/**
 * Example service function for ${name}
 * Replace this with actual service functionality.
 */
export function init${name.charAt(0).toUpperCase() + name.slice(1)}(): void {
  // Initialize ${name} functionality
  console.log('${name} service initialized')

  // Add your service logic here
}
`
}

function createUtilityScriptTemplate(name) {
  return `/**
 * Example utilities for ${name} copy point
 *
 * Helper functions that extend base utilities.
 */

/**
 * Example utility function for ${name}
 * Replace this with actual utility functions.
 */
export function ${name}Helper(): void {
  // Add utility function logic here
}

/**
 * Another example utility
 */
export function format${name.charAt(0).toUpperCase() + name.slice(1)}(value: string): string {
  // Add formatting logic specific to ${name}
  return value
}
`
}

function createReadmeTemplate(name) {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
  return `# ${name} Copy Point

A description of what this copy point provides and its main features.

## Overview

Brief overview of the copy point's purpose and what it contains.

## Dependencies

> **⚠️ Important**: The \`${name}\` copy-point requires the \`_base\` copy-point to be installed first.

## Features

- Feature 1
- Feature 2  
- Feature 3

## Usage

### Basic Usage

\`\`\`html
<!-- Basic usage example -->
<div class="${name}">
  Example content
</div>
\`\`\`

### CSS Integration

\`\`\`css
/* Import ${name} styles */
@import "./stubs/${name}/styles/02_components/${name}.css";
\`\`\`

## CSS Architecture

### Custom Properties

The ${name} component uses CSS custom properties for customization:

\`\`\`css
:root {
  /* Add relevant custom properties */
}
\`\`\`

## Integration Guide

### Installation

Use the WebBase CLI:
\`\`\`bash
webbase add ${name}
\`\`\`

Or copy manually:
\`\`\`bash
cp -r stubs/${name}/ your-project/src/
\`\`\`

## Customization

Examples of how to customize the ${name} components.

## Browser Support

- Modern browsers with ES2020+ support
- CSS Custom Properties support required
- [Add specific requirements]

## Best Practices

1. Best practice 1
2. Best practice 2
3. Best practice 3

## Resources

- [Relevant documentation links]
`
}

// Run the script
createCopyPoint().catch(console.error)
