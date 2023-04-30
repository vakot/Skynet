import { VoiceState } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { ITemporaryVoice, TemporaryVoice } from './models/temporary-voice.i'

export default new Action({
  data: { name: 'delete-temporary-voice-channel' },

  event: ActionEvents.VoiceLeave,

  async precondition(oldState: VoiceState, newState: VoiceState) {
    if (!oldState.member || !oldState.guild) return false

    const condition = { guildId: oldState.guild.id }
    const guildTemporaryVoice = await TemporaryVoice.findOne(condition)
    if (!guildTemporaryVoice) return false

    // delete temporary channel only if user have one
    if (!guildTemporaryVoice.childrens.has(oldState.member.id)) return false

    // move user back to existing temporary channel
    if (newState.channelId === guildTemporaryVoice.parentId) {
      if (!newState.member) return false

      const channel = guildTemporaryVoice.childrens.get(newState.member.id)

      if (channel) {
        await newState.member.voice.setChannel(channel)
        return false
      }
    }

    // don't delete parent channel
    return oldState.channelId !== guildTemporaryVoice.parentId
  },

  async execute(oldState: VoiceState) {
    const { channel, member, guild } = oldState

    if (!channel || !member || !guild) return

    const condition = { guildId: guild.id }

    const guildTemporaryVoice: ITemporaryVoice | null = await TemporaryVoice.findOne(condition)

    await channel.delete()
    await guildTemporaryVoice?.childrens.delete(member.id)
    return await guildTemporaryVoice?.save()
  },
})
