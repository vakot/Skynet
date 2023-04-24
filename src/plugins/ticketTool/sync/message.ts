import { Events, Message } from 'discord.js'

import { Action } from '../../../models/action'
import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

export default new Action({
  data: { name: 'sync-ticket-message' },

  event: Events.MessageDelete,

  async init(message: Message) {
    const ticket = ticketManager.tickets.find((t) => t.messageId === message.id)

    if (!ticket) return

    return await this.execute(message, ticket)
  },

  async execute(message: Message, ticket: Ticket) {
    const { channel, content, embeds, components } = message

    const newMessage = await channel.send({
      content: content,
      embeds: embeds,
      components: components,
    })

    ticket.setMessage(newMessage)
  },
})
