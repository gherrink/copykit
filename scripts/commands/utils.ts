/**
 * Shared utilities for the webbase CLI
 */

import { readdir, stat, access, mkdir, copyFile, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync, constants } from 'fs'
import { fileURLToPath } from 'url'
import type {
  CopyPointInfo,
  CopyPointMetadata,
  ValidationResult,
  FileOperation,
  CopyResult,
} from './types.js'

/**
 * Get the source directory for copy-points
 */
export function getSourceStubsPath(): string {
  // The source stubs path should be relative to the package location
  // Script is now in scripts/commands, so we need to go up two levels
  const scriptPath = fileURLToPath(import.meta.url)
  const commandsDir = dirname(scriptPath)
  const scriptsDir = dirname(commandsDir)
  const packageRoot = dirname(scriptsDir)
  return join(packageRoot, 'stubs')
}

/**
 * Load information about a specific copy-point by name
 */
export async function loadCopyPointInfo(name: string): Promise<CopyPointInfo | null> {
  const stubsPath = getSourceStubsPath()
  const copyPointPath = join(stubsPath, name)

  try {
    const entryStat = await stat(copyPointPath)
    if (entryStat.isDirectory()) {
      return await analyzeCopyPoint(name, copyPointPath)
    }
  } catch {
    // Copy point doesn't exist or is not accessible
  }

  return null
}

/**
 * Discover available copy-points in the source directory
 */
export async function discoverCopyPoints(includeHidden: boolean = false): Promise<CopyPointInfo[]> {
  const stubsPath = getSourceStubsPath()

  try {
    const entries = await readdir(stubsPath)
    const copyPoints: CopyPointInfo[] = []

    for (const entry of entries) {
      // Skip hidden copy-points (starting with _) unless explicitly included
      if (!includeHidden && entry.startsWith('_')) {
        continue
      }

      const copyPointInfo = await loadCopyPointInfo(entry)
      if (copyPointInfo) {
        copyPoints.push(copyPointInfo)
      }
    }

    return copyPoints
  } catch (error) {
    throw new Error(
      `Failed to discover copy-points: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Load copy-point metadata from copy-point.json file
 */
async function loadCopyPointMetadata(path: string): Promise<CopyPointMetadata | undefined> {
  const metadataPath = join(path, 'copy-point.json')

  try {
    if (existsSync(metadataPath)) {
      const content = await readFile(metadataPath, 'utf-8')
      return JSON.parse(content) as CopyPointMetadata
    }
  } catch {
    // If metadata file is invalid, continue without it
    console.warn(`Warning: Could not load metadata for copy-point at ${path}`)
  }

  return undefined
}

/**
 * Analyze a copy-point directory structure
 */
async function analyzeCopyPoint(name: string, path: string): Promise<CopyPointInfo> {
  const hasStyles = existsSync(join(path, 'styles'))
  const hasScripts = existsSync(join(path, 'scripts'))
  const hasTests =
    existsSync(join(path, 'scripts')) &&
    (await readdir(join(path, 'scripts'))).some(file => file.includes('.test.'))

  // Load metadata if available
  const metadata = await loadCopyPointMetadata(path)

  // Use metadata dependencies if available, otherwise empty array
  const dependencies = metadata?.dependencies || []

  return {
    name,
    path,
    hasStyles,
    hasScripts,
    hasTests,
    dependencies,
    metadata,
  }
}

/**
 * Validate target directory for webbase operations
 */
export async function validateTargetDirectory(targetPath: string): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check if target directory exists
    await access(targetPath, constants.F_OK)

    // Check if it's a directory
    const targetStat = await stat(targetPath)
    if (!targetStat.isDirectory()) {
      errors.push(`Target path is not a directory: ${targetPath}`)
    }

    // Check if scripts or styles directories already exist
    const scriptsPath = join(targetPath, 'scripts')
    const stylesPath = join(targetPath, 'styles')
    if (existsSync(scriptsPath)) {
      warnings.push(`Scripts directory already exists: ${scriptsPath}`)
    }
    if (existsSync(stylesPath)) {
      warnings.push(`Styles directory already exists: ${stylesPath}`)
    }
  } catch {
    errors.push(`Cannot access target directory: ${targetPath}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get signature files that uniquely identify a copy-point installation
 */
async function getCopyPointSignatureFiles(copyPoint: CopyPointInfo): Promise<string[]> {
  const signatureFiles: string[] = []

  try {
    // Priority 1: Check for unique script files (services first, then utilities)
    if (copyPoint.hasScripts) {
      const scriptsPath = join(copyPoint.path, 'scripts')

      // Check services directory
      const servicesPath = join(scriptsPath, 'services')
      if (existsSync(servicesPath)) {
        const services = await readdir(servicesPath)
        for (const service of services) {
          if (service.endsWith('.ts') && !service.includes('.test.')) {
            signatureFiles.push(join('scripts', 'services', service))
          }
        }
      }

      // Check utilities directory if no services found
      if (signatureFiles.length === 0) {
        const utilitiesPath = join(scriptsPath, 'utilities')
        if (existsSync(utilitiesPath)) {
          const utilities = await readdir(utilitiesPath)
          for (const utility of utilities) {
            if (utility.endsWith('.ts') && !utility.includes('.test.')) {
              signatureFiles.push(join('scripts', 'utilities', utility))
            }
          }
        }
      }
    }

    // Priority 2: Check for unique style files if no scripts found
    if (signatureFiles.length === 0 && copyPoint.hasStyles) {
      const stylesPath = join(copyPoint.path, 'styles')

      // Check each style layer for unique files
      const styleLayers = ['01_defaults', '02_components', '03_utilities', '04_layouts']
      for (const layer of styleLayers) {
        const layerPath = join(stylesPath, layer)
        if (existsSync(layerPath)) {
          const styleFiles = await readdir(layerPath)
          for (const styleFile of styleFiles) {
            if (styleFile.endsWith('.css')) {
              signatureFiles.push(join('styles', layer, styleFile))
              break // Only need one file per layer
            }
          }
        }
      }
    }

    // Fallback: For _base, use known signature files
    if (signatureFiles.length === 0 && copyPoint.name === '_base') {
      signatureFiles.push('scripts/services/expand.ts', 'styles/index.css')
    }

    return signatureFiles
  } catch {
    // If there's any error reading directories, return empty array
    return []
  }
}

/**
 * Check if a copy-point exists in the target directory
 */
export async function copyPointExists(targetPath: string, copyPointName: string): Promise<boolean> {
  try {
    // Get source copy-point info to determine signature files
    const copyPoint = await loadCopyPointInfo(copyPointName)

    if (!copyPoint) {
      // If copy-point doesn't exist in source, it can't be installed
      return false
    }

    // Get signature files from the source copy-point structure
    const signatureFiles = await getCopyPointSignatureFiles(copyPoint)

    // Check if any signature files exist in the target directory
    for (const signatureFile of signatureFiles) {
      const targetFile = join(targetPath, signatureFile)
      if (existsSync(targetFile)) {
        return true
      }
    }

    return false
  } catch {
    // If there's any error, assume copy-point doesn't exist
    return false
  }
}

/**
 * Copy a copy-point to the target directory
 */
export async function copyCopyPoint(
  copyPointName: string,
  targetPath: string,
  overwrite: boolean = false,
  skipTests: boolean = false,
): Promise<CopyResult> {
  const operations: FileOperation[] = []
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Get source copy-point info
    const copyPoint = await loadCopyPointInfo(copyPointName)

    if (!copyPoint) {
      errors.push(`Copy-point "${copyPointName}" not found`)
      return { success: false, operations, errors, warnings }
    }

    // Copy styles if they exist
    if (copyPoint.hasStyles) {
      const targetStylesPath = join(targetPath, 'styles')
      await mkdir(targetStylesPath, { recursive: true })
      await copyDirectory(join(copyPoint.path, 'styles'), targetStylesPath, operations, overwrite)
    }

    // Copy scripts if they exist
    if (copyPoint.hasScripts) {
      const targetScriptsPath = join(targetPath, 'scripts')
      await mkdir(targetScriptsPath, { recursive: true })
      await copyDirectory(
        join(copyPoint.path, 'scripts'),
        targetScriptsPath,
        operations,
        overwrite,
        skipTests,
      )
    }

    return { success: true, operations, errors, warnings }
  } catch (error) {
    errors.push(
      `Failed to copy copy-point: ${error instanceof Error ? error.message : String(error)}`,
    )
    return { success: false, operations, errors, warnings }
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectory(
  source: string,
  destination: string,
  operations: FileOperation[],
  overwrite: boolean,
  skipTests: boolean = false,
): Promise<void> {
  await mkdir(destination, { recursive: true })

  const entries = await readdir(source)

  for (const entry of entries) {
    const sourcePath = join(source, entry)
    const destPath = join(destination, entry)
    const entryStat = await stat(sourcePath)

    if (entryStat.isDirectory()) {
      await copyDirectory(sourcePath, destPath, operations, overwrite, skipTests)
    } else {
      // Skip test files if requested
      if (skipTests && entry.includes('.test.')) {
        continue
      }

      // Check if file exists and handle overwrite
      if (existsSync(destPath) && !overwrite) {
        continue
      }

      await copyFile(sourcePath, destPath)
      operations.push({
        source: sourcePath,
        destination: destPath,
        type: 'copy',
      })
    }
  }
}

/**
 * Create main CSS import file for a copy-point
 */
export async function createMainCSSImport(
  targetPath: string,
  copyPointName: string,
): Promise<void> {
  const stylesPath = join(targetPath, 'styles')

  if (!existsSync(stylesPath)) {
    return
  }

  // Only create index.css for _base copy-point
  if (copyPointName !== '_base') {
    return
  }

  // The _base copy-point should already have an index.css
  // So we don't need to create one
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Log colored output to console
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`)
}

export function logWarning(message: string): void {
  console.log(`⚠️  ${message}`)
}

export function logError(message: string): void {
  console.log(`❌ ${message}`)
}

export function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`)
}
