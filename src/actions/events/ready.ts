import { ActivityType } from 'discord.js'

import { SkynetClient } from '../../modules/models/client'
import { Action } from '../../modules/models/action'
import { ActionEvents } from '../../modules/libs/events'

import logger from '../../utils/helpers/logger'

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
