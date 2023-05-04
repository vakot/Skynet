import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { next } from '../utils/next.i'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track and play next'),

  event: ActionEvents.CommandInteraction,

  cooldown: 6_000,

  async execute(interaction: ChatInputCommandInteraction) {
    return await next(interaction)
  },
})
