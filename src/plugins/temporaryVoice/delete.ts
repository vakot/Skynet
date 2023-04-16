import { Events, VoiceState, Collection, Snowflake } from 'discord.js'

import store from '../../utils/helpers/store'

import { Action } from '../../models/action'

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isLeft: boolean = !!oldState.channelId && !newState.channelId

    if (isLeft) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const childrens: Collection<Snowflake, string> =
      store.get('temporary-voice')

    if (!childrens || !childrens.has(oldState.member.user.id)) return

    childrens.delete(oldState.member.user.id)

    store.set('temporary-voice', childrens)

    return await oldState.channel.delete()
  },
} as Action
