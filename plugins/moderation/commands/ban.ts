import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'
import { isInCooldown } from '../../../utils/cooldownHandler'

export default {
  data: {
    name: 'ban',
    command: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Ban a user (IN PROGRESS...)'),
    cooldown: 10000,
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName == this.data.name &&
      !isInCooldown(interaction)
    )
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: `Bang!`,
    })
  },
} as IAction
