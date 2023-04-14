import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'
import { isInCooldown } from '../../utils/cooldownHandler'

export default {
  data: {
    name: 'ping',
    command: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    cooldown: 3000,
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
      content: `:ping_pong: Pong!`,
    })
  },
} as IAction
