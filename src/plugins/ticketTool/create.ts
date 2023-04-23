import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('create-ticket-tool')
    .setDescription('Base setup for ticket tool'),

  event: Events.InteractionCreate,

  cooldown: 120_000,

  devsOnly: true,
  testOnly: true,

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
    const button = new ButtonBuilder()
      .setCustomId('add-new-ticket-button')
      .setLabel('Create')
      .setStyle(ButtonStyle.Success)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    return await interaction.reply({
      content: 'ticket_tool_base_message',
      components: [row],
    })
  },
})
