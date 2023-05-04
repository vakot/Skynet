import { ButtonInteraction } from 'discord.js'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

import { previous } from '../utils/previous.i'

export default new Action({
  data: { name: 'music-previous-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 6_000,

  async execute(interaction: ButtonInteraction) {
    return await previous(interaction)
  },
})
