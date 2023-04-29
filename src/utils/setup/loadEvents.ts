import { connection } from 'mongoose'

import { SkynetClient } from '../../models/client'

import logger from '../helpers/logger'

export async function loadEvents(client: SkynetClient): Promise<void> {
  logger.debug('Events loading')

  client.clientActions.forEach((action) => {
    const { once, event } = action

    client[once ? 'once' : 'on'](event.name, (...args) =>
      event.init(...args, client, action).catch(logger.error)
    )
  })
  logger.log('Events <client> loaded')

  client.dataBaseActions.forEach((action) => {
    const { once, event } = action

    connection[once ? 'once' : 'on'](event, (...args) =>
      action.execute(...args, client).catch(logger.error)
    )
  })
  logger.log('Events <data-base> loaded')
}
