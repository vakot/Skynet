import { Client, ClientEvents } from 'discord.js'

import store from '../helpers/store'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

export async function setupEvents(client: Client) {
  const actions: Action[] = store.get('actions')
  const events: Set<keyof ClientEvents> = new Set()

  // set all event's
  actions.forEach((action) => {
    events.add(action.event)
  })

  // run all client.on event's
  events.forEach(async (event) => {
    client.on(event, (...args) => {
      actions
        .filter((action) => !action.once && action.event === event)
        .map((action) => action.init(...args).catch(logger.error))
    })
  })

  // run all client.once event's
  events.forEach(async (event) => {
    client.once(event, (...args) => {
      actions
        .filter((action) => action.once && action.event === event)
        .map((action) => action.init(...args).catch(logger.error))
    })
  })
}
