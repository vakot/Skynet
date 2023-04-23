import { ButtonInteraction, Events, PermissionFlagsBits } from 'discord.js'

import { Action } from '../../../models/action'
import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

import { validateAction } from '../../../utils/helpers/validateAction'
import { handleTicketDelete } from '../utils/handleDelete.i'

export default new Action({
  data: { name: 'delete-ticket-button' },

  event: Events.InteractionCreate,

  cooldown: 6_000,

  permissions: [PermissionFlagsBits.UseApplicationCommands],

  async init(interaction: ButtonInteraction) {
    if (this.data.name !== interaction.customId) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user,
      interaction.channel
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await this.execute(interaction)
  },

  async execute(interaction: ButtonInteraction) {
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
