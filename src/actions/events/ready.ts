import { ActivityType, Events } from 'discord.js'

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
    client.user?.setActivity({
      name: 'Sky',
      type: ActivityType.Watching,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    })
    return await logger.debug(`Logged in as ${client.user!.tag}`)
  },
})
