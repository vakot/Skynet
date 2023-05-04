import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import musicHelper from '../utils/musicHelper.i'

export default new Action({
  data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle current queue'),

  event: ActionEvents.CommandInteraction,

  cooldown: 12_000,

  async execute(interaction: ChatInputCommandInteraction) {
    return await musicHelper.shuffle(interaction)
  },
})
