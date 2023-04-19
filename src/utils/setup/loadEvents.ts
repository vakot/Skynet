import { ClientEvents } from 'discord.js'

import { Client } from '../../models/Client'

import logger from '../helpers/logger'

export async function loadEvents(client: Client) {
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
        .forEach((action) => action.init(...args).catch(logger.error))
    })

    // run all client.once event's
    client.once(event, (...args) => {
      actions
        .filter((action) => action.once && action.event === event)
        .forEach((action) => action.init(...args).catch(logger.error))
    })

    logger.log(`Listener <${event}> registered`)
  }
}