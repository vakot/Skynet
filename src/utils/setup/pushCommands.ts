import { SlashCommandBuilder } from 'discord.js'

import logger from '../helpers/logger'
import { isCommandsEqual } from '../helpers/compareCommands'

import { Client } from '../../modules/models/client'

export async function pushCommands(
  client: Client,
  clear = false
): Promise<void> {
  const actions = client.localActions

  const commands = actions
    .filter((action) => action.data instanceof SlashCommandBuilder)
    .sort()

  // save for some reasons (like for /help command list)
  commands.forEach((command) =>
    client.localCommands.set(command.data.name, command)
  )

  const applicationCommands = await client.application?.commands.fetch()

  // delete all application commands
  // used in some development process cases
  if (clear) {
    return await applicationCommands?.forEach(
      async (command) =>
        await command
          .delete()
          .then((command) => logger.warn(`Command /${command.name} deleted`))
    )
  }

  commands.forEach(async (command) => {
    const { data, deleteble, forceUpdate } = command

    // collect existing command
    const existingCommand = await applicationCommands?.find(
      (cmd) => cmd.name === data.name
    )

    // create new command
    if (!existingCommand && !deleteble) {
      return await client.application?.commands
        .create(data as SlashCommandBuilder)
        .then(() => logger.info(`Command /${data.name} created`))
    }

    // delete existing
    if (existingCommand && deleteble) {
      return await existingCommand
        .delete()
        .then(() => logger.warn(`Command /${data.name} deleted`))
    }

    // update existing
    if (
      (existingCommand &&
        !isCommandsEqual(data as SlashCommandBuilder, existingCommand)) ||
      forceUpdate
    ) {
      return await client.application?.commands
        .edit(existingCommand!.id, data as SlashCommandBuilder)
        .then(() => logger.debug(`Command /${data.name} updated`))
    }
  })
}
