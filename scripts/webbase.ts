#!/usr/bin/env node

/**
 * WebBase CLI - Main entry point
 * Provides commands to initialize and manage webbase copy-points
 */

import { resolve } from 'path'
import type { CLIOptions, Command } from './commands/types.js'
import { executeInit, showInitHelp } from './commands/init.js'
import { executeAdd, showAddHelp, executeList } from './commands/add.js'
import { logError } from './commands/utils.js'

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)

  if (args.length === 0) {
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

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const options = parseArgs()

  try {
    switch (options.command) {
      case 'init': {
        if (options.flags.help) {
          showInitHelp()
          return
        }

        const success = await executeInit({
          targetPath: resolve(process.cwd()),
          overwrite: !!options.flags.overwrite,
          skipTests: !!options.flags['skip-tests'],
        })

        process.exit(success ? 0 : 1)
        break
      }

      case 'add': {
        if (options.flags.help) {
          showAddHelp()
          return
        }

        if (options.args.length === 0) {
          logError('Copy-point name is required')
          showAddHelp()
          process.exit(1)
        }

        const success = await executeAdd({
          copyPointName: options.args[0],
          targetPath: resolve(process.cwd()),
          overwrite: !!options.flags.overwrite,
          skipTests: !!options.flags['skip-tests'],
        })

        process.exit(success ? 0 : 1)
        break
      }

      case 'list': {
        const success = await executeList()
        process.exit(success ? 0 : 1)
        break
      }

      case 'help':
      default: {
        showHelp()
        break
      }
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
