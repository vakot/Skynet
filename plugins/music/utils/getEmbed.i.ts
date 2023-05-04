import { EmbedBuilder, Interaction } from 'discord.js'

import { GuildQueue, GuildQueuePlayerNode } from 'discord-player'

export async function getEmbed(queue: GuildQueue): Promise<EmbedBuilder> {
  const track = queue.currentTrack!

  const embeb = new EmbedBuilder()
    .setTitle(track.title || null)
    .setDescription(track.description || null)
    .setFields(
      {
        name: '📩 Requested by',
        value: `> <@${track.requestedBy!.id}>`,
        inline: true,
      },
      {
        name: '👀 Views',
        value: `> ${track.views.toLocaleString('de-DE', { minimumFractionDigits: 0 })}` || '-',
        inline: true,
      },
      {
        name: '✍️ Source',
        value: `> [${track.author}](${track.url})` || '-',
        inline: true,
      },
      {
        name: 'Next track',
        value: '```' + (queue.history.nextTrack?.title || ' ') + '```',
      }
    )
    .setImage(track.thumbnail)
    .setURL(track.url)
    .setTimestamp((queue.metadata as Interaction).createdAt)
    .setFooter({ text: new GuildQueuePlayerNode(queue).createProgressBar() || track.duration })

  return embeb
}
