import {
  Events,
  Client,
  VoiceState,
  ChannelType,
  PermissionsBitField,
  GuildChannelCreateOptions,
} from 'discord.js'
import { config } from '../../utils/config'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'

const ActiveChannels: string[] = []

export default {
  data: {
    name: 'temp-voice-handle',
  },

  async init(client: Client) {
    client.on(
      Events.VoiceStateUpdate,
      (oldState: VoiceState, newState: VoiceState) => {
        return this.execute(oldState, newState).catch(logger.error)
      }
    )
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    // onParentJoin
    if (newState.channel.id == config.TEMPORARY_VOICE.PARENT_ID) {
      newState.channel.members.map((member) => {
        const channel: GuildChannelCreateOptions = {
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
        }

        newState.guild.channels.create(channel)
      })
    }

    // onChildLeave
    if (ActiveChannels.includes(oldState?.channel?.id)) {
      if (!oldState.channel.members.size) return oldState.channel.delete()
    }
  },
} as IAction
