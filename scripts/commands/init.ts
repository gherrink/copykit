/**
 * Initialize command for webbase CLI
 * Copies the _base copy-point to target directory
 */

import type { InitOptions } from './types.js'
import {
  validateTargetDirectory,
  copyCopyPoint,
  copyPointExists,
  logSuccess,
  logWarning,
  logError,
  logInfo,
} from './utils.js'

/**
 * Execute the init command
 */
export async function executeInit(options: InitOptions): Promise<boolean> {
  const { targetPath, overwrite = false, skipTests = false } = options

  logInfo(`Initializing webbase in: ${targetPath}`)

  try {
    // Validate target directory
    const validation = await validateTargetDirectory(targetPath)

    if (!validation.valid) {
      logError('Validation failed:')
      validation.errors.forEach(error => logError(`  ${error}`))
      return false
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => logWarning(warning))
    }

    // Check if _base already exists
    if (copyPointExists(targetPath, '_base')) {
      if (!overwrite) {
        logError('_base copy-point already exists. Use --overwrite to replace it.')
        return false
      } else {
        logWarning('Overwriting existing _base copy-point')
      }
    }

    // Copy _base copy-point
    logInfo('Copying _base copy-point...')
    const result = await copyCopyPoint('_base', targetPath, overwrite, skipTests)

    if (!result.success) {
      logError('Failed to copy _base copy-point:')
      result.errors.forEach(error => logError(`  ${error}`))
      return false
    }

    // Show copy results
    logSuccess('Successfully initialized webbase!')
    logInfo(`Copied ${result.operations.length} files`)

    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => logWarning(warning))
    }

    // Show next steps
    console.log('')
    logInfo('Next steps:')
    console.log('  1. Import styles in your main CSS file:')
    console.log('     @import "./stubs/_base/styles/index.css";')
    console.log('')
    console.log('  2. Import utilities in your TypeScript/JavaScript:')
    console.log('     import { expand } from "./stubs/_base/scripts/services/expand.js"')
    console.log('     import { selectParent } from "./stubs/_base/scripts/utilities/select.js"')
    console.log('')
    console.log('  3. Add additional copy-points:')
    console.log('     webbase add accordion')
    console.log('     webbase add elevate')
    console.log('')

    return true
  } catch (error) {
    logError(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

/**
 * Show help for init command
 */
export function showInitHelp(): void {
  console.log('Usage: webbase init [options]')
  console.log('')
  console.log('Initialize a new webbase project by copying the _base copy-point')
  console.log('')
  console.log('Options:')
  console.log('  --overwrite     Overwrite existing files')
  console.log('  --skip-tests    Skip copying test files')
  console.log('  --help          Show this help message')
  console.log('')
  console.log('Examples:')
  console.log('  webbase init')
  console.log('  webbase init --overwrite')
  console.log('  webbase init --skip-tests')
}
