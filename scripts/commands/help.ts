/**
 * Help command for copykit CLI
 * Shows general help information and command-specific help
 */

import { generateGeneralHelp } from './registry.js'

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
  generateGeneralHelp()
}
