import { VoiceState } from 'discord.js'

import { Action } from '../../../modules/models/action'
import { ActionEvents } from '../../../modules/libs/events'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'voice-test-move' },

  event: ActionEvents.VoiceMove,

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { member } = newState

    logger.log(
      `${member?.user.tag} moved from ${oldState.channel?.name} to ${newState.channel?.name}`
    )
  },
})
