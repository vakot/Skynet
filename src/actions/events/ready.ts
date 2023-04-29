import { ActivityType } from 'discord.js'

import { SkynetClient } from '../../models/client'
import { Action } from '../../models/action'

import logger from '../../utils/helpers/logger'
import { ActionEvents } from '../../models/event'

export default new Action({
  data: { name: 'client-ready-event' },

  event: ActionEvents.ClientReady,

  async execute(client: SkynetClient) {
    await client.user?.setActivity({
      name: 'Sky',
      type: ActivityType.Watching,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    })
    return await logger.debug(`Logged in as ${client.user!.tag}`)
  },
})
