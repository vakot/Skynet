import {
  ChannelType,
  ChatInputCommandInteraction,
  Events,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
} from 'discord.js'

import { Action } from '../../../models/action'

import { validateAction } from '../../../utils/helpers/validateAction'
import { isSupport } from '../utils/isSupport.i'
import { getEmbed } from '../utils/getEmbed.i'

import { ITicket, TicketTool } from '../models/ticket-tool.i'

import { supportRoles, parentId } from '../config.json'

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
    ),

  event: Events.InteractionCreate,

  cooldown: 6_000,

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
      if (!(channel instanceof TextChannel)) {
        return await interaction.reply({
          content: "You can create ticket only from text channel's",
          ephemeral: true,
        })
      }

      if (parentId && channel.id !== parentId) {
        return await interaction.reply({
          content: `You can create ticket only from <#${parentId}>`,
          ephemeral: true,
        })
      }

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

      const newTicket = new TicketTool({
        title: options.getString('title') ?? 'Untitled ticket',
        reason: options.getString('reason') ?? 'General support',
        authorId: user.id,
        authorAvatar: user.displayAvatarURL(),
        guildId: guild.id,
        parentId: channel.id,
        supportTeam: supportRoles,
        createdAt: new Date(),
      }) as ITicket

      const ticketThread = await channel.threads.create({
        name: user.username + '-' + user.discriminator,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        type: ChannelType.PrivateThread,
        reason: options.getString('reason') ?? 'General support',
      })

      if (!ticketThread) {
        return await interaction.reply({
          content: 'Failed to create a ticket',
          ephemeral: true,
        })
      }

      const ticketMessage = await ticketThread.send({
        content: `<@${newTicket.authorId}> | ${newTicket.supportTeam
          .map((role) => `<@&${role}>`)
          .join(' | ')}`,
        embeds: [getEmbed(newTicket)],
      })

      newTicket.parentId = channel.id
      newTicket.threadId = ticketThread.id
      newTicket.messageId = ticketMessage.id
      newTicket.save()

      return await interaction.reply({
        content: `Your ticket created here: <#${newTicket.threadId}>`,
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
        threadId: channel.id,
      })

      if (!ticket || !ticket.closed) {
        return await interaction.reply({
          content: "Look's like there is no closed ticket's to open",
          ephemeral: true,
        })
      }

      ticket.closed = false
      ticket.save()

      const ticketThread = channel as ThreadChannel
      await ticketThread.members.add(
        ticket.authorId,
        `Ticket is re-opened, look's like ${guild.name} Support Team still need you to resolve a problem`
      )

      const ticketMessage = await ticketThread.messages.fetch(ticket.messageId)
      if (ticketMessage) {
        await ticketMessage.edit({
          embeds: [getEmbed(ticket)],
        })
      }

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

      if (channel.id !== ticket.threadId) {
        return await interaction.reply({
          content: "You can update ticket status only from it's own channel",
          ephemeral: true,
        })
      }

      ticket.closed = true
      ticket.save()

      const ticketThread = channel as ThreadChannel
      const ticketMessage = await ticketThread.messages.fetch(ticket.messageId)
      if (ticketMessage) {
        await ticketMessage.edit({
          embeds: [getEmbed(ticket)],
        })
      }

      await interaction.reply(`Ticket \`CLOSED\` by <@${user.id}>`)

      return await ticketThread.members.remove(
        ticket.authorId,
        `Ticket is closed, leave other work to ${guild.name} Support Team`
      )
    } else {
      return await interaction.reply({
        content: 'Unknown subcommand',
        ephemeral: true,
      })
    }
  },
})
