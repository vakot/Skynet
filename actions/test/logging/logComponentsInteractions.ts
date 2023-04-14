import { Events, ButtonInteraction, AnySelectMenuInteraction } from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'

export default {
  data: {
    name: 'log-components',
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (interaction.isAnySelectMenu() || interaction.isButton())
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    const { customId, user } = interaction

    return logger.log(`${customId} by ${user.tag}`)
  },
} as IAction
