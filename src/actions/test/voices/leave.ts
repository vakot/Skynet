import { VoiceState } from 'discord.js'

import { Action } from '../../../modules/models/action'
import { ActionEvents } from '../../../modules/libs/events'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'voice-test-leave' },

  event: ActionEvents.VoiceLeave,

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { member, channel } = oldState

    logger.log(`${member?.user.tag} leave from ${channel?.name}`)
  },
})
