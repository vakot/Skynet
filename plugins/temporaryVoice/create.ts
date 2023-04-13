import {
  Events,
  Client,
  VoiceState,
  ChannelType,
  PermissionsBitField,
} from 'discord.js'
import { config } from '../../utils/config'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

export const ActiveChannels: string[] = []

export default {
  data: {
    name: 'temp-voice-create',
  },

  async init(client: Client) {
    client.on(
      Events.VoiceStateUpdate,
      (oldState: VoiceState, newState: VoiceState) => {
        if (newState?.channel?.id != config.TEMPORARY_VOICE.PARENT_ID) return

        return this.execute(oldState, newState).catch(logger.error)
      }
    )
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const { guild, member } = newState

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
        ActiveChannels.push(channel.id)
      })
  },
} as IAction
