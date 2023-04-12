import { Events, ErrorEvent } from 'discord.js'
import { IEvent } from '../models/event'
import { logger } from '../utils/logger'

export default {
  name: Events.Error,
  async execute(error: ErrorEvent) {
    return logger.error(error.message)
  },
} as IEvent
