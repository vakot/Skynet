import { Events, Client, VoiceState } from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

import { ActiveChannels } from './create'

export default {
  data: {
    name: 'temp-voice-delete',
  },

  async init(client: Client) {
    client.on(
      Events.VoiceStateUpdate,
      (oldState: VoiceState, newState: VoiceState) => {
        if (!ActiveChannels.includes(oldState?.channel?.id)) return
        if (oldState?.channel?.members?.size) return

        return this.execute(oldState, newState).catch(logger.error)
      }
    )
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { channel } = oldState

    return channel.delete()
  },
} as IAction
