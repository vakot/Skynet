import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '../../../models/action'
import { ActionEvents } from '../../../models/event'

import { Pages } from './models/pages.i'

export default new Action({
  data: new SlashCommandBuilder().setName('help').setDescription('Information about Skynet'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({ ...Pages.main(), ephemeral: true })
  },
})
