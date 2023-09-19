import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  TextChannel,
  ThreadAutoArchiveDuration,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js'

import { TicketTool, ITicket } from '../../models/ticket-tool'

import { getEmbed } from '../getEmbed'

import { parentId, supportRoles } from '../../config.json'

export async function createTicket(interaction: ChatInputCommandInteraction | ButtonInteraction) {
  const { channel, guild, user } = interaction

  if (!guild || !channel) {
    return await interaction.reply({
      content: 'You can interact with ticket-tool only from guild channels',
      ephemeral: true,
    })
  }

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

  const title =
    interaction instanceof ChatInputCommandInteraction
      ? interaction.options.getString('title') ?? 'Untitled ticket'
      : user.username + "'s ticket"
  const reason =
    interaction instanceof ChatInputCommandInteraction
      ? interaction.options.getString('reason') ?? 'General support'
      : 'General support'

  const newTicket = new TicketTool({
    title: title,
    reason: reason,
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
    reason: reason,
  })

  if (!ticketThread) {
    return await interaction.reply({
      content: 'Failed to create a ticket',
      ephemeral: true,
    })
  }

  const closeButton = new ButtonBuilder()
    .setCustomId('close-ticket-button')
    .setDisabled(false)
    .setLabel('Close')
    .setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)

  const ticketMessage = await ticketThread.send({
    content: `<@${newTicket.authorId}> | ${newTicket.supportTeam
      .map((role) => `<@&${role}>`)
      .join(' | ')}`,
    embeds: [getEmbed(newTicket)],
    components: [row],
  })

  newTicket.parentId = channel.id
  newTicket.threadId = ticketThread.id
  newTicket.messageId = ticketMessage.id
  newTicket.save()

  return await interaction.reply({
    content: `Your ticket created here: <#${newTicket.threadId}>`,
    ephemeral: true,
  })
}
