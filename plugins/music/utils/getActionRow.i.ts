import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

import { GuildQueue, QueueRepeatMode } from 'discord-player'

export async function getActionRow(queue: GuildQueue): Promise<ActionRowBuilder<ButtonBuilder>> {
  const nextButton = new ButtonBuilder()
    .setCustomId('music-next-button')
    .setEmoji('▶️')
    .setLabel(`0/${Math.ceil((queue.channel?.members.filter((m) => !m.user.bot).size ?? 0) / 2)}`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!queue.history.nextTrack)

  const prevButton = new ButtonBuilder()
    .setCustomId('music-previous-button')
    .setEmoji('◀️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!queue.history.previousTrack)

  const repeatButton = new ButtonBuilder()
    .setCustomId('music-repeat-button')
    .setEmoji('🔄')
    .setStyle(
      queue.repeatMode === QueueRepeatMode.OFF ? ButtonStyle.Secondary : ButtonStyle.Primary
    )

  if (queue.repeatMode === QueueRepeatMode.TRACK) repeatButton.setLabel('Track')
  if (queue.repeatMode === QueueRepeatMode.QUEUE) repeatButton.setLabel('Queue')

  const shuffleButton = new ButtonBuilder()
    .setCustomId('music-shuffle-button')
    .setEmoji('🔀')
    .setStyle(ButtonStyle.Primary)

  return new ActionRowBuilder<ButtonBuilder>().setComponents(
    prevButton,
    repeatButton,
    shuffleButton,
    nextButton
  )
}
