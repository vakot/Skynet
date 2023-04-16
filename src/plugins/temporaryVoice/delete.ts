import { Events, VoiceState, Collection, Snowflake } from 'discord.js'

import { nanoid } from 'nanoid'

import store from '../../utils/helpers/store'
import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

import { parentId } from './config.json'

export default {
  id: nanoid(),

  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isLeft: boolean = !!oldState.channelId && !newState.channelId
    const isMove: boolean =
      !!oldState.channelId &&
      !!newState.channelId &&
      oldState.channelId !== newState.channelId

    if (isLeft || isMove) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { channel, member } = oldState

    if (oldState.channelId === parentId) return

    const childrens: Collection<Snowflake, string> =
      store.get('temporary-voice')

    if (!childrens || !childrens.has(member.user.id)) return

    if (newState.channelId === parentId)
      return await member.voice.setChannel(childrens.get(member.user.id))

    childrens.delete(member.user.id)

    store.set('temporary-voice', childrens)

    return await channel
      .delete()
      .then(() => logger.info(`Channel ${channel.name} deleted`))
  },
} as Action
