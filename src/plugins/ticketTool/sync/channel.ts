import { Events, GuildChannel } from 'discord.js'

import { Action } from '../../../modules/models/action'
import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

import { client } from '../../..'

export default new Action({
  data: { name: 'sync-ticket-channel' },

  event: Events.ChannelDelete,

  async init(channel: GuildChannel) {
    const ticket = ticketManager.tickets.find((t) => t.channelId === channel.id)

    if (!ticket) return

    return await this.execute(ticket)
  },

  async execute(ticket: Ticket) {
    const user = await client.users.fetch(ticket.authorId)

    await user
      .send({
        content:
          "Your ticket was accidentally deleted with it's channel" +
          '\n⤷ Message will be deleted in `20s`',
      })
      .then((message) => setTimeout(() => message.delete(), 20000))

    return await ticketManager.removeTicket(ticket)
  },
})
