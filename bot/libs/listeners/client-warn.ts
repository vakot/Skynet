import { IEvent } from '@bot/models/event'
import { Events } from 'discord.js'

export default {
  type: Events.Warn,
  once: true,
  async init(client, ...args) {
    client.logger.warn(args)
  },
} as IEvent
