import {
  ChannelType,
  ChatInputCommandInteraction,
  Events,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { validateAction } from '../../../utils/helpers/validateAction'
import { isSupport } from '../utils/isSupport.i'
import { getEmbed } from '../utils/getEmbed.i'

import { ITicket, TicketTool } from '../models/ticket-tool.i'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket-Tool commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('create')
        .setDescription('Create a new ticket')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('Title of your ticket')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Why you create a ticket?')
            .setRequired(false)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('open')
        .setDescription('Open an existing closed ticket')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('close')
        .setDescription('Close an existing opened ticket')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('delete')
        .setDescription('Delete an existing closed ticket')
    ),

  event: Events.InteractionCreate,

  cooldown: 10_000,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await this.execute(interaction)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guild, channel, options, member } = interaction

    if (!guild || !channel) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    if (options.getSubcommand() === 'create') {
      const ticket = await TicketTool.findOne<ITicket>({
        guildId: guild.id,
        authorId: user.id,
      })

      if (ticket) {
        return await interaction.reply({
          content: 'Only one ticket can be created per user',
          ephemeral: true,
        })
      }

      const ticketChannel = await guild.channels.create({
        type: ChannelType.GuildText,
        name: user.username + '-' + user.discriminator,
      })

      if (!ticketChannel) {
        return await interaction.reply({
          content: 'Failed to create a ticket',
          ephemeral: true,
        })
      }

      const newTicket = new TicketTool({
        title: options.getString('title') ?? 'Untitled ticket',
        reason: options.getString('reason') ?? 'General support',
        authorId: user.id,
        guildId: guild.id,
        channelId: ticketChannel.id,
        createdAt: new Date(),
      }) as ITicket

      const ticketMessage = await ticketChannel.send({
        embeds: [getEmbed(newTicket).setThumbnail(user.displayAvatarURL())],
      })

      newTicket.messageId = ticketMessage.id
      newTicket.save()

      return await interaction.reply({
        content: `Your ticket created here: <#${ticketChannel.id}>`,
        ephemeral: true,
      })
    } else if (options.getSubcommand() === 'open') {
      if (member && !isSupport(member as GuildMember)) {
        return await interaction.reply({
          content: 'This action is only for support team',
          ephemeral: true,
        })
      }

      const ticket = await TicketTool.findOne<ITicket>({
        guildId: guild.id,
        channelId: channel.id,
      })

      if (!ticket || !ticket.closed) {
        return await interaction.reply({
          content: "Look's like there is no closed ticket's to open",
          ephemeral: true,
        })
      }

      ticket.closed = false
      ticket.save()

      const ticketMessage = await channel.messages.fetch(ticket.messageId)

      await ticketMessage.edit({
        embeds: [getEmbed(ticket).setThumbnail(user.displayAvatarURL())],
      })

      return await interaction.reply(`Ticket \`OPENED\` by <@${user.id}>`)
    } else if (options.getSubcommand() === 'close') {
      const ticket = await TicketTool.findOne<ITicket>({
        guildId: guild.id,
        authorId: user.id,
      })

      if (!ticket || ticket.closed) {
        return await interaction.reply({
          content: "Look's like you don't have any opened ticket's",
          ephemeral: true,
        })
      }

      if (channel.id !== ticket.channelId) {
        return await interaction.reply({
          content: "You can update ticket status only from it's own channel",
          ephemeral: true,
        })
      }

      ticket.closed = true
      ticket.save()

      const ticketMessage = await channel.messages.fetch(ticket.messageId)

      await ticketMessage.edit({
        embeds: [getEmbed(ticket).setThumbnail(user.displayAvatarURL())],
      })

      return await interaction.reply(`Ticket \`CLOSED\` by <@${user.id}>`)
    } else if (options.getSubcommand() === 'delete') {
      if (member && !isSupport(member as GuildMember)) {
        return await interaction.reply({
          content: 'This action is only for support team',
          ephemeral: true,
        })
      }

      const ticket = await TicketTool.findOne<ITicket>({
        guildId: guild.id,
        channelId: channel.id,
      })

      if (!ticket || !ticket.closed) {
        return await interaction.reply({
          content: "Look's like there is no closed ticket's to delete",
          ephemeral: true,
        })
      }

      const ticketChannel = await guild.channels.fetch(ticket.channelId)
      await TicketTool.deleteOne({
        guildId: guild.id,
        channelId: channel.id,
      })
      return await ticketChannel?.delete()
    } else {
      return await interaction.reply({
        content: 'Unknown subcommand',
        ephemeral: true,
      })
    }
  },
})
