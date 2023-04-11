import { Events, ActivityType } from 'discord.js'
import { IEvent } from '../models/event'
import { logger } from '../utils/logger'

export default <IEvent>{
  name: Events.ClientReady,
  async execute(client) {
    logger.log('Status updating')

    await client.user.setActivity({
      name: 'Skyline',
      type: ActivityType.Watching,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    })

    logger.log(`Logged in as ${client.user!.tag}!`)

    logger.log('Status updated')
  },
}
