import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import musicHelper from '../utils/musicHelper.i'

export default new Action({
  data: { name: 'music-next-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 10_000,

  async execute(interaction: ButtonInteraction) {
    // TODO: skip-vote
    return await musicHelper.next(interaction).then(() => interaction.message.delete())
  },
})
