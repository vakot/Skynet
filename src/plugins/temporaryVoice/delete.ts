import { Events, VoiceState } from 'discord.js'

import { Action } from '../../models/action'

import { childrens } from './create'
import { parentId } from './config.json'

export default new Action({
  data: { name: '' },

  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    // just in case to be sure
    if ((!oldState && !newState) || !oldState.member) return
    // user streaming is also trigger VoiceStateUpdate. avoid it
    if (oldState.channelId === newState.channelId) return
    // delete channel only if user leave
    if (!oldState && newState) return
    // don't delete parent channel
    if (oldState.channelId === parentId) return
    // move user back to existing temporary channel
    if (newState.channelId === parentId) {
      if (!newState.member) return
      const channel = childrens.get(newState.member.id)
      if (channel) return await newState.member.voice.setChannel(channel)
    }
    // delete channel only if user have one
    if (!childrens.has(oldState.member.id)) return

    return await this.execute(oldState)
  },
  async execute(oldState: VoiceState) {
    const { channel, member } = oldState

    if (!channel || !member) return

    return await channel.delete().then(() => childrens.delete(member.id))
  },
})
