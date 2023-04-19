import { ClientEvents, Events } from 'discord.js'

import { Action } from '../../models/Action'
import { Client } from '../../models/Client'

import logger from '../../utils/helpers/logger'

export default class ReadyEvent extends Action {
  data = { name: 'ready-event' }

  event: keyof ClientEvents = Events.ClientReady

  async init(client: Client): Promise<any> {
    return await this.execute(client)
  }

  async execute(client: Client): Promise<any> {
    return await logger.info(`Logged in as ${client.user.tag}`)
  }
}
