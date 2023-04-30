import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: new SlashCommandBuilder().setName('test-2').setDescription('Testing select menus'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    const { commandName, user } = interaction

    const options = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
    ]

    const menu = new StringSelectMenuBuilder()
      .setCustomId('test-select-menu')
      .setPlaceholder('Select a value')
      .setOptions(...options)
      .setMinValues(0)
      .setMaxValues(options.length)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)

    logger.log(`${user.tag} interact with </${commandName}>`)

    return await interaction.reply({
      ephemeral: true,
      components: [row],
    })
  },
})
