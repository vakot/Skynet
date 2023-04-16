import { Client, Events } from 'discord.js'

import { nanoid } from 'nanoid'

import { updateApplicationCommands } from '../../utils/setup/updateApplicationCommands'
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

    return await updateApplicationCommands(client)
  },
} as Action
