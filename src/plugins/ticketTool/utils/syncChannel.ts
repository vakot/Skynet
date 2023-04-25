import { Events, ThreadChannel } from 'discord.js'

import { Action } from '../../../models/action'
import { Client } from '../../../models/client'

import { ITicket, TicketTool } from '../models/ticket-tool.i'

export default new Action({
  data: { name: 'sync-ticket-thread' },

  event: Events.ThreadDelete,

  async init(thread: ThreadChannel, client: Client) {
    const ticket = await TicketTool.findOne<ITicket>({
      guildId: thread.guildId,
      threadId: thread.id,
    })

    if (!ticket) return

    return await this.execute(ticket, client)
  },

  async execute(ticket: ITicket, client: Client) {
    const user = await client.users.fetch(ticket.authorId)

    await TicketTool.deleteOne({
      guildId: ticket.guildId,
      threadId: ticket.threadId,
    })

    const message = ticket.closed
      ? 'Your ticket finally resolved. Now you can create a new one'
      : "Your ticket was accidentally deleted with it's thread"

    return await user.send(
      message + '\n⤷ You can delete this message with `/clear-dms`'
    )
  },
})
