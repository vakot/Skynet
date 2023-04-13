import { Events, Client } from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

export default {
  data: {
    name: 'warn',
  },

  async init(client: Client) {
    client.on(Events.Warn, (info) => {
      return this.execute(info).catch(logger.error)
    })
  },

  async execute(info: string) {
    return logger.warn(info)
  },
} as IAction
