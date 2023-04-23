import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'
import { Ticket } from '../models/ticket.i'

import { ticketManager } from '../models/ticketManager.i'

import { validateAction } from '../../../utils/helpers/validateAction'

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
    const { user, guildId, options } = interaction

    if (!guildId) {
      return await interaction.reply({
        content: 'You can interact with ticket-tool only from guild channels',
        ephemeral: true,
      })
    }

    const ticket = new Ticket({
      title: options.getString('title'),
      reason: options.getString('reason'),
      authorId: user.id,
      guildId: guildId,
    })

    const response = await ticketManager.add(ticket)

    return await interaction.reply({
      content: response,
      ephemeral: true,
    })
  },
})
