import { Events, Message } from 'discord.js'

import { Action } from '../../../models/action'

import { ITicket, TicketTool } from '../models/ticket-tool.i'

export default new Action({
  data: { name: 'sync-ticket-message' },

  event: Events.MessageDelete,

  async init(message: Message) {
    // Yeh, check db on every messageDelete is sucks, but IDK...
    const ticket = await TicketTool.findOne<ITicket>({
      guildId: message.guildId,
      messageId: message.id,
    })

    if (!ticket) return

    return await this.execute(message, ticket)
  },

  async execute(message: Message, ticket: ITicket) {
    const { channel, content, embeds, components } = message

    const newMessage = await channel.send({
      content: content,
      embeds: embeds,
      components: components,
    })

    ticket.messageId = newMessage.id
    return await ticket.save()
  },
})
