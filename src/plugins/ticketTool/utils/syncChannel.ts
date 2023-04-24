import { Events, GuildChannel } from 'discord.js'

import { Action } from '../../../models/action'
import { Client } from '../../../models/client'

import { ITicket, TicketTool } from '../models/ticket-tool.i'

export default new Action({
  data: { name: 'sync-ticket-channel' },

  event: Events.ChannelDelete,

  async init(channel: GuildChannel, client: Client) {
    const ticket = await TicketTool.findOne<ITicket>({
      guildId: channel.guildId,
      channelId: channel.id,
    })

    if (!ticket) return

    return await this.execute(ticket, client)
  },

  async execute(ticket: ITicket, client: Client) {
    const user = await client.users.fetch(ticket.authorId)

    await TicketTool.deleteOne({
      guildId: ticket.guildId,
      channelId: ticket.channelId,
    })

    return await user.send(
      "Your ticket was accidentally deleted with it's channel" +
        '\nYou can delete this message with `/clear-dms`'
    )
  },
})
