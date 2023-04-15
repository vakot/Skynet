import { Client, Events } from 'discord.js'

import updateApplicationCommands from '../../utils/setup/updateApplicationCommands'
import logger from '../../utils/helpers/logger'

import { IAction } from '../../models/action'

export default {
  event: Events.ClientReady,
  once: true,

  async init(client: Client) {
    return await this.execute(client)
  },

  async execute(client: Client) {
    await logger.info(`Logged in as ${client.user.tag}`)

    return await updateApplicationCommands(client)
  },
} as IAction
