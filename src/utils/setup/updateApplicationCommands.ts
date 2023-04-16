import { Client } from 'discord.js'

import { getApplicationCommands } from '../fetch/getApplicationCommands'
import { isCommandsEqual } from '../conditions/isCommandsEqual'
import store from '../helpers/store'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

import { testServer } from '../../../config.json'

export async function updateApplicationCommands(client: Client) {
  try {
    const localCommands: Action[] = store
      .get('actions')
      .filter((action) => action.data?.name)

    const applicationCommands = await getApplicationCommands(client, testServer)

    // create | edit | delete application commands
    for (const localCommand of localCommands) {
      const { data, forceUpdate, deleteble } = localCommand

      const existingCommand = await applicationCommands.cache.find(
        (command) => command.name === data.name
      )

      if (!existingCommand && !deleteble) {
        await applicationCommands.create(data)
        logger.info(`Command ${data.name} created`)
        continue
      }

      if (deleteble) {
        await applicationCommands.delete(existingCommand.id)
        logger.info(`Command ${data.name} deleted`)
        continue
      }

      if (!isCommandsEqual(data.toJSON(), existingCommand) || forceUpdate) {
        await applicationCommands.edit(existingCommand.id, data)
        logger.info(`Command ${data.name} updated`)
        continue
      }
    }
  } catch (error) {
    logger.error(error)
  }
}
