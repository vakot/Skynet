import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js'

import { GuildQueuePlayerNode, useMasterPlayer } from 'discord-player'

import logger from '@utils/helpers/logger'

export default {
  async next(interaction: ChatInputCommandInteraction | ButtonInteraction) {
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

    const track = queue.currentTrack

    if (!track) {
      return await interaction.reply({ content: 'Nothing playing now', ephemeral: true })
    }

    if (track.requestedBy?.id !== user.id) {
      return await interaction.reply({ content: 'You have no tracks queued', ephemeral: true })
    }

    new GuildQueuePlayerNode(queue).skip()

    logger.log(`${track.title} skipped by ${track.requestedBy.tag}`)

    await interaction.reply(`**${track.title}** skipped`)
  },

  async previous(interaction: ChatInputCommandInteraction | ButtonInteraction) {
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

    const track = queue.currentTrack

    if (!track) {
      return await interaction.reply({ content: 'Nothing playing now', ephemeral: true })
    }

    if (track.requestedBy?.id !== user.id) {
      return await interaction.reply({ content: 'You have no tracks queued', ephemeral: true })
    }

    const previousTrack = queue.history.previousTrack

    if (!previousTrack) {
      return await interaction.reply({ content: "It's no tracks in history", ephemeral: true })
    }

    queue.history.previous()

    logger.log(`Returned to ${previousTrack.title} by ${track.requestedBy.tag}`)

    await interaction.reply(`Returned to **${previousTrack.title}** by <@${track.requestedBy.id}>`)
  },

  async shuffle(interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const { member, guildId } = interaction

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
        content: 'Queue is not exist on this server',
        ephemeral: true,
      })
    }

    queue.tracks.shuffle()

    logger.log(`Queue shuffled by ${interaction.user.tag}`)

    return await interaction.reply(`Queue shuffled by <@${interaction.user.id}>`)
  },
}
