import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { closeTicket } from '../utils/ticket/close.i'
import { createTicket } from '../utils/ticket/create.i'
import { deleteTicket } from '../utils/ticket/delete.i'
import { openTicket } from '../utils/ticket/open.i'
import { ICategory } from '@modules/models/category'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket-Tool commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('create')
        .setDescription('Create a new ticket')
        .addStringOption(
          new SlashCommandStringOption()
            .setName('title')
            .setDescription('Title of your ticket')
            .setRequired(false)
        )
        .addStringOption(
          new SlashCommandStringOption()
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

  category: {
    name: 'Ticket Tool',
    description: "Ticket-tool command's group",
    emoji: '📩',
  } as ICategory,

  event: ActionEvents.CommandInteraction,

  cooldown: 6_000,

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
