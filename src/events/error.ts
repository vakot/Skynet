import { Events } from 'discord.js'

import logger from '../utils/helpers/logger'

import { IEvent } from '../models/event'

export default {
  name: Events.Error,

  execute(info) {
    logger.error(info)
  },
} as IEvent
