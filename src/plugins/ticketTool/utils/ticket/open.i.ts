import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  GuildMember,
  ThreadChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js'

import { TicketTool, ITicket } from '../../models/ticket-tool.i'

import { getEmbed } from '../getEmbed.i'
import { isSupport } from '../isSupport.i'

export async function openTicket(
  interaction: ChatInputCommandInteraction | ButtonInteraction
) {
  const { channel, guild, user, member } = interaction

  if (!guild || !channel) {
    return await interaction.reply({
      content: 'You can interact with ticket-tool only from guild channels',
      ephemeral: true,
    })
  }

  if (member && !isSupport(member as GuildMember)) {
    return await interaction.reply({
      content: 'This action is only for support team',
      ephemeral: true,
    })
  }

  const ticket = await TicketTool.findOne<ITicket>({
    guildId: guild.id,
    threadId: channel.id,
  })

  if (!ticket || !ticket.closed) {
    return await interaction.reply({
      content: "Look's like there is no closed ticket's to open",
      ephemeral: true,
    })
  }

  ticket.closed = false
  ticket.save()

  const ticketThread = channel as ThreadChannel
  await ticketThread.members.add(
    ticket.authorId,
    `Ticket is re-opened, look's like ${guild.name} Support Team still need you to resolve a problem`
  )

  const closeButton = new ButtonBuilder()
    .setCustomId('close-ticket-button')
    .setDisabled(false)
    .setLabel('Close')
    .setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)

  const ticketMessage = await ticketThread.messages.fetch(ticket.messageId)
  if (ticketMessage) {
    await ticketMessage.edit({
      embeds: [getEmbed(ticket)],
      components: [row],
    })
  }

  return await interaction.reply(`Ticket \`OPENED\` by <@${user.id}>`)
}
