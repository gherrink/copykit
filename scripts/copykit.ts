#!/usr/bin/env node

/**
 * CopyKit CLI - Main entry point
 * Provides commands to initialize and manage copykit copy-points
 */

import { resolve } from 'path'
import type { CLIOptions, Command } from './commands/types.js'
import { getCommand } from './commands/registry.js'
import { showGeneralHelp } from './commands/help.js'
import { logError } from './commands/utils.js'

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    return { command: 'help', args: [], flags: {} }
  }

  // Handle --help at the root level
  if (args[0] === '--help' || args[0] === '-h') {
    return { command: 'help', args: [], flags: {} }
  }

  const command = args[0] as Command
  const remainingArgs = args.slice(1)
  const flags: Record<string, boolean | string> = {}
  const nonFlagArgs: string[] = []

  for (let i = 0; i < remainingArgs.length; i++) {
    const arg = remainingArgs[i]

    if (arg.startsWith('--')) {
      const flagName = arg.substring(2)

      // Check if next arg is a value for this flag
      if (i + 1 < remainingArgs.length && !remainingArgs[i + 1].startsWith('--')) {
        flags[flagName] = remainingArgs[i + 1]
        i++ // Skip the next arg since it's a value
      } else {
        flags[flagName] = true
      }
    } else {
      nonFlagArgs.push(arg)
    }
  }

  return {
    command,
    args: nonFlagArgs,
    flags,
  }
}

/**
 * Show general help
 */
function showHelp(): void {
  showGeneralHelp()
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const options = parseArgs()

  try {
    // Get command definition from registry
    const commandDef = getCommand(options.command)

    if (!commandDef) {
      logError(`Unknown command: ${options.command}`)
      showHelp()
      process.exit(1)
    }

    // Show command-specific help if requested
    if (options.flags.help) {
      commandDef.showHelpFunction()
      return
    }

    // Prepare command options based on command type
    let commandOptions: any = {}

    switch (options.command) {
      case 'init': {
        commandOptions = {
          targetPath: resolve(process.cwd()),
          overwrite: !!options.flags.overwrite,
          skipTests: !!options.flags['skip-tests'],
        }
        break
      }

      case 'add': {
        if (options.args.length === 0) {
          logError('Copy-point name is required')
          commandDef.showHelpFunction()
          process.exit(1)
        }

        commandOptions = {
          copyPointName: options.args[0],
          targetPath: resolve(process.cwd()),
          overwrite: !!options.flags.overwrite,
          skipTests: !!options.flags['skip-tests'],
        }
        break
      }

      case 'info': {
        if (options.args.length === 0) {
          logError('Copy-point name is required')
          commandDef.showHelpFunction()
          process.exit(1)
        }

        commandOptions = {
          copyPointName: options.args[0],
        }
        break
      }

      case 'list':
      case 'help': {
        // These commands don't need options
        break
      }
    }

    // Execute the command
    const success = await commandDef.executeFunction(commandOptions)

    if (options.command !== 'help') {
      process.exit(success ? 0 : 1)
    }
  } catch (error) {
    logError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', reason => {
  logError(`Unhandled promise rejection: ${reason}`)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  logError(`Uncaught exception: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})

// Run the CLI
main().catch(error => {
  logError(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
