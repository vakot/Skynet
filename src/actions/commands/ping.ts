import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '../../modules/models/action'
import { ActionEvents } from '../../modules/libs/events'
import { ActionCategories } from '../../modules/libs/categories'

export default new Action({
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with "Pong!"'),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.General,

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: 'Pong!',
      ephemeral: true,
    })
  },
})
