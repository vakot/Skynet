import {
  Events,
  VoiceState,
  ChannelType,
  PermissionsBitField,
} from 'discord.js'

import { IAction } from '../../models/action'

import { parentId } from './config.json'

export const ActiveChannels: { userId: string; channelId: string }[] = []

export default {
  event: Events.VoiceStateUpdate,

  async init(oldState: VoiceState, newState: VoiceState) {
    if (newState.channel.id == parentId) return this.execute(oldState, newState)
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { guild, member } = newState

    if (ActiveChannels.find(({ userId }) => member.user.id === userId)) return

    return guild.channels
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
        ActiveChannels.push({ userId: member.user.id, channelId: channel.id })
      })
  },
} as IAction
