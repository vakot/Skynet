import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { tickets } from '../create'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('open-ticket')
    .setDescription('Open an existing ticket'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    return await this.execute(interaction)
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const { user, channelId, channel } = interaction

    if (!tickets.has(user.id)) {
      return await interaction.reply({
        content: 'You have no closed tickets',
        ephemeral: true,
      })
    }

    const ticket = tickets.get(user.id)

    if (channelId !== ticket?.channelId) {
      return await interaction.reply({
        content: "Ticket can be opened only from it's own channel",
        ephemeral: true,
      })
    }

    ticket.open()

    const embed = new EmbedBuilder()
      .setTitle(ticket.title)
      .setDescription(
        `<@${ticket.authorId}>, please wait. Support will respond as soon as possible`
      )
      .setFields(
        {
          name: 'Opened',
          value: `<t:${Math.round(ticket.createdTimestamp * 0.001)}:R>`,
          inline: true,
        },
        {
          name: 'Reason',
          value: ticket.reason,
          inline: true,
        },
        {
          name: 'Status',
          value: ticket.status.toUpperCase(),
          inline: true,
        }
      )

    const message = (await channel?.messages.fetch())?.get(
      ticket.messageId || ''
    )

    if (message) {
      await message.edit({
        embeds: [embed],
      })
    } else {
      await channel?.send({
        embeds: [embed],
      })
    }

    return await interaction.reply(
      `**${ticket.title}** status updated to \`${ticket.status}\``
    )
  },
})
