import { ClientEvents, Events } from 'discord.js'

import { Action } from '../../models/Action'

import logger from '../../utils/helpers/logger'

export default class WarnEvent extends Action {
  data = { name: 'warn-event' }

  event: keyof ClientEvents = Events.Warn

  async init(info): Promise<any> {
    return await this.execute(info)
  }

  async execute(info): Promise<any> {
    return await logger.warn(info)
  }
}
