import { Events, ActivityType } from 'discord.js'
import { IEvent } from '../models/event'
import { logger } from '../utils/logger'

export default <IEvent>{
  name: Events.ClientReady,
  async execute(client) {
    await (async () =>
      client.user.setActivity({
        name: 'Skyline',
        type: ActivityType.Watching,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }))()
      .then(() => logger.log('Status updated'))
      .catch(logger.error)

    await client.user
      .setAvatar('./assets/avatar.png')
      .then(() => logger.log('Avatar updated'))
      .catch(logger.error)

    logger.log(`Logged in as ${client.user!.tag}!`)
  },
}
