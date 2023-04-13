import { Events, Client } from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

export default {
  data: {
    name: 'error',
  },

  async init(client: Client) {
    client.on(Events.Error, (info) => {
      return this.execute(info).catch(logger.error)
    })
  },

  async execute(info: string) {
    return logger.error(info)
  },
} as IAction
