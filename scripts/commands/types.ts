/**
 * Type definitions for the webbase CLI
 */

export interface CopyPointInfo {
  name: string
  path: string
  hasStyles: boolean
  hasScripts: boolean
  hasTests: boolean
  dependencies: string[]
}

export interface InitOptions {
  targetPath: string
  overwrite?: boolean
  skipTests?: boolean
}

export interface AddOptions {
  copyPointName: string
  targetPath: string
  overwrite?: boolean
  skipTests?: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface FileOperation {
  source: string
  destination: string
  type: 'copy' | 'create' | 'update'
}

export interface CopyResult {
  success: boolean
  operations: FileOperation[]
  errors: string[]
  warnings: string[]
}

export type Command = 'init' | 'add' | 'list' | 'help'

export interface CLIOptions {
  command: Command
  args: string[]
  flags: Record<string, boolean | string>
}

export interface CommandDefinition {
  name: Command
  description: string
  usage: string
  examples: string[]
  options: Array<{
    flag: string
    description: string
  }>
  executeFunction: (options?: any) => Promise<boolean>
  showHelpFunction: () => void
}

export interface CommandRegistry {
  commands: Map<Command, CommandDefinition>
  getCommand(name: Command): CommandDefinition | undefined
  getAllCommands(): CommandDefinition[]
  registerCommand(definition: CommandDefinition): void
}
