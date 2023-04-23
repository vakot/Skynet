import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Snowflake,
  TextChannel,
} from 'discord.js'

import { ticketManager } from '../models/ticketManager.i'

import { client } from '../../..'

export async function handleTicketDelete(
  userId: Snowflake,
  guildId: Snowflake
) {
  const ticket = ticketManager.getTicket(userId, guildId)

  if (!ticket) return 'Ticket is already deleted'

  const guild = await client.guilds.fetch(ticket.guildId)
  const channel = (await guild.channels.fetch(
    ticket.getChannel()
  )) as TextChannel

  const button = new ButtonBuilder()
    .setCustomId('deny-ticket-delete')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

  const response = await channel.send({
    content: `Ticket will be deleted <t:${
      Math.round(Date.now() * 0.001) + 20
    }:R>`,
    components: [row],
  })

  try {
    const confirmation = await response?.awaitMessageComponent({
      time: 20_000,
    })

    if (confirmation?.customId === 'deny-ticket-delete') {
      await confirmation?.update({
        content: 'Action cancelled\n⤷ Message will be deleted in `10s`',
        components: [],
      })

      await ticketManager.restore(
        ticket.authorId,
        ticket.guildId,
        ticket.channelId
      )

      return await setTimeout(() => confirmation?.deleteReply(), 10_000)
    }
  } catch {
    ticketManager.removeTicket(ticket)

    return await channel?.delete()
  }
}
