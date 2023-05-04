import { connection } from 'mongoose'

import { SkynetClient } from '@modules/models/client'

import logger from '@utils/helpers/logger'

export async function loadEvents(client: SkynetClient): Promise<void> {
  const startTime = Date.now()

  logger.colored.magenta('Creating events listeners')

  client.clientActions.forEach((action) => {
    const { once, event } = action

    client[once ? 'once' : 'on'](event.name, (...args) =>
      event.init(...args, client, action).catch(logger.error)
    )
    logger.status.ok(`Event ${action.data.name} loaded`)
  })

  client.dataBaseActions.forEach((action) => {
    const { once, event } = action

    connection[once ? 'once' : 'on'](event, (...args) =>
      action.execute(...args, client).catch(logger.error)
    )
    logger.status.ok(`Event ${action.data.name} loaded`)
  })

  logger.colored.magenta(`Events listeners created in ${Date.now() - startTime}ms`)
}
