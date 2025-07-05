/**
 * List command for webbase CLI
 * Lists all available copy-points with their features and dependencies
 */

import { discoverCopyPoints, logError } from './utils.js'

/**
 * List available copy-points
 */
export async function executeList(): Promise<boolean> {
  try {
    const copyPoints = await discoverCopyPoints()

    console.log('Available copy-points:')
    console.log('')

    copyPoints.forEach(cp => {
      const features = []
      if (cp.hasStyles) features.push('styles')
      if (cp.hasScripts) features.push('scripts')
      if (cp.hasTests) features.push('tests')

      console.log(`  ${cp.name}`)
      console.log(`    Features: ${features.join(', ')}`)
      if (cp.dependencies.length > 0) {
        console.log(`    Dependencies: ${cp.dependencies.join(', ')}`)
      }
      console.log('')
    })

    return true
  } catch (error) {
    logError(
      `Failed to list copy-points: ${error instanceof Error ? error.message : String(error)}`,
    )
    return false
  }
}
