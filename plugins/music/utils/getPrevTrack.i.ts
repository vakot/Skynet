import { GuildQueue, QueueRepeatMode, Track } from 'discord-player'

export function getPrevTrack(queue: GuildQueue): Track | null {
  if (queue.history.previousTrack) return queue.history.previousTrack

  if (queue.repeatMode === QueueRepeatMode.QUEUE) {
    return [...queue.history.tracks.toArray()].pop() || null
  }

  return null
}
