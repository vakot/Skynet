import { ButtonInteraction, Events, PermissionFlagsBits } from 'discord.js'

import { Action } from '../../../../models/action'

import { validateAction } from '../../../../utils/helpers/validateAction'

import { Ticket } from '../../models/ticket.i'
import { ticketManager } from '../../models/ticketManager.i'

export default new Action({
  data: { name: 'create-ticket-button' },

  event: Events.InteractionCreate,

  cooldown: 5_000,

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
    const { user, guild } = interaction

    if (!guild) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    const ticket = new Ticket({
      title: user.username + "'s Ticket",
      author: user,
      guild: guild,
    })

    const response = await ticketManager.create(ticket)

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
