import { Events } from 'discord.js'

import { Action } from '../../models/action'

import logger from '../../utils/helpers/logger'

export default new Action({
  data: {
    name: 'client-error-event',
  },

  event: Events.Error,

  async execute(info: string) {
    return await logger.error(info)
  },
})
