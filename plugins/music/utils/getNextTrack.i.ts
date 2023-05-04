import { GuildQueue, QueueRepeatMode, Track } from 'discord-player'

export function getNextTrack(queue: GuildQueue): Track | null {
  if (queue.history.nextTrack) return queue.history.nextTrack

  if (queue.repeatMode === QueueRepeatMode.QUEUE) {
    return [...queue.history.tracks.toArray()].shift() || null
  }

  if (queue.repeatMode === QueueRepeatMode.TRACK) return queue.currentTrack

  return null
}
