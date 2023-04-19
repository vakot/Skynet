import { ClientEvents, Events } from 'discord.js'

import { Action } from '../../models/Action'

import logger from '../../utils/helpers/logger'

export default class ErrorEvent extends Action {
  data = { name: 'error-event' }

  event: keyof ClientEvents = Events.Error

  async init(info): Promise<any> {
    return await this.execute(info)
  }

  async execute(info): Promise<any> {
    return await logger.error(info)
  }
}
