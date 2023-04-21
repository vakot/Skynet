import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { tickets } from '../create'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('delete-ticket')
    .setDescription('Delete an existing closed ticket'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    return await this.execute(interaction)
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const { user, channelId, channel } = interaction

    const ticket = tickets.get(user.id)

    if (channelId !== ticket?.channelId) {
      return await interaction.reply({
        content: "Ticket can be deleted only from it's own channel",
        ephemeral: true,
      })
    }

    if (ticket.status !== 'closed') {
      return await interaction.reply({
        content: 'Only closed ticket can be deleted',
        ephemeral: true,
      })
    }

    const button = new ButtonBuilder()
      .setCustomId('deny-ticket-delete')
      .setLabel('Decline')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    const response = await interaction.reply({
      content: `Ticket will be deleted <t:${
        Math.round(Date.now() * 0.001) + 20
      }:R>`,
      components: [row],
      fetchReply: true,
    })

    try {
      const confirmation = await response.awaitMessageComponent({
        time: 20_000,
      })

      if (confirmation.customId === 'deny-ticket-delete') {
        await confirmation.update({
          content: 'Action cancelled\n⤷ Message will be deleted in `10s`',
          components: [],
        })
        return await setTimeout(() => confirmation.deleteReply(), 10_000)
      }
    } catch (e) {
      tickets.delete(user.id)
      return await channel?.delete()
    }
  },
})
