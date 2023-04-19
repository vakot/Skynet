import {
  ChannelType,
  ClientEvents,
  Collection,
  Events,
  PermissionFlagsBits,
  Snowflake,
  VoiceState,
} from 'discord.js'
import { Action } from '../../models/Action'

import { parentId } from './config.json'
import { validateAction } from '../../utils/helpers/validateAction'

// userId > channelId
export const childrens = new Collection<Snowflake, Snowflake>()

export default class TemporaryVoice extends Action {
  data: { [key: string]: any; name: string } = {
    name: 'temporary-voice-create',
  }

  event: keyof ClientEvents = Events.VoiceStateUpdate

  cooldown?: number = 20000

  async init(oldState: VoiceState, newState: VoiceState): Promise<any> {
    // just in case to be sure
    if (!oldState && !newState) return

    // user streaming is also trigger VoiceStateUpdate. Avoid it
    if (oldState.channelId === newState.channelId) return

    // create new only if join to parent channel
    if (newState.channelId !== parentId) return

    // create new only if user dont have temporary channel
    if (childrens.has(newState.member.user.id)) return

    const invalidation = validateAction(
      this,
      newState.guild,
      newState.member.user
    )

    if (invalidation) {
      // clear parrent voice
      await newState.member.voice.disconnect()

      // send temporary DM notification
      return await newState.member.user
        .send({
          content: invalidation + '\n⤷ Message will be deleted in `20s`',
        })
        .then((message) => setTimeout(() => message.delete(), 20000))
    }

    return await this.execute(newState)
  }

  async execute(newState: VoiceState): Promise<any> {
    const { guild, member } = newState

    return await guild.channels
      .create({
        name: `${member.user.username}'s Room`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: member.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.Speak,
              PermissionFlagsBits.Stream,
              PermissionFlagsBits.PrioritySpeaker,
              PermissionFlagsBits.MoveMembers,
            ],
          },
        ],
      })
      .then((channel) => {
        member.voice.setChannel(channel)
        childrens.set(member.user.id, channel.id)
      })
  }
}
