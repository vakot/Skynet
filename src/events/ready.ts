import { Client, Events } from 'discord.js'

import setupCommands from '../utils/setup/setupCommands'
import logger from '../utils/helpers/logger'

import { IEvent } from '../models/event'

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client: Client) {
    logger.info(`Logged in as ${client.user.tag}`)

    await setupCommands(client)
  },
} as IEvent
