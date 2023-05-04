import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js'

import { useMasterPlayer, GuildQueuePlayerNode } from 'discord-player'

import logger from '@utils/helpers/logger'

import { IMetaData } from '../models/metadata.i'

export async function next(interaction: ChatInputCommandInteraction | ButtonInteraction) {
  const { member, user, guildId } = interaction

  if (!member || !guildId) {
    return await interaction.reply({
      content: 'Action can be executed only in server',
      ephemeral: true,
    })
  }

  const player = useMasterPlayer()!

  const queue = player.queues.cache.get(guildId)

  if (!queue) {
    return await interaction.reply({
      content: 'Queue not exist on this server',
      ephemeral: true,
    })
  }

  if (!queue.currentTrack) {
    return await interaction.reply({ content: 'Nothing playing now', ephemeral: true })
  }

  const metadata = queue.metadata as IMetaData
  const users = queue.channel?.members.filter((m) => !m.user.bot)
  const votesRequired = Math.ceil((users?.size ?? 0) / 2)
  const isRequestedBy = queue.currentTrack.requestedBy?.id === user.id

  if (!isRequestedBy) {
    if (metadata.skipVotes.includes(user.id)) {
      return await interaction.reply({ content: 'You already voted to skip', ephemeral: true })
    }
    metadata.skipVotes.push(user.id)
    logger.log(`${user.tag} voted to skip ${queue.currentTrack.title}`)
  }

  if (isRequestedBy || metadata.skipVotes.length >= votesRequired) {
    metadata.skipVotes = []

    new GuildQueuePlayerNode(queue).skip()

    logger.log(`${queue.currentTrack.title} skipped`)

    return await interaction.reply(`**${queue.currentTrack.title}** skipped`)
  }

  return await interaction.reply({ content: 'Vote to skip saved (^-^)', ephemeral: true })
}
