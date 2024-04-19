import { IEvent } from '@models/event'
import { Style } from '@utils/logger'
import { Events } from 'discord.js'

export default {
  type: Events.ClientReady,
  once: true,
  async init(client, ...args) {
    client.logger.info(
      ' ' +
        client.logger.color('✓ ', [Style.Bright, Style.FgGreen]) +
        `Ready in ${(client.loadingTime / 1000).toFixed(1)}s`
    )
  },
} as IEvent
