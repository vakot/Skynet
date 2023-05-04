import { ChannelType, PermissionFlagsBits, VoiceState } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { ITemporaryVoice, TemporaryVoice } from './models/temporary-voice.i'

import { parentId, categoryId } from './config.json'

export default new Action({
  data: { name: 'create-temporary-voice-channel' },

  event: ActionEvents.VoiceJoin,

  cooldown: 20_000,

  permissions: [PermissionFlagsBits.UseApplicationCommands],

  async precondition(_, newState: VoiceState) {
    if (!newState.guild || !newState.member) return false

    const condition = { guildId: newState.guild.id }
    const guildTemporaryVoice: ITemporaryVoice =
      (await TemporaryVoice.findOne(condition)) ??
      new TemporaryVoice({
        guildId: newState.guild.id,
        categoryId: categoryId,
        parentId: parentId,
        createdAt: Date.now(),
      })

    // create new only if user dont have temporary channel
    if (guildTemporaryVoice.childrens.has(newState.member.id)) return false

    // create new only if join to parent channel
    return newState.channelId === guildTemporaryVoice.parentId
  },

  async execute(_, newState: VoiceState) {
    const { guild, member, channel } = newState

    if (!guild || !member || !channel) return

    const condition = { guildId: guild.id }
    const guildTemporaryVoice: ITemporaryVoice | null = await TemporaryVoice.findOne(condition)

    const authorPermissions = {
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
    }

    const temporaryChannel = await guild.channels.create({
      name: `${member.user.username}'s Room`,
      type: ChannelType.GuildVoice,
      parent: guildTemporaryVoice?.categoryId || channel.parent,
      permissionOverwrites: [authorPermissions],
    })

    await member.voice.setChannel(temporaryChannel)
    await guildTemporaryVoice?.childrens.set(member.id, temporaryChannel.id)
    return await guildTemporaryVoice?.save()
  },
})
