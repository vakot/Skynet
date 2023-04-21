import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'
import { Ticket } from '../models/ticket'

import { validateAction } from '../../../utils/helpers/validateAction'

import { tickets } from '../create'
import { categoryId } from '../config.json'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('add-ticket')
    .setDescription('Add a new ticket')
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
    ),

  event: Events.InteractionCreate,

  cooldown: 120_000,

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
    const { user, guild, options } = interaction

    const ticket = new Ticket({
      title: options.getString('title'),
      reason: options.getString('reason'),
      authorId: user.id,
    })

    if (tickets.has(ticket.authorId)) {
      return await interaction.reply({
        content: 'Only one ticket can be created per user',
        ephemeral: true,
      })
    }

    const channel = await guild?.channels.create({
      name:
        user.username + '-' + (tickets.size + 1).toString().padStart(4, '0'),
      parent: categoryId || null,
      type: ChannelType.GuildText,
      // make channel private (only author and staff)
    })

    if (!channel) {
      return await interaction.reply({
        content: 'Failde to open a ticket',
        ephemeral: true,
      })
    }

    ticket.setChannel(channel.id)

    const message = await channel.send({
      embeds: [ticket.getEmbed()],
      components: [],
    })

    ticket.setMessage(message.id)

    tickets.set(ticket.authorId, ticket)

    const embed = new EmbedBuilder()
      .setTitle(ticket.title)
      .setDescription(`Your ticket is opened here: <#${ticket.channelId}>`)
      .setFields(
        {
          name: 'Opened by',
          value: `<@${ticket.authorId}>`,
          inline: true,
        },
        {
          name: 'Opened at',
          value: `<t:${Math.round(ticket.createdTimestamp * 0.001)}:f>`,
          inline: true,
        },
        {
          name: 'Reason',
          value: ticket.reason,
          inline: true,
        }
      )

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  },
})
