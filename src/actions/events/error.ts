import { Events } from 'discord.js'

import { Action } from '../../models/Action'

import logger from '../../utils/helpers/logger'

export default new Action({
  data: {
    name: 'client-error-event',
  },

  event: Events.Error,

  async init(info: string) {
    return await this.execute(info)
  },
  async execute(info: string) {
    return await logger.error(info)
  },
})
