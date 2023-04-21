import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { tickets } from '../create'
import { Ticket } from '../models/ticket'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('open-ticket')
    .setDescription('Open an existing ticket'),

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
        content: "Ticket can be opened only from it's own channel",
        ephemeral: true,
      })
    }

    if (ticket.status === 'deleted') {
      return await interaction.reply({
        content: "You can't interact with ticket that will be deleted",
        ephemeral: true,
      })
    }

    return await this.execute(interaction, ticket)
  },

  async execute(interaction: ChatInputCommandInteraction, ticket: Ticket) {
    const { channel } = interaction

    if (!channel) {
      return await interaction.reply({
        content: 'Failde to re-open a ticket',
        ephemeral: true,
      })
    }

    ticket.open()

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

    return await interaction.reply(
      `**${ticket.title}** status updated to \`${ticket.status}\``
    )
  },
})
