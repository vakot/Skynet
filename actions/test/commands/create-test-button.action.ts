import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { ActionCategories } from '@modules/libs/categories'

import logger from '@utils/helpers/logger'

export default new Action({
  data: new SlashCommandBuilder().setName('create-test-button').setDescription('Testing buttons'),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.Test,

  async execute(interaction: ChatInputCommandInteraction) {
    const { commandName, user } = interaction

    const button = new ButtonBuilder()
      .setCustomId('test-button')
      .setLabel('Click!')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    logger.log(`${user.tag} interact with </${commandName}>`)

    return await interaction.reply({
      ephemeral: true,
      components: [row],
    })
  },
})
