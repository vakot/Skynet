import {
  Events,
  VoiceState,
  ChannelType,
  PermissionsBitField,
  Collection,
  Snowflake,
} from 'discord.js'

import { nanoid } from 'nanoid'

import store from '../../utils/helpers/store'
import logger from '../../utils/helpers/logger'

import { Action } from '../../models/action'

import { parentId } from './config.json'
import { getCooldown } from '../../utils/fetch/getCooldown'

export default {
  id: nanoid(),

  event: Events.VoiceStateUpdate,

  cooldown: 20000,

  async init(oldState: VoiceState, newState: VoiceState) {
    const isParent: boolean = newState.channelId === parentId

    const isJoined: boolean = !oldState.channelId && !!newState.channelId
    const isMove: boolean =
      !!oldState.channelId &&
      !!newState.channelId &&
      oldState.channelId !== newState.channelId

    if ((isJoined || isMove) && isParent) {
      const cooldown = getCooldown(this, newState.member.user)
      const now = Date.now()

      // custom cooldown handle
      if (cooldown > now) {
        const { member } = newState

        logger.warn(`${member.user.tag} create channels to often`)

        await member.voice.disconnect()

        // dm to user and delete message after cooldown
        return await member.user
          .send(`Cooldown <t:${Math.round(cooldown / 1000)}:R>`)
          .then((message) => setTimeout(() => message.delete(), cooldown - now))
      }

      return this.execute(oldState, newState)
    }
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
