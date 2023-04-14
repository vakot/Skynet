import { Events, VoiceState } from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

import { ActiveChannels } from './create'

export default {
  data: {
    name: 'temp-voice-delete',
  },

  listener: {
    event: Events.VoiceStateUpdate,
  },

  async init(oldState: VoiceState, newState: VoiceState) {
    if (
      ActiveChannels.includes(oldState?.channel?.id) &&
      !oldState?.channel?.members?.size
    )
      return this.execute(oldState, newState).catch(logger.error)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { channel } = oldState

    return channel.delete()
  },
} as IAction
