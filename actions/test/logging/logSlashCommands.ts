import { ChatInputCommandInteraction, Events } from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'

export default {
  data: {
    name: 'log-slash-commands',
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (interaction.isChatInputCommand())
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const { commandName, user } = interaction

    return logger.log(`/${commandName} by ${user.tag}`)
  },
} as IAction
