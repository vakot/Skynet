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
import { Ticket } from '../models/ticket'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('delete-ticket')
    .setDescription('Delete an existing closed ticket'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const ticket = tickets.get(interaction.user.id)

    if (!ticket) {
      return await interaction.reply({
        content: 'You have no tickets created',
        ephemeral: true,
      })
    }

    if (interaction.channelId !== ticket?.channelId) {
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

    return await this.execute(interaction, ticket)
  },

  async execute(interaction: ChatInputCommandInteraction, ticket: Ticket) {
    const { user, channel } = interaction

    if (!channel) {
      return await interaction.reply({
        content: 'Failde to delete a ticket',
        ephemeral: true,
      })
    }

    ticket.delete()

    if (ticket.messageId) {
      const messages = await channel?.messages.fetch()

      const message = messages?.get(ticket.messageId)

      message?.edit({
        embeds: [ticket.getEmbed()],
      })
    } else {
      const message = await channel.send({
        embeds: [ticket.getEmbed()],
        components: [],
      })

      ticket.setMessage(message.id)
    }

    const button = new ButtonBuilder()
      .setCustomId('deny-ticket-delete')
      .setLabel('Decline')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    const response = await interaction.reply({
      content: `**${ticket.title}** status updated to \`${
        ticket.status
      }\`\nTicket will be deleted <t:${Math.round(Date.now() * 0.001) + 20}:R>`,
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

        ticket.restore()

        if (ticket.messageId) {
          const messages = await channel?.messages.fetch()

          const message = messages?.get(ticket.messageId)

          message?.edit({
            embeds: [ticket.getEmbed()],
          })
        } else {
          const message = await channel.send({
            embeds: [ticket.getEmbed()],
            components: [],
          })

          ticket.setMessage(message.id)
        }

        return await setTimeout(() => confirmation.deleteReply(), 10_000)
      }
    } catch (e) {
      tickets.delete(user.id)
      return await channel?.delete()
    }
  },
})
