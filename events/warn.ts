import { Events } from 'discord.js'
import { IEvent } from '../models/event'
import { logger } from '../utils/logger'

export default {
  name: Events.Warn,
  async execute(info) {
    return logger.warn(info)
  },
} as IEvent
