import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  Snowflake,
} from 'discord.js'

import { Ticket } from './ticket.i'

import { categoryId, supportRoles } from '../config.json'

class TicketManager {
  tickets: Ticket[] = []
  count: number = 0

  removeTicket(ticket: Ticket) {
    this.tickets = this.tickets.filter(
      (t) =>
        t.authorId !== ticket.authorId &&
        t.channelId !== ticket.channelId &&
        t.guildId !== ticket.guildId
    )
  }
  getTicket(
    authorId: Snowflake,
    guildId: Snowflake,
    status?: 'active' | 'closed'
  ): Ticket | null {
    const ticket = this.tickets.find(
      (t) => t.authorId === authorId && t.guildId === guildId
    )

    if (!ticket) return null

    if (!status || ticket.status === status) return ticket

    return null
  }

  async create(ticket: Ticket): Promise<string> {
    if (this.getTicket(ticket.authorId, ticket.guildId)) {
      return 'Only one ticket can be created per user'
    }

    if (!ticket.guild) return 'Failed to create a ticket'

    const authorPermissions = {
      id: ticket.authorId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.UseApplicationCommands,
      ],
    }
    const everyonePermissions = {
      id: ticket.guild.roles.everyone,
      deny: [PermissionFlagsBits.ViewChannel],
    }
    const supportPermissions = supportRoles.map((supportRole) => ({
      id: supportRole,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.UseApplicationCommands,
      ],
    }))

    ticket.channel = await ticket.guild.channels.create({
      name: 'ticket-' + (this.count + 1).toString().padStart(4, '0'),
      parent: categoryId || null,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        authorPermissions,
        everyonePermissions,
        ...supportPermissions,
      ],
    })

    if (!ticket.channel) return 'Failed to create a ticket channel'

    const message = await ticket.channel?.send({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    if (!message) return 'Failed to create a ticket message'

    ticket.setMessage(message)

    this.tickets.push(ticket)

    this.count++

    return `Ticket is opened here: <#${ticket.channel.id}>`
  }

  async open(
    authorId: Snowflake,
    guildId: Snowflake
  ): Promise<{ status: boolean; message: string }> {
    const ticket = this.getTicket(authorId, guildId, 'closed')

    if (!ticket) {
      return {
        status: false,
        message: 'You have no closed ticket to open',
      }
    }

    ticket.status = 'active'

    // because of sync i'm sure that the message is exists
    ticket.message!.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    // because of sync i'm sure that the channel is exists
    ticket.channel!.permissionOverwrites.set([
      {
        id: ticket.authorId,
        allow: [
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.UseApplicationCommands,
        ],
      },
    ])

    return {
      status: true,
      message: 'Ticket `opened`',
    }
  }

  async close(
    authorId: Snowflake,
    guildId: Snowflake
  ): Promise<{ status: boolean; message: string }> {
    const ticket = this.getTicket(authorId, guildId, 'active')

    if (!ticket) {
      return {
        status: false,
        message: 'You have no opened ticket to close',
      }
    }

    ticket.status = 'closed'

    // because of sync i'm sure that the message is exists
    ticket.message!.edit({
      embeds: [ticket.getEmbed()],
      components: [ticket.getActionRow()],
    })

    // because of sync i'm sure that the channel is exists
    ticket.channel!.permissionOverwrites.set([
      {
        id: ticket.authorId,
        deny: [
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.UseApplicationCommands,
        ],
      },
    ])

    const embed = new EmbedBuilder().setDescription(
      '```' + 'Support team controls section' + '```'
    )

    const openButton = new ButtonBuilder()
      .setCustomId('open-ticket-button')
      .setLabel('Open')
      .setEmoji('🔓')
      .setStyle(ButtonStyle.Success)

    const deleteButton = new ButtonBuilder()
      .setCustomId('delete-ticket-button')
      .setLabel('Delete')
      .setEmoji('🗑')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      openButton,
      deleteButton
    )

    ticket.channel?.send({
      embeds: [embed],
      components: [row],
    })

    return {
      status: true,
      message: 'Ticket `closed`',
    }
  }

  async delete(
    authorId: Snowflake,
    guildId: Snowflake
  ): Promise<string | void> {
    const ticket = this.getTicket(authorId, guildId, 'closed')

    if (!ticket) return 'Ticket must be closed to delete!'

    this.removeTicket(ticket)

    ticket.channel!.delete()
  }
}

export const ticketManager = new TicketManager()
