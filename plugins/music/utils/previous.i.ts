import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js'

import { useMasterPlayer } from 'discord-player'

import logger from '@utils/helpers/logger'

export async function previous(interaction: ChatInputCommandInteraction | ButtonInteraction) {
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
    return await interaction.reply({ content: 'Here in no tracks in history', ephemeral: true })
  }

  queue.history.previous()

  logger.log(`Returned to ${previousTrack.title} by ${track.requestedBy.tag}`)

  await interaction.reply(`Returned to **${previousTrack.title}** by <@${track.requestedBy.id}>`)
}
