import { EmbedBuilder, Message } from 'discord.js'

import { GuildQueue, GuildQueuePlayerNode } from 'discord-player'

import { getPrevTrack } from '../utils/getPrevTrack.i'
import { getNextTrack } from '../utils/getNextTrack.i'

export function getEmbed(queue: GuildQueue): EmbedBuilder {
  const track = queue.currentTrack

  const embeb = new EmbedBuilder()
    .setTitle(track?.title || null)
    .setDescription(track?.description || null)
    .setFields(
      {
        name: '📩・Requested by',
        value: '```' + track?.requestedBy!.tag + '```',
        inline: true,
      },
      {
        name: '👀・Views',
        value: '```' + track?.views.toLocaleString('de-DE', { minimumFractionDigits: 0 }) + '```',
        inline: true,
      },
      {
        name: '✍️・Author',
        value: '```' + track?.author + '```',
        inline: true,
      },
      {
        name: '⬅️・Previous track',
        value: '```' + (getPrevTrack(queue) || ' ') + '```',
      },
      {
        name: '➡️・Next track',
        value: '```' + (getNextTrack(queue) || ' ') + '```',
      }
    )
    .setThumbnail(track?.playlist?.thumbnail || null)
    .setImage(track?.thumbnail || null)
    .setURL(track?.url || null)
    .setTimestamp((queue.metadata as Message).createdAt)
    .setFooter({
      text: new GuildQueuePlayerNode(queue).createProgressBar() || track?.duration || '',
    })

  return embeb
}
