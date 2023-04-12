import {
  Events,
  ChannelType,
  VoiceState,
  PermissionsBitField,
} from 'discord.js'
import { IAction } from '../../../models/action'
import { config } from '../'

const ActiveChannels: string[] = []

export default {
  data: {
    name: 'create',
  },
  trigger: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    // onParentJoin
    if (newState?.channel?.id == config.parent_id) {
      return newState.channel.members.map((member) => {
        newState.guild.channels
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
            ActiveChannels.push(channel.id)
          })
      })
    }

    // onChildLeave
    if (ActiveChannels.includes(oldState?.channel?.id)) {
      if (!oldState.channel.members.size) return oldState.channel.delete()
    }
  },
} as IAction
