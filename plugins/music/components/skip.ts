import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { next } from '../utils/next.i'

export default new Action({
  data: { name: 'music-skip-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 6_000,

  async execute(interaction: ButtonInteraction) {
    return await next(interaction)
  },
})
