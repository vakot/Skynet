import { VoiceState } from 'discord.js'

import { GuildQueuePlayerNode, useMainPlayer } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'music-pause-on-empty' },

  event: ActionEvents.VoiceLeave,

  async precondition(oldState: VoiceState, newState: VoiceState, client: SkynetClient) {
    if (oldState.channel?.members.filter((m) => m.id !== client.user?.id).size) return false

    const player = useMainPlayer()

    if (!player) return false

    const queue = player.queues.get(oldState.guild.id)

    if (!queue) return false

    if (!queue.channel || oldState.channelId !== queue.channel.id) return false

    return true
  },

  async execute(oldState: VoiceState, newState: VoiceState) {
    const player = useMainPlayer()!
    const queue = player.queues.get(oldState.guild.id)!

    new GuildQueuePlayerNode(queue).pause()

    return logger.log(`Queue of ${queue.guild.name} paused`)
  },
})
