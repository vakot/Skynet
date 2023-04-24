import { EmbedBuilder } from 'discord.js'
import { ITicket } from '../models/ticket-tool.i'

export function getEmbed(ticket: ITicket): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(ticket.title)
    .setDescription(
      `<@${ticket.authorId}>, please wait. Support will respond as soon as possible`
    )
    .setFields(
      {
        name: 'Opened',
        value: `<t:${Math.round(ticket.createdAt.getTime() * 0.001)}:R>`,
        inline: true,
      },
      {
        name: 'Reason',
        value: '` ' + ticket.reason + ' `',
        inline: true,
      },
      {
        name: 'Status',
        value: '` ' + (ticket.closed ? 'CLOSED' : 'ACTIVE') + ' `',
        inline: true,
      }
    )
}
