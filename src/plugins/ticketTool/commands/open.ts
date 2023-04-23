import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { ticketManager } from '../models/ticketManager.i'
import { validateAction } from '../../../utils/helpers/validateAction'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('open-ticket')
    .setDescription('Open an existing ticket'),

  event: Events.InteractionCreate,

  cooldown: 6_000,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await this.execute(interaction)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guildId, channelId } = interaction

    if (!guildId) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    const response = await ticketManager.open(user.id, guildId, channelId)

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
