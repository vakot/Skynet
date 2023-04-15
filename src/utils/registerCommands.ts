import { Client } from 'discord.js'
import logger from './logger'
import getApplicationCommands from './getApplicationCommands'
import getLocalCommands from './getLocalCommands'
import { ICommand } from '../models/command'
import { testServer } from '../../config.json'
import isCommandsEqual from './isCommandsEqual'

export default async function (client: Client) {
  try {
    const localCommands: ICommand[] = await getLocalCommands()
    const applicationCommands = await getApplicationCommands(client, testServer)

    for (const localCommand of localCommands) {
      const existingCommand = await applicationCommands.cache.find(
        (command) => command.name === localCommand.data.name
      )

      if (!existingCommand && !localCommand.delete) {
        await applicationCommands.create(localCommand.data)
        logger.info(`Command ${localCommand.data.name} created`)
        continue
      }

      if (localCommand.delete) {
        await applicationCommands.delete(existingCommand.id)
        logger.info(`Command ${localCommand.data.name} deleted`)
        continue
      }

      if (
        !isCommandsEqual(localCommand.data, existingCommand) ||
        localCommand.forceUpdate
      ) {
        await applicationCommands.edit(existingCommand.id, localCommand.data)
        logger.info(`Command ${localCommand.data.name} updated`)
        continue
      }
    }
  } catch (error) {
    logger.error(error)
  }
}
