import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'

import { validateAction } from '../../../utils/helpers/validateAction'
import { createTicket } from '../utils/ticket/create.i'
import { openTicket } from '../utils/ticket/open.i'
import { closeTicket } from '../utils/ticket/close.i'
import { deleteTicket } from '../utils/ticket/delete.i'

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
    const { options } = interaction

    if (options.getSubcommand() === 'create') {
      return await createTicket(interaction)
    } else if (options.getSubcommand() === 'open') {
      return await openTicket(interaction)
    } else if (options.getSubcommand() === 'close') {
      return await closeTicket(interaction)
    } else if (options.getSubcommand() === 'delete') {
      return await deleteTicket(interaction)
    } else {
      return await interaction.reply({
        content: 'Unknown subcommand',
        ephemeral: true,
      })
    }
  },
})
