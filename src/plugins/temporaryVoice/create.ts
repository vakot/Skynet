import {
  ChannelType,
  Collection,
  Events,
  PermissionFlagsBits,
  Snowflake,
  VoiceState,
} from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

import { parentId, categoryId } from './config.json'

import { ITemporaryVoice, TemporaryVoice } from './models/temporary-voice.i'
import { findOrCreate } from '../../utils/helpers/findOrCreate'

// userId > channelId
export const childrens = new Collection<Snowflake, Snowflake>()

export default new Action({
  data: { name: 'create-temporary-voice-channel' },

  event: Events.VoiceStateUpdate,

  cooldown: 20_000,

  permissions: [PermissionFlagsBits.UseApplicationCommands],

  async init(oldState: VoiceState, newState: VoiceState) {
    // just in case to be sure
    if ((!oldState && !newState) || !newState.member) return
    // user streaming is also trigger VoiceStateUpdate. Avoid it
    if (oldState.channelId === newState.channelId) return

    const { guild, member, channel } = newState

    const condition = { guildId: guild.id }
    const defaults: ITemporaryVoice = new TemporaryVoice({
      guildId: guild.id,
      categoryId: categoryId,
      parentId: parentId,
      createdAt: Date.now(),
    })

    const guildTemporaryVoice = (await findOrCreate(
      TemporaryVoice,
      condition,
      defaults
    )) as ITemporaryVoice

    if (!guildTemporaryVoice) return

    // create new only if user dont have temporary channel
    if (guildTemporaryVoice.childrens.has(member.id)) return

    // create new only if join to parent channel
    if (newState.channelId !== guildTemporaryVoice.parentId) return

    const invalidation = validateAction(this, guild, member.user, channel)

    if (invalidation) {
      // clear parrent voice
      await member.voice.disconnect()
      // send temporary DM notification
      return await member.user
        .send({
          content: invalidation + '\n⤷ Message will be deleted in `20s`',
        })
        .then((message) => setTimeout(() => message.delete(), 20000))
    }

    return await this.execute(newState, guildTemporaryVoice)
  },

  async execute(newState: VoiceState, guildTemporaryVoice: ITemporaryVoice) {
    const { guild, member, channel } = newState

    if (!guild || !member || !channel) return

    return await guild.channels
      .create({
        name: `${member.user.username}'s Room`,
        type: ChannelType.GuildVoice,
        parent: categoryId || channel.parent,
        permissionOverwrites: [
          {
            id: member.id,
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
      .then(async (channel) => {
        await member.voice.setChannel(channel)
        await guildTemporaryVoice.childrens.set(member.id, channel.id)
        await guildTemporaryVoice.save()
      })
  },
})
