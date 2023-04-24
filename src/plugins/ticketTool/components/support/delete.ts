import {
  ButtonInteraction,
  Events,
  GuildMemberRoleManager,
  PermissionFlagsBits,
} from 'discord.js'

import { Action } from '../../../../modules/models/action'

import { validateAction } from '../../../../utils/helpers/validateAction'

import { ticketManager } from '../../models/ticketManager.i'

import { isSupport } from '../../utils/isSupport.i'

export default new Action({
  data: { name: 'delete-ticket-button' },

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
    const { member, user, guild } = interaction

    if (!guild) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    if (!isSupport(member?.roles as GuildMemberRoleManager)) {
      return await interaction.reply({
        content: 'This action availible only for support team',
        ephemeral: true,
      })
    }

    const response = await ticketManager.delete(user.id, guild.id)

    if (!response) return

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
