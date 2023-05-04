import { Events, ThreadChannel } from 'discord.js'

import { Action } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'

import { ITicket, TicketTool } from '../models/ticket-tool.i'
import { ActionEvents } from '@modules/libs/events'

export default new Action({
  data: { name: 'sync-ticket-thread' },

  event: ActionEvents.ThreadDelete,

  async precondition(thread: ThreadChannel) {
    const ticket = await TicketTool.findOne<ITicket>({
      guildId: thread.guildId,
      threadId: thread.id,
    })

    return !!ticket
  },

  async execute(thread: ThreadChannel, client: SkynetClient) {
    const ticket = await TicketTool.findOne<ITicket>({
      guildId: thread.guildId,
      threadId: thread.id,
    })
    if (!ticket) return

    const user = await client.users.fetch(ticket.authorId)

    await TicketTool.deleteOne({
      guildId: ticket.guildId,
      threadId: ticket.threadId,
    })

    const message = ticket.closed
      ? 'Your ticket finally resolved. Now you can create a new one'
      : "Your ticket was accidentally deleted with it's thread"

    return await user.send(message + '\n⤷ You can delete this message with `/clear-dms`')
  },
})
