import { Client } from 'discord.js'

import getApplicationCommands from '../fetch/getApplicationCommands'
import isCommandsEqual from '../conditions/isCommandsEqual'
import logger from '../helpers/logger'
import store from '../helpers/store'

import { testServer } from '../../../config.json'

import { ICommand } from '../../models/command'

export default async function (client: Client) {
  try {
    const localCommands: ICommand[] = store.get('localCommands')

    const applicationCommands = await getApplicationCommands(client, testServer)

    // create | edit | delete application commands
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

      if (!isCommandsEqual(localCommand.data, existingCommand) || localCommand.forceUpdate) {
        await applicationCommands.edit(existingCommand.id, localCommand.data)
        logger.info(`Command ${localCommand.data.name} updated`)
        continue
      }
    }
  } catch (error) {
    logger.error(error)
  }
}
