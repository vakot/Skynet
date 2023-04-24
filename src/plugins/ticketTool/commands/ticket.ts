import {
  ChatInputCommandInteraction,
  Events,
  GuildMemberRoleManager,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { Action } from '../../../modules/models/action'

import { validateAction } from '../../../utils/helpers/validateAction'

import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

import { isSupport } from '../utils/isSupport.i'

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

  cooldown: 5_000,

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
    const { user, guild, options, member } = interaction

    if (!guild) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    if (options.getSubcommand() === 'create') {
      const ticket = new Ticket({
        title: options.getString('title'),
        reason: options.getString('reason'),
        author: user,
        guild: guild,
      })

      const response = await ticketManager.create(ticket)

      return await interaction.reply({
        content: response,
        ephemeral: true,
      })
    } else if (options.getSubcommand() === 'close') {
      const { status, message } = await ticketManager.close(user.id, guild.id)

      return await interaction.reply({
        content: message + (status ? ` by <@${user.id}>` : ''),
        ephemeral: !status,
      })
    } else if (options.getSubcommand() === 'open') {
      if (!isSupport(member?.roles as GuildMemberRoleManager)) {
        return await interaction.reply({
          content: 'This action availible only for support team',
          ephemeral: true,
        })
      }

      const { status, message } = await ticketManager.open(user.id, guild.id)

      return await interaction.reply({
        content: message + (status ? ` by <@${user.id}>` : ''),
        ephemeral: !status,
      })
    } else if (options.getSubcommand() === 'delete') {
      if (!isSupport(member?.roles as GuildMemberRoleManager)) {
        return await interaction.reply({
          content: 'This action availible only for support team',
          ephemeral: true,
        })
      }

      const response = await ticketManager.delete(user.id, guild.id)

      if (!response) return

      return await interaction.reply({
        content: response,
        ephemeral: true,
      })
    } else {
      return await interaction.reply({
        content: 'Unknown subcommand',
        ephemeral: true,
      })
    }
  },
})
