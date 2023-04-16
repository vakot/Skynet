import { Events, VoiceState, Collection, Snowflake } from 'discord.js'

import store from '../../utils/helpers/store'
import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isLeft: boolean = !!oldState.channelId && !newState.channelId

    if (isLeft) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { channel, member } = oldState

    const childrens: Collection<Snowflake, string> =
      store.get('temporary-voice')

    if (!childrens || !childrens.has(member.user.id)) return

    childrens.delete(member.user.id)

    store.set('temporary-voice', childrens)

    return await channel
      .delete()
      .then(() => logger.info(`Channel ${channel.name} deleted`))
  },
} as Action
