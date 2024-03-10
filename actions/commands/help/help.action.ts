import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { Pages } from './models/pages.config'

export default new Action({
  data: new SlashCommandBuilder().setName('help').setDescription('Information about Skynet'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({ ...Pages.main(), ephemeral: true })
  },
})
