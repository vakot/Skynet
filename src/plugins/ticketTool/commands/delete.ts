import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { ticketManager } from '../models/ticketManager.i'

import { handleTicketDelete } from '../utils/handleDelete.i'
import { validateAction } from '../../../utils/helpers/validateAction'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('delete-ticket')
    .setDescription('Delete an existing closed ticket'),

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

    const response = await ticketManager.delete(user.id, guildId, channelId)

    await interaction.reply({
      content: response,
      ephemeral: true,
    })

    if (ticketManager.getTicketStatus(user.id, guildId) === 'deleted') {
      return await handleTicketDelete(user.id, guildId)
    }
  },
})
