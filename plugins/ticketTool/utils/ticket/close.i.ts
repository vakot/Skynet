import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ThreadChannel,
} from 'discord.js'

import { TicketTool, ITicket } from '../../models/ticket-tool.i'

import { getEmbed } from '../getEmbed.i'

export async function closeTicket(interaction: ChatInputCommandInteraction | ButtonInteraction) {
  const { channel, guild, user } = interaction

  if (!guild || !channel) {
    return await interaction.reply({
      content: 'You can interact with ticket-tool only from guild channels',
      ephemeral: true,
    })
  }

  const ticket = await TicketTool.findOne<ITicket>({
    guildId: guild.id,
    authorId: user.id,
  })

  if (!ticket || ticket.closed) {
    return await interaction.reply({
      content: "Look's like you don't have any opened ticket's to close",
      ephemeral: true,
    })
  }

  if (channel.id !== ticket.threadId) {
    return await interaction.reply({
      content: "You can update ticket status only from it's own channel",
      ephemeral: true,
    })
  }

  ticket.closed = true
  ticket.save()

  const closeButton = new ButtonBuilder()
    .setCustomId('close-ticket-button')
    .setDisabled(true)
    .setLabel('Close')
    .setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)

  const ticketThread = channel as ThreadChannel
  const ticketMessage = await ticketThread.messages.fetch(ticket.messageId)
  if (ticketMessage) {
    await ticketMessage.edit({
      embeds: [getEmbed(ticket)],
      components: [row],
    })
  }

  await interaction.reply(`Ticket \`CLOSED\` by <@${user.id}>`)

  await ticketThread.members.remove(
    ticket.authorId,
    `Ticket is closed, leave other work to ${guild.name} Support Team`
  )

  const openButton = new ButtonBuilder()
    .setCustomId('open-ticket-button')
    .setLabel('Open')
    .setDisabled(!ticket.closed)
    .setStyle(ButtonStyle.Success)

  const deleteButton = new ButtonBuilder()
    .setCustomId('delete-ticket-button')
    .setLabel('Delete')
    .setDisabled(!ticket.closed)
    .setStyle(ButtonStyle.Danger)

  const supportEmbed = new EmbedBuilder().setDescription('```' + 'Support controls' + '```')
  const supportRow = new ActionRowBuilder<ButtonBuilder>().setComponents(openButton, deleteButton)

  return await channel.send({
    embeds: [supportEmbed],
    components: [supportRow],
  })
}
