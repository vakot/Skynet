import { ActivityType, Client, Events } from 'discord.js'

import { nanoid } from 'nanoid'

import { updateApplicationCommands } from '../../utils/commands/update'
import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  event: Events.ClientReady,
  once: true,

  async init(client: Client) {
    return await this.execute(client)
  },

  async execute(client: Client) {
    await logger.info(`Logged in as ${client.user.tag}`)

    await (async () =>
      client.user.setActivity({
        name: 'Skyline',
        type: ActivityType.Watching,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }))()
      .then(() => logger.log('Status updated'))
      .catch(logger.error)

    // console.log(client.user.presence.)

    // await (async () =>
    //   client.user.setPresence({
    //     // name: 'Skyline',
    //     // type: ActivityType.Watching,
    //     // url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    //   }))()
    //   .then(() => logger.log('Status updated'))
    //   .catch(logger.error)

    return await updateApplicationCommands(client)
  },
} as Action
