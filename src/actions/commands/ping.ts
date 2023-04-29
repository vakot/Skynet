import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '../../models/action'
import { ActionEvents } from '../../models/event'
import { ActionCategories } from '../../models/category'

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
