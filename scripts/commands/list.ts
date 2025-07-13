/**
 * List command for copykit CLI
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
      // Use metadata title if available, otherwise use name
      const title = cp.metadata?.title || cp.name
      const description = cp.metadata?.description || 'No description available'

      console.log(`  📦 ${cp.name} - ${title}`)
      console.log(`     ${description}`)
      console.log('')
    })

    console.log('For detailed information about a copy-point:')
    console.log('  copykit info <copy-point-name>')
    console.log('')

    return true
  } catch (error) {
    logError(
      `Failed to list copy-points: ${error instanceof Error ? error.message : String(error)}`,
    )
    return false
  }
}
