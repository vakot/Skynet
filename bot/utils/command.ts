import { ApplicationCommandData } from 'discord.js'

export function isCommand(command: any): boolean {
  if (!command) return false
  if (!command.name || !(typeof command.name === 'string')) return false
  if (!command.description || !(typeof command.description === 'string')) return false
  return true
}

/**
 * @param {ApplicationCommandData} command1
 * @param {ApplicationCommandData} command2
 * @returns {boolean} `true` if commands equals | `false` if commands **NOT** equals
 */
export function isCommandsEqual(
  command1: ApplicationCommandData,
  command2: ApplicationCommandData
): boolean {
  return false
  // if (UserApplicationCommandData)
  //   return (
  //     isCommand(command1) &&
  //     isCommand(command2) &&
  //     command1.name === command2.name &&
  //     command1.description === command2.description
  //   )
}
