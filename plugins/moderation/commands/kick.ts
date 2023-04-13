import {
  ChatInputCommandInteraction,
  Events,
  Client,
  SlashCommandBuilder,
} from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'
import { isInCooldown } from '../../../utils/cooldownHandler'

export default {
  data: {
    name: 'kick',
    command: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kick user from server (IN PROGRESS...)'),
    cooldown: 10000,
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
    return await interaction.reply({
      content: `Knock!`,
    })
  },
} as IAction
