import { ButtonInteraction, Events } from 'discord.js'

import { Action } from '../../../models/action'

import { validateAction } from '../../../utils/helpers/validateAction'
import { createTicket } from '../utils/ticket/create.i'

export default new Action({
  data: { name: 'create-ticket-button' },

  event: Events.InteractionCreate,

  cooldown: 6_000,

  async init(interaction: ButtonInteraction) {
    if (this.data.name !== interaction.customId) return

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

  async execute(interaction: ButtonInteraction) {
    return await createTicket(interaction)
  },
})
