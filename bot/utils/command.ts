import { ApplicationCommand, ApplicationCommandData, Guild } from 'discord.js'

import { SkynetClient } from '@bot/client'

export async function findCommand(
  client: SkynetClient,
  id: string | undefined,
  guildId?: Guild['id']
): Promise<ApplicationCommand | undefined> {
  const commands = guildId
    ? await client.guilds.cache.get(guildId)?.commands.fetch()
    : await client.application?.commands.fetch()

  return commands?.find((command) => command.id === id)
}

export async function createCommand(
  client: SkynetClient,
  command: ApplicationCommandData,
  guildId?: Guild['id']
): Promise<ApplicationCommand | undefined> {
  if (!command) return
  return client.application?.commands.create(command, guildId)
}

export async function updateCommand(
  client: SkynetClient,
  id: string | undefined,
  command: ApplicationCommandData
): Promise<ApplicationCommand | undefined> {
  if (!id || !command) return
  return client.application?.commands.edit(id, command)
}

export async function deleteCommand(
  client: SkynetClient,
  command: ApplicationCommand
): Promise<ApplicationCommand | undefined> {
  if (!command) return
  return command.delete()
}

export function isCommand(command: any): boolean {
  if (!command) return false
  if (!command.name || !(typeof command.name === 'string')) return false
  if (!command.description || !(typeof command.description === 'string')) return false
  return true
}

/**
 * @param {ApplicationCommand} command1
 * @param {ApplicationCommand} command2
 * @returns {boolean} `true` if commands equals | `false` if commands **NOT** equals
 */
export function isCommandsEqual(
  command1: ApplicationCommand,
  command2: ApplicationCommand
): boolean {
  return (
    isCommand(command1) &&
    isCommand(command2) &&
    command1.name === command2.name &&
    command1.description === command2.description
  )
}
