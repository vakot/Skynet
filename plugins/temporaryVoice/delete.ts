import { Events, VoiceState } from 'discord.js'

import { Action } from '../../modules/models/action'

import { ITemporaryVoice, TemporaryVoice } from './models/temporary-voice.i'
import { findOrCreate } from '../../utils/helpers/findOrCreate'
import { parentId, categoryId } from './config.json'

export default new Action({
  data: { name: 'delete-temporary-voice-channel' },

  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    // just in case to be sure
    if ((!oldState && !newState) || !oldState.member) return
    // user streaming is also trigger VoiceStateUpdate. avoid it
    if (oldState.channelId === newState.channelId) return
    // delete channel only if user leave
    if (!oldState && newState) return

    const { guild, member } = oldState

    const guildTemporaryVoice = await TemporaryVoice.findOne({
      guildId: guild.id,
    })

    // delete temporary channel only if user have one
    if (!guildTemporaryVoice.childrens.has(member.id)) return

    // don't delete parent channel
    if (oldState.channelId === guildTemporaryVoice.parentId) return

    // move user back to existing temporary channel
    if (newState.channelId === guildTemporaryVoice.parentId) {
      if (!newState.member) return

      const channel = guildTemporaryVoice.childrens.get(newState.member.id)

      if (channel) return await newState.member.voice.setChannel(channel)
    }

    return await this.execute(oldState, guildTemporaryVoice)
  },
  async execute(oldState: VoiceState, guildTemporaryVoice: ITemporaryVoice) {
    const { channel, member } = oldState

    if (!channel || !member) return

    return await channel.delete().then(async () => {
      await guildTemporaryVoice.childrens.delete(member.id)
      await guildTemporaryVoice.save()
    })
  },
})
