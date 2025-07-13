/**
 * Info command for copykit CLI
 * Shows detailed information about a specific copy-point
 */

import { discoverCopyPoints, logError } from './utils.js'

export interface InfoOptions {
  copyPointName: string
}

/**
 * Show detailed information about a specific copy-point
 */
export async function executeInfo(options: InfoOptions): Promise<boolean> {
  try {
    const copyPoints = await discoverCopyPoints()
    const copyPoint = copyPoints.find(cp => cp.name === options.copyPointName)

    if (!copyPoint) {
      logError(`Copy-point "${options.copyPointName}" not found`)
      console.log('')
      console.log('Available copy-points:')
      copyPoints.forEach(cp => {
        console.log(`  • ${cp.name}`)
      })
      return false
    }

    // Use metadata title if available, otherwise use name
    const title = copyPoint.metadata?.title || copyPoint.name
    const description = copyPoint.metadata?.description || 'No description available'

    console.log(`📦 ${copyPoint.name} - ${title}`)
    console.log('')
    console.log(`${description}`)
    console.log('')

    // Show features from metadata if available
    if (copyPoint.metadata?.features && copyPoint.metadata.features.length > 0) {
      console.log('✨ Features:')
      copyPoint.metadata.features.forEach(feature => {
        console.log(`   • ${feature}`)
      })
      console.log('')
    }

    // Show structural features
    const structuralFeatures = []
    if (copyPoint.hasStyles) structuralFeatures.push('styles')
    if (copyPoint.hasScripts) structuralFeatures.push('scripts')
    if (copyPoint.hasTests) structuralFeatures.push('tests')

    if (structuralFeatures.length > 0) {
      console.log(`🔧 Includes: ${structuralFeatures.join(', ')}`)
    }

    // Show dependencies if any
    if (copyPoint.dependencies.length > 0) {
      console.log(`📋 Dependencies: ${copyPoint.dependencies.join(', ')}`)
    }

    // Show version if available
    if (copyPoint.metadata?.version) {
      console.log(`📌 Version: ${copyPoint.metadata.version}`)
    }

    // Show author if available
    if (copyPoint.metadata?.author) {
      console.log(`👤 Author: ${copyPoint.metadata.author}`)
    }

    // Show keywords if available
    if (copyPoint.metadata?.keywords && copyPoint.metadata.keywords.length > 0) {
      console.log(`🏷️Keywords: ${copyPoint.metadata.keywords.join(', ')}`)
    }

    console.log('')
    console.log('To add this copy-point to your project:')
    console.log(`  copykit add ${copyPoint.name}`)
    console.log('')

    return true
  } catch (error) {
    logError(
      `Failed to get copy-point info: ${error instanceof Error ? error.message : String(error)}`,
    )
    return false
  }
}

/**
 * Show help for the info command
 */
export function showInfoHelp(): void {
  console.log('Usage: copykit info <copy-point-name>')
  console.log('')
  console.log('Show detailed information about a specific copy-point including features,')
  console.log('dependencies, and other metadata.')
  console.log('')
  console.log('Arguments:')
  console.log('  copy-point-name   Name of the copy-point to show information for')
  console.log('')
  console.log('Examples:')
  console.log('  copykit info accordion')
  console.log('  copykit info elevate')
}
