import {
  Events,
  VoiceState,
  ChannelType,
  PermissionsBitField,
  Collection,
  Snowflake,
} from 'discord.js'

import store from '../../utils/helpers/store'
import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

import { parentId } from './config.json'

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isJoined: boolean = !oldState.channelId && !!newState.channelId
    const isParent: boolean = newState.channelId === parentId

    if (isJoined && isParent) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { guild, member } = newState
    if (!store.has('temporary-voice'))
      store.set('temporary-voice', new Collection<Snowflake, string>())

    const childrens: Collection<Snowflake, string> =
      store.get('temporary-voice')

    if (childrens && childrens.has(member.user.id)) return

    return await guild.channels
      .create({
        name: `${member.user.username}'s Room`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: member.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.Stream,
              PermissionsBitField.Flags.PrioritySpeaker,
              PermissionsBitField.Flags.MoveMembers,
            ],
          },
        ],
      })
      .then((channel) => {
        member.voice.setChannel(channel)

        childrens.set(member.user.id, channel.id)

        store.set('temporary-voice', childrens)

        logger.info(`Channel ${channel.name} created`)
      })
  },
} as Action
