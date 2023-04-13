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
    name: 'ping',
    command: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    cooldown: 3000,
  },

  async init(client: Client) {
    client.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) return
      if (interaction.commandName != this.data.name) return

      if (isInCooldown(interaction)) return

      return this.execute(interaction).catch(logger.error)
    })
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const latency = Date.now() - interaction.createdTimestamp
    return await interaction.reply({
      content: `Pong! In latency of ${latency}ms`,
    })
  },
} as IAction
