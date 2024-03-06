import { ApplicationCommand, ApplicationCommandData } from 'discord.js'

import { SkynetClient } from '@modules/models/client'

// export async function dropCommands(client: SkynetClient): Promise<void> {
//   const commands = await client.application?.commands.fetch()

//   commands?.forEach((command) => {
//     return deleteCommand(client, command).then((command) =>
//       logger.debug(`Command /${command?.name} deleted`)
//     )
//   })
// }

// export async function pushCommands(client: SkynetClient): Promise<void> {
//   // const clientCommands = await client.application?.commands.fetch()
//   // const localsCommandsCound = SkynetCommands.length
//   // const clientCommadnsCount = clientCommands?.size

//   // const commands = clientCommadnsCount > localsCommandsCound ? [...clientCommands?.values()] : [...SkynetCommands]

//   SkynetCommands.forEach(async (command) => {
//     if (!isCommand(command)) return

//     const applicationCommand = await findCommand(client, command?.name)

//     if (!applicationCommand) {
//       return createCommand(client, command.toJSON() as ApplicationCommandData).then((command) =>
//         logger.debug(`Command /${command?.name} created`)
//       )
//     }

//     if (
//       applicationCommand &&
//       !isCommandsEqual(applicationCommand, command.toJSON() as ApplicationCommand)
//     ) {
//       return updateCommand(
//         client,
//         applicationCommand.id,
//         command.toJSON() as ApplicationCommandData
//       ).then((command) => logger.debug(`Command /${command?.name} updated`))
//     }
//   })
// }

export async function findCommand(
  client: SkynetClient,
  name: string | undefined
): Promise<ApplicationCommand | undefined> {
  return (await client.application?.commands.fetch())?.find((command) => command.name === name)
}

export async function createCommand(
  client: SkynetClient,
  command: ApplicationCommandData
): Promise<ApplicationCommand | undefined> {
  if (!command) return
  return client.application?.commands.create(command)
}

export async function updateCommand(
  client: SkynetClient,
  id: string | undefined,
  command: ApplicationCommandData
): Promise<ApplicationCommand | undefined> {
  if (!id) return
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

// export async function clearAllCommands(client: SkynetClient): Promise<void> {
//   const commands = await client.application?.commands.fetch()
//   return commands?.forEach((command) =>
//     command.delete().then((command) => logger.debug(`Command /${command?.name} deleted`))
//   )
// }
