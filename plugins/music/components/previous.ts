import { ButtonInteraction } from 'discord.js'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

import musicHelper from '../utils/musicHelper.i'

export default new Action({
  data: { name: 'music-previous-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 10_000,

  async execute(interaction: ButtonInteraction) {
    return await musicHelper.previous(interaction)
  },
})
