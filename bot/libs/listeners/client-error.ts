import { IEvent } from '@bot/models/event'
import { Events } from 'discord.js'

export default {
  type: Events.Error,
  once: true,
  async init(client, ...args) {
    client.logger.error(args)
  },
} as IEvent
