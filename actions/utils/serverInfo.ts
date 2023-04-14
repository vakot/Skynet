import {
  ChatInputCommandInteraction,
  Events,
  Client,
  SlashCommandBuilder,
} from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'
import { isInCooldown } from '../../utils/cooldownHandler'

export default {
  data: {
    name: 'server-info',
    command: new SlashCommandBuilder()
      .setName('server-info')
      .setDescription('Short information about server'),
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
      content: `server_info_message_template`,
    })
  },
} as IAction
