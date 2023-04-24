import { ClientEvents } from 'discord.js'
import { connection } from 'mongoose'

import { Client } from '../../models/client'

import logger from '../helpers/logger'

export async function loadEvents(client: Client): Promise<void> {
  const actions = client.localActions
  const events = new Set<keyof ClientEvents>()

  // get all event's
  actions.forEach((action) => {
    events.add(action.event)
  })

  for (const event of events) {
    // run all client.on event's
    client.on(event, (...args) => {
      actions
        .filter((action) => !action.once && action.event === event)
        .forEach((action) => action.init(...args, client).catch(logger.error))
    })

    // run all client.once event's
    client.once(event, (...args) => {
      actions
        .filter((action) => action.once && action.event === event)
        .forEach((action) => action.init(...args, client).catch(logger.error))
    })

    logger.log(`Event <${event}> created`)
  }

  const dbactions = client.dataBaseActions
  const dbevents = new Set<
    'error' | 'connected' | 'disconnected' | 'connecting'
  >()

  // get all dbevent's
  dbactions.forEach((action) => {
    dbevents.add(action.event)
  })

  for (const dbevent of dbevents) {
    // run all client.on event's
    connection.on(dbevent, (...args) => {
      dbactions
        .filter((action) => !action.once && action.event === dbevent)
        .forEach((action) =>
          action.execute(...args, client).catch(logger.error)
        )
    })

    // run all client.once event's
    connection.once(dbevent, (...args) => {
      dbactions
        .filter((action) => action.once && action.event === dbevent)
        .forEach((action) =>
          action.execute(...args, client).catch(logger.error)
        )
    })

    logger.log(`DB Event <${dbevent}> created`)
  }
}
