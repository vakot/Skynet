import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import musicHelper from '../utils/musicHelper.i'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Slip current track and play next'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    // TODO: skip-vote
    return await musicHelper.next(interaction)
  },
})
