import {
  ButtonInteraction,
  Events,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js'

import { Action } from '../../../models/action'
import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

import { validateAction } from '../../../utils/helpers/validateAction'

export default new Action({
  data: { name: 'add-new-ticket-button' },

  event: Events.InteractionCreate,

  cooldown: 120_000,

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
    const { user, guildId } = interaction

    if (!guildId) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    const ticket = new Ticket({
      title: user.username + "'s Ticket",
      authorId: user.id,
      guildId: guildId,
    })

    const response = await ticketManager.add(ticket)

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
