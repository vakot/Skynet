import { Interaction } from 'discord.js'

import { Player } from 'discord-player'
import { YouTubeExtractor } from '@discord-player/extractor'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { SkynetClient } from '@modules/models/client'

import { getEmbed } from '../utils/getEmbed.i'
import { getActionRow } from '../utils/getActionRow.i'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'init-music-player' },

  event: ActionEvents.ClientReady,
  once: true,

  async execute(client: SkynetClient) {
    const player = new Player(client)

    await player.extractors.register(YouTubeExtractor, {})

    await player.events.on('playerStart', async (queue, track) => {
      const channel = (queue.metadata as Interaction).channel!

      const content = async () => ({
        embeds: [await getEmbed(queue)],
        components: [await getActionRow(queue)],
      })

      let messageId = (await channel!.send(await content())).id

      const updater = setInterval(async () => {
        try {
          await (await channel.messages.fetch(messageId)).edit(await content())
        } catch {
          messageId = (await channel.send(await content())).id
        }
      }, 3_000)

      setTimeout(async () => {
        clearInterval(updater)
        await (await channel.messages.fetch(messageId)).delete().catch(logger.error)
      }, track.durationMS)
    })
  },
})
