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
    name: 'status',
    command: new SlashCommandBuilder()
      .setName('status')
      .setDescription('Short information about bot status'),
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
    const botLatency = Date.now() - interaction.createdTimestamp
    const apiLatency = interaction.client.ws.ping

    return await interaction.reply({
      content: `Bot latency \`${botLatency}ms\`\nAPI latency \`${apiLatency}ms\``,
    })
  },
} as IAction
