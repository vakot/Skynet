import { Events } from 'discord.js'

import logger from '../utils/helpers/logger'

import { IEvent } from '../models/event'

export default {
  name: Events.Warn,

  execute(info) {
    logger.warn(info)
  },
} as IEvent
