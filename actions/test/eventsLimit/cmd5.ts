import { Events } from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'

export default {
  data: {
    name: 'cmd-5',
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (interaction.isChatInputCommand())
      return this.execute().catch(logger.error)
  },

  async execute() {
    return logger.log(`interaction runned (cmd-5)`)
  },
} as IAction
