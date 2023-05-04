import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js'

import { useMasterPlayer } from 'discord-player'

import logger from '@utils/helpers/logger'

export async function shuffle(interaction: ChatInputCommandInteraction | ButtonInteraction) {
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
}
