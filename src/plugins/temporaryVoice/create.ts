import {
  Events,
  VoiceState,
  ChannelType,
  PermissionsBitField,
  Collection,
  Snowflake,
} from 'discord.js'

import store from '../../utils/helpers/store'

import { IAction } from '../../models/action'

import { parentId } from './config.json'

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isJoined: boolean = !oldState.channelId && !!newState.channelId
    const isParent: boolean = newState.channelId === parentId

    if (isJoined && isParent) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    if (!store.has('temporary-voice'))
      store.set('temporary-voice', new Collection<Snowflake, string>())

    const childrens: Collection<Snowflake, string> =
      store.get('temporary-voice')

    if (childrens && childrens.has(newState.member.user.id)) return

    return await newState.guild.channels
      .create({
        name: `${newState.member.user.username}'s Room`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: newState.member.user.id,
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
        newState.member.voice.setChannel(channel)

        childrens.set(newState.member.user.id, channel.id)

        store.set('temporary-voice', childrens)
      })
  },
} as IAction
