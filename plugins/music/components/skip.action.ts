import { ButtonInteraction } from 'discord.js'

import { GuildQueuePlayerNode, useMasterPlayer } from 'discord-player'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

import { basePrecondition } from '../utils/basePrecondition'
import { IMetaData } from '../models/metadata'

export default new Action({
  data: { name: 'music-skip-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 6_000,

  async precondition(interaction: ButtonInteraction) {
    if (!(await basePrecondition(interaction))) return false

    const queue = useMasterPlayer()!.queues.cache.get(interaction.guildId!)

    if (!queue) {
      await interaction.reply({
        content: 'Queue does not exist on this server',
        ephemeral: true,
      })
      return false
    }

    if (!queue.isPlaying() || !queue.currentTrack) {
      await interaction.reply({ content: 'Nothing is playing now', ephemeral: true })
      return false
    }

    return true
  },

  async execute(interaction: ButtonInteraction) {
    const { guildId, user } = interaction

    const queue = useMasterPlayer()!.queues.cache.get(guildId!)!

    const metadata = queue.metadata as IMetaData
    const users = queue.channel?.members.filter((m) => !m.user.bot)
    const votesRequired = Math.ceil((users?.size ?? 0) / 2)
    const isRequestedBy = queue.currentTrack!.requestedBy?.id === user.id

    if (!isRequestedBy) {
      if (metadata.skipVotes.includes(user.id)) {
        return await interaction.reply({ content: 'You already voted to skip', ephemeral: true })
      }
      metadata.skipVotes.push(user.id)
      logger.log(`${user.tag} voted to skip ${queue.currentTrack!.title}`)
    }

    if (isRequestedBy || metadata.skipVotes.length >= votesRequired) {
      metadata.skipVotes = []

      new GuildQueuePlayerNode(queue).skip()

      logger.log(`${queue.currentTrack!.title} skipped`)

      return await interaction.reply(`**${queue.currentTrack!.title}** skipped`)
    }

    return await interaction.reply({ content: 'Vote to skip saved (^-^)', ephemeral: true })
  },
})
