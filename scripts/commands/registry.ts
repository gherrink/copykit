/**
 * Command registry for webbase CLI
 * Central registry for all available commands with metadata
 */

import type { Command, CommandDefinition, CommandRegistry } from './types.js'
import { executeInit, showInitHelp } from './init.js'
import { executeAdd, showAddHelp } from './add.js'
import { executeList } from './list.js'
import { executeInfo, showInfoHelp } from './info.js'
import { executeHelp, showGeneralHelp } from './help.js'

/**
 * Registry implementation for managing CLI commands
 */
class WebBaseCommandRegistry implements CommandRegistry {
  commands = new Map<Command, CommandDefinition>()

  getCommand(name: Command): CommandDefinition | undefined {
    return this.commands.get(name)
  }

  getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values())
  }

  registerCommand(definition: CommandDefinition): void {
    this.commands.set(definition.name, definition)
  }
}

/**
 * Create and configure the command registry
 */
function createCommandRegistry(): CommandRegistry {
  const registry = new WebBaseCommandRegistry()

  // Register init command
  registry.registerCommand({
    name: 'init',
    description: 'Initialize project with _base copy-point',
    usage: 'webbase init [options]',
    examples: ['webbase init', 'webbase init --overwrite', 'webbase init --skip-tests'],
    options: [
      { flag: '--overwrite', description: 'Overwrite existing files' },
      { flag: '--skip-tests', description: 'Skip copying test files' },
      { flag: '--help', description: 'Show help for init command' },
    ],
    executeFunction: executeInit,
    showHelpFunction: showInitHelp,
  })

  // Register add command
  registry.registerCommand({
    name: 'add',
    description: 'Add a copy-point to existing project',
    usage: 'webbase add <copy-point-name> [options]',
    examples: [
      'webbase add accordion',
      'webbase add elevate --overwrite',
      'webbase add accordion --skip-tests',
    ],
    options: [
      { flag: '--overwrite', description: 'Overwrite existing files' },
      { flag: '--skip-tests', description: 'Skip copying test files' },
      { flag: '--help', description: 'Show help for add command' },
    ],
    executeFunction: executeAdd,
    showHelpFunction: showAddHelp,
  })

  // Register list command
  registry.registerCommand({
    name: 'list',
    description: 'List available copy-points',
    usage: 'webbase list',
    examples: ['webbase list'],
    options: [],
    executeFunction: executeList,
    showHelpFunction: () => {
      console.log('Usage: webbase list')
      console.log('')
      console.log('List all available copy-points with basic information')
    },
  })

  // Register info command
  registry.registerCommand({
    name: 'info',
    description: 'Show detailed information about a copy-point',
    usage: 'webbase info <copy-point-name>',
    examples: ['webbase info _base', 'webbase info accordion', 'webbase info elevate'],
    options: [{ flag: '--help', description: 'Show help for info command' }],
    executeFunction: executeInfo,
    showHelpFunction: showInfoHelp,
  })

  // Register help command
  registry.registerCommand({
    name: 'help',
    description: 'Show help information',
    usage: 'webbase help',
    examples: ['webbase help', 'webbase --help'],
    options: [],
    executeFunction: executeHelp,
    showHelpFunction: showGeneralHelp,
  })

  return registry
}

// Export the configured registry
export const commandRegistry = createCommandRegistry()

/**
 * Get command definition by name
 */
export function getCommand(name: Command): CommandDefinition | undefined {
  return commandRegistry.getCommand(name)
}

/**
 * Get all registered commands
 */
export function getAllCommands(): CommandDefinition[] {
  return commandRegistry.getAllCommands()
}

/**
 * Generate help text for a specific command
 */
export function generateCommandHelp(command: CommandDefinition): void {
  console.log(`Usage: ${command.usage}`)
  console.log('')
  console.log(command.description)
  console.log('')

  if (command.options.length > 0) {
    console.log('Options:')
    command.options.forEach(option => {
      console.log(`  ${option.flag.padEnd(15)} ${option.description}`)
    })
    console.log('')
  }

  if (command.examples.length > 0) {
    console.log('Examples:')
    command.examples.forEach(example => {
      console.log(`  ${example}`)
    })
    console.log('')
  }
}

/**
 * Generate general help text showing all commands
 */
export function generateGeneralHelp(): void {
  console.log('WebBase CLI - Manage webbase copy-points')
  console.log('')
  console.log('Usage: webbase <command> [options]')
  console.log('')
  console.log('Commands:')

  getAllCommands().forEach(command => {
    console.log(`  ${command.name.padEnd(12)} ${command.description}`)
  })

  console.log('')
  console.log('Examples:')
  console.log('  webbase init')
  console.log('  webbase add accordion')
  console.log('  webbase list')
  console.log('  webbase info accordion')
  console.log('')
  console.log('For command-specific help:')
  console.log('  webbase <command> --help')
}
