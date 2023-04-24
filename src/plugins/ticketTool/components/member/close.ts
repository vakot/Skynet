import { ButtonInteraction, Events, PermissionFlagsBits } from 'discord.js'

import { Action } from '../../../../modules/models/action'

import { validateAction } from '../../../../utils/helpers/validateAction'

import { ticketManager } from '../../models/ticketManager.i'

export default new Action({
  data: { name: 'close-ticket-button' },

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

    const { status, message } = await ticketManager.close(user.id, guild.id)

    return await interaction.reply({
      content: message + (status ? ` by <@${user.id}>` : ''),
      ephemeral: !status,
    })
  },
})
