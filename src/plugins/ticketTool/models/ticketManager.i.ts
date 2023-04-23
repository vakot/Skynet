import {
  Snowflake,
  ChannelType,
  TextChannel,
  PermissionFlagsBits,
} from 'discord.js'

import { client } from '../../..'

import { Ticket } from './ticket.i'

import { categoryId, supportRoles } from '../config.json'

class TicketManager {
  tickets: Ticket[]

  ticketsCount = (): number => this.tickets.length

  removeTicket(ticket: Ticket): void {
    this.tickets = this.tickets.filter(
      (t) => t.authorId !== ticket.authorId && t.guildId !== ticket.guildId
    )
  }

  getTicketStatus(
    userId: Snowflake,
    guildId: Snowflake
  ): 'active' | 'closed' | 'deleted' {
    const ticket = this.getTicket(userId, guildId)

    if (!ticket) {
      return 'deleted'
    }

    return ticket.status
  }

  getTicket(
    userId: Snowflake,
    guildId: Snowflake,
    status?: 'active' | 'closed' | 'deleted'
  ): Ticket | null {
    const ticket = this.tickets.find(
      (t) => t.authorId === userId && t.guildId === guildId
    )

    if (!ticket) return null

    if (!status || ticket.status === status) return ticket

    return null
  }

  async create(ticket: Ticket): Promise<string> {
    const ticketToFind = this.getTicket(ticket.authorId, ticket.guildId)
    if (ticketToFind) {
      return 'Only one ticket can be created per user'
    }

    const guild = await client.guilds.fetch(ticket.guildId)

    const supportPermissions = supportRoles.map((supportRole) => ({
      id: supportRole,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.AttachFiles,
      ],
    }))

    const channel = await guild.channels.create({
      name: 'ticket-' + (this.ticketsCount() + 1).toString().padStart(4, '0'),
      parent: categoryId || null,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: client.user!.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: ticket.authorId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.AttachFiles,
          ],
        },
        ...supportPermissions,
      ],
      // make channel private (only author and staff)
    })

    const message = await channel?.send({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    ticket.setChannel(channel.id)
    ticket.setMessage(message.id)

    this.tickets.push(ticket)

    return `Ticket is opened here: <#${ticket.channelId}>`
  }

  async open(
    userId: Snowflake,
    guildId: Snowflake,
    channelId: Snowflake
  ): Promise<string> {
    const ticket = this.getTicket(userId, guildId)
    if (!ticket || ticket.status !== 'closed') {
      return 'You have no closed ticket to open'
    }
    if (ticket.channelId !== channelId) {
      return "Ticket status can be changed only from it's own channel"
    }

    const guild = await client.guilds.fetch(ticket.guildId)
    const channel = (await guild.channels.fetch(
      ticket.getChannel()
    )) as TextChannel
    const message = await channel.messages.fetch(ticket.getMessage())

    ticket.open()

    message.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    return `**${ticket.title}** status updated to \`${ticket.status}\``
  }

  async close(
    userId: Snowflake,
    guildId: Snowflake,
    channelId: Snowflake
  ): Promise<string> {
    const ticket = this.getTicket(userId, guildId)
    if (!ticket || ticket.status !== 'active') {
      return 'You have no active ticket to close'
    }
    if (ticket.channelId !== channelId) {
      return "Ticket status can be changed only from it's own channel"
    }

    const guild = await client.guilds.fetch(ticket.guildId)
    const channel = (await guild.channels.fetch(
      ticket.getChannel()
    )) as TextChannel
    const message = await channel.messages.fetch(ticket.getMessage())

    ticket.close()

    message.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    return `**${ticket.title}** status updated to \`${ticket.status}\``
  }

  async delete(
    userId: Snowflake,
    guildId: Snowflake,
    channelId: Snowflake
  ): Promise<string> {
    const ticket = this.getTicket(userId, guildId)
    if (!ticket || ticket.status !== 'closed') {
      return 'You have no closed ticket to delete'
    }
    if (ticket.channelId !== channelId) {
      return "Ticket status can be changed only from it's own channel"
    }

    const guild = await client.guilds.fetch(ticket.guildId)
    const channel = (await guild.channels.fetch(
      ticket.getChannel()
    )) as TextChannel
    const message = await channel.messages.fetch(ticket.getMessage())

    ticket.delete()

    message.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    return `**${ticket.title}** status updated to \`${ticket.status}\``
  }

  async restore(
    userId: Snowflake,
    guildId: Snowflake,
    channelId?: Snowflake | null
  ): Promise<string | void> {
    const ticket = this.getTicket(userId, guildId)
    if (!ticket || ticket.status !== 'deleted') {
      return 'You have no deleted ticket to restore'
    }
    if (ticket.channelId !== channelId) {
      return "Ticket status can be changed only from it's own channel"
    }

    const guild = await client.guilds.fetch(ticket.guildId)
    const channel = (await guild.channels.fetch(
      ticket.getChannel()
    )) as TextChannel
    const message = await channel.messages.fetch(ticket.getMessage())

    ticket.restore()

    message.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    return `**${ticket.title}** status updated to \`${ticket.status}\``
  }

  constructor(options: { tickets?: Ticket[] }) {
    this.tickets = options.tickets ?? []
  }
}

export const ticketManager = new TicketManager({})
