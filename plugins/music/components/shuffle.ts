import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { shuffle } from '../utils/shuffle.i'

export default new Action({
  data: { name: 'music-shuffle-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 12_000,

  async execute(interaction: ButtonInteraction) {
    return await shuffle(interaction)
  },
})
