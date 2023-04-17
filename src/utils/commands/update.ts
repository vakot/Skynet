import {
  ApplicationCommand,
  Client,
  Collection,
  APIApplicationCommand,
  ApplicationCommandDataResolvable,
} from 'discord.js'

import { isCommandsEqual } from './isEqual'
import store from '../helpers/store'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

export async function updateApplicationCommands(client: Client) {
  const commandActions: Action[] = store
    .get('actions')
    .filter((action: Action) => action.data?.name)

  const applicationCommands: Collection<string, ApplicationCommand> =
    await client.application.commands.fetch()

  // await applicationCommands.forEach((command) => command.delete())

  // create | edit | delete application commands
  for (const commandAction of commandActions) {
    const { data, deleteble, forceUpdate } = commandAction

    const existingCommand: ApplicationCommand = await applicationCommands.find(
      (cmd) => cmd.name === data.name
    )

    const localCommand: ApplicationCommandDataResolvable = data.toJSON()

    if (!existingCommand && !deleteble) {
      await client.application.commands.create(
        localCommand as ApplicationCommandDataResolvable
      )
      logger.info(`Command /${data.name} created`)
      continue
    }

    if (existingCommand && deleteble) {
      await existingCommand.delete
      logger.info(`Command /${data.name} deleted`)
      continue
    }

    if (
      (existingCommand &&
        !isCommandsEqual(
          localCommand as APIApplicationCommand,
          existingCommand
        )) ||
      forceUpdate
    ) {
      await client.application.commands.edit(
        existingCommand.id,
        localCommand as ApplicationCommandDataResolvable
      )
      logger.info(`Command ${data.name} updated`)
      continue
    }
  }
}
