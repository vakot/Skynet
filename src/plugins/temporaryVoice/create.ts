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

import { validateInteraction } from '../../utils/helpers/validateInteraction'
import responder from '../../utils/helpers/responder'

import { Action } from '../../models/action'

import { parentId } from './config.json'

export default {
  id: nanoid(),

  event: Events.VoiceStateUpdate,

  cooldown: 20000,

  async init(oldState: VoiceState, newState: VoiceState) {
    if (newState.channelId === parentId) {
      const invalidations = await validateInteraction(
        this,
        newState.member.user,
        newState.channelId
      )

      if (invalidations.length) {
        await newState.member.voice.disconnect()
        return await responder.deny.dm(newState.member.user, invalidations)
      } else {
        return await this.execute(oldState, newState)
      }
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
