import { ActivityType, Events, Client } from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

export default {
  data: {
    name: 'ready',
  },

  listener: {
    event: Events.ClientReady,
    once: true,
  },

  async init(client: Client) {
    return this.execute(client).catch(logger.error)
  },

  async execute(client: Client) {
    await (async () =>
      client.user.setActivity({
        name: 'Skyline',
        type: ActivityType.Watching,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }))()
      .then(() => logger.log('Status updated'))
      .catch(logger.error)
    // await client.user
    //   .setAvatar('./assets/avatar.png')
    //   .then(() => logger.log('Avatar updated'))
    //   .catch(logger.error)

    return logger.log(`Logged in as ${client.user!.tag}!`)
  },
} as IAction
