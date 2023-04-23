import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { ticketManager } from '../models/ticketManager.i'
import { validateAction } from '../../../utils/helpers/validateAction'
import { Ticket } from '../models/ticket.i'
import { handleTicketDelete } from '../utils/handleDelete.i'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open an existing ticket')
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
    const { user, guildId, channelId, options } = interaction

    if (!guildId) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    const response = await (async () => {
      if (options.getSubcommand() === 'create') {
        const ticket = new Ticket({
          title: options.getString('title'),
          reason: options.getString('reason'),
          authorId: user.id,
          guildId: guildId,
        })
        return await ticketManager.create(ticket)
      } else if (options.getSubcommand() === 'open') {
        return await ticketManager.open(user.id, guildId, channelId)
      } else if (options.getSubcommand() === 'close') {
        return await ticketManager.close(user.id, guildId, channelId)
      } else if (options.getSubcommand() === 'delete') {
        const response = await ticketManager.delete(user.id, guildId, channelId)
        const status = ticketManager.getTicketStatus(user.id, guildId)
        if (status === 'deleted') handleTicketDelete(user.id, guildId)
        return response
      } else {
        return 'Unknown subcommand'
      }
    })()

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
