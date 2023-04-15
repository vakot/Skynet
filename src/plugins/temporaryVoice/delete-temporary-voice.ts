import { Events, VoiceState } from 'discord.js'

import { IAction } from '../../models/action'

import { ActiveChannels } from './create-temporary-voice'

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    if (
      ActiveChannels.find(
        ({ channelId }) => oldState.channel.id === channelId
      ) &&
      !oldState.channel.members.size
    )
      return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { channel } = oldState

    ActiveChannels.push(
      ...ActiveChannels.filter(({ channelId }) => channel.id !== channelId)
    )

    console.log(ActiveChannels)

    return channel.delete()
  },
} as IAction
