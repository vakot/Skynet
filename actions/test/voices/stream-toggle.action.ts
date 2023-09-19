import { VoiceState } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'voice-test-stream' },

  event: ActionEvents.VoiceStream,

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { member, channel } = newState
    // const { member, channel } = oldState // Will be the same as newState

    logger.log(`${member?.user.tag} toggle streaming in ${channel?.name}`)
  },
})
