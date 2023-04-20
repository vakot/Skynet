import { Events } from 'discord.js'

import { Client } from '../../models/Client'
import { Action } from '../../models/Action'

import logger from '../../utils/helpers/logger'

export default new Action({
  data: {
    name: 'client-ready-event',
  },

  event: Events.ClientReady,

  async init(client: Client) {
    return await this.execute(client)
  },
  async execute(client: Client) {
    return await logger.debug(`Logged in as ${client.user!.tag}`)
  },
})
