import { YouTubeExtractor } from '@discord-player/extractor'
import { GuildQueuePlayerNode, Player } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'

import { getActionRow } from '../utils/getActionRow'
import { getEmbed } from '../utils/getEmbed'

import { IMetaData } from '../models/metadata'

export default new Action({
  data: { name: 'init-music-player' },

  event: ActionEvents.ClientReady,
  once: true,

  async execute(client: SkynetClient) {
    const player = Player.singleton(client)

    await player.extractors.register(YouTubeExtractor, {})

    await player.events.on('playerStart', async (queue) => {
      const metadata = queue.metadata as IMetaData

      metadata.message = await metadata.channel.send({
        embeds: [getEmbed(queue)],
        components: [getActionRow(queue)],
      })

      metadata.interval = setInterval(async () => {
        if (new GuildQueuePlayerNode(queue).isPaused()) return

        try {
          await metadata.message!.edit({
            embeds: [getEmbed(queue)],
            components: [getActionRow(queue)],
          })
        } catch {
          metadata.message = await metadata.channel.send({
            embeds: [getEmbed(queue)],
            components: [getActionRow(queue)],
          })
        }
      }, 3_000)
    })

    await player.events.on('playerFinish', async (queue) => {
      const metadata = queue.metadata as IMetaData

      if (metadata.interval) clearInterval(metadata.interval.toString())
      if (metadata.message && metadata.message.deletable) await metadata.message.delete()
    })
  },
})
