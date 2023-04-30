import { VoiceState } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'voice-test-join' },

  event: ActionEvents.VoiceJoin,

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { member, channel } = newState

    logger.log(`${member?.user.tag} joined to ${channel?.name}`)
  },
})
