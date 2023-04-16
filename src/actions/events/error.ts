import { Events } from 'discord.js'

import { nanoid } from 'nanoid'

import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  event: Events.Error,

  async init(info) {
    return await this.execute(info)
  },

  async execute(info) {
    return await logger.warn(info)
  },
} as Action
