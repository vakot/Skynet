import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import musicHelper from '../utils/musicHelper.i'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Return back to previos track'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    return await musicHelper.previous(interaction)
  },
})
