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
      (() => {
        if (queue.repeatMode === QueueRepeatMode.TRACK) return ButtonStyle.Primary
        if (queue.repeatMode === QueueRepeatMode.QUEUE) return ButtonStyle.Success
        if (queue.repeatMode === QueueRepeatMode.OFF) return ButtonStyle.Secondary
        return ButtonStyle.Danger
      })()
    )

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
