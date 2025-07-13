/**
 * Add command for copykit CLI
 * Adds a specific copy-point to existing project
 */

import type { AddOptions } from './types.js'
import {
  validateTargetDirectory,
  copyCopyPoint,
  copyPointExists,
  discoverCopyPoints,
  loadCopyPointInfo,
  logSuccess,
  logWarning,
  logError,
  logInfo,
} from './utils.js'

/**
 * Execute the add command
 */
export async function executeAdd(options: AddOptions): Promise<boolean> {
  const { copyPointName, targetPath, overwrite = false, skipTests = false } = options

  logInfo(`Adding copy-point "${copyPointName}" to: ${targetPath}`)

  try {
    // Validate target directory
    const validation = await validateTargetDirectory(targetPath)

    if (!validation.valid) {
      logError('Validation failed:')
      validation.errors.forEach(error => logError(`  ${error}`))
      return false
    }

    // Check if _base exists (required for all other copy-points)
    if (copyPointName !== '_base' && !(await copyPointExists(targetPath, '_base'))) {
      logError('_base copy-point is required. Run "copykit init" first.')
      return false
    }

    // Get copy-point info
    const copyPoint = await loadCopyPointInfo(copyPointName)

    if (!copyPoint) {
      logError(`Copy-point "${copyPointName}" not found.`)
      logInfo('Available copy-points:')
      const availableCopyPoints = await discoverCopyPoints()
      availableCopyPoints.forEach(cp => {
        const features = []
        if (cp.hasStyles) features.push('styles')
        if (cp.hasScripts) features.push('scripts')
        if (cp.hasTests) features.push('tests')
        console.log(`  ${cp.name} (${features.join(', ')})`)
      })
      return false
    }

    // Check if copy-point already exists
    if (await copyPointExists(targetPath, copyPointName)) {
      if (!overwrite) {
        logError(`Copy-point "${copyPointName}" already exists. Use --overwrite to replace it.`)
        return false
      } else {
        logWarning(`Overwriting existing ${copyPointName} copy-point`)
      }
    }

    // Check dependencies
    for (const dep of copyPoint.dependencies) {
      if (!(await copyPointExists(targetPath, dep))) {
        logError(`Required dependency "${dep}" not found. Please add it first.`)
        return false
      }
    }

    // Copy the copy-point
    logInfo(`Copying ${copyPointName} copy-point...`)
    const result = await copyCopyPoint(copyPointName, targetPath, overwrite, skipTests)

    if (!result.success) {
      logError(`Failed to copy ${copyPointName} copy-point:`)
      result.errors.forEach(error => logError(`  ${error}`))
      return false
    }

    // Show copy results
    logSuccess(`Successfully added ${copyPointName} copy-point!`)
    logInfo(`Copied ${result.operations.length} files`)

    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => logWarning(warning))
    }

    // Show integration instructions
    console.log('')
    logInfo('Integration instructions:')

    if (copyPoint.hasStyles) {
      console.log('  1. Import styles in your main CSS file:')
      console.log(`     @import "./styles/02_components/${copyPointName}.css";`)
      console.log('     OR import from specific CSS layer directories:')
      console.log(`     @import "./styles/01_defaults/*.css";`)
      console.log(`     @import "./styles/02_components/*.css";`)
      console.log(`     @import "./styles/03_utilities/*.css";`)
      console.log(`     @import "./styles/04_layouts/*.css";`)
    }

    if (copyPoint.hasScripts) {
      console.log('  2. Import functions in your TypeScript/JavaScript:')
      console.log(`     import { ... } from "./scripts/services/...js"`)
      console.log(`     import { ... } from "./scripts/utilities/...js"`)
    }

    console.log('')
    logInfo(`View documentation and examples in the project directory`)

    return true
  } catch (error) {
    logError(`Failed to add copy-point: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

/**
 * Show help for add command
 */
export function showAddHelp(): void {
  console.log('Usage: copykit add <copy-point-name> [options]')
  console.log('')
  console.log('Add a copy-point to an existing copykit project')
  console.log('Files will be copied to scripts/ and styles/ directories in the current directory.')
  console.log('')
  console.log('Arguments:')
  console.log('  copy-point-name  Name of the copy-point to add (e.g., accordion, elevate)')
  console.log('')
  console.log('Options:')
  console.log('  --overwrite     Overwrite existing files')
  console.log('  --skip-tests    Skip copying test files')
  console.log('  --help          Show this help message')
  console.log('')
  console.log('Examples:')
  console.log('  copykit add accordion')
  console.log('  copykit add elevate --overwrite')
  console.log('  copykit add accordion --skip-tests')
}
