import { ButtonInteraction, Events, PermissionFlagsBits } from 'discord.js'

import { Action } from '../../../models/action'

import { ticketManager } from '../models/ticketManager.i'

import { validateAction } from '../../../utils/helpers/validateAction'

export default new Action({
  data: { name: 'close-ticket-button' },

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

    const response = await ticketManager.close(user.id, guildId, channelId)

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
