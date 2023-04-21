import { Events } from 'discord.js'

import { Action } from '../../models/action'

import logger from '../../utils/helpers/logger'

export default new Action({
  data: {
    name: 'client-warn-event',
  },

  event: Events.Warn,

  async execute(info: string) {
    return await logger.warn(info)
  },
})
