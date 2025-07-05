/**
 * Help command for webbase CLI
 * Shows general help information and command-specific help
 */

/**
 * Execute the help command
 */
export async function executeHelp(): Promise<boolean> {
  showGeneralHelp()
  return true
}

/**
 * Show general help information
 */
export function showGeneralHelp(): void {
  console.log('WebBase CLI - Manage webbase copy-points')
  console.log('')
  console.log('Usage: webbase <command> [options]')
  console.log('')
  console.log('Commands:')
  console.log('  init              Initialize project with _base copy-point')
  console.log('  add <name>        Add a copy-point to existing project')
  console.log('  list              List available copy-points')
  console.log('  help              Show this help message')
  console.log('')
  console.log('Examples:')
  console.log('  webbase init')
  console.log('  webbase add accordion')
  console.log('  webbase list')
  console.log('')
  console.log('For command-specific help:')
  console.log('  webbase <command> --help')
}
