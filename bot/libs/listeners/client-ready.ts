import { IEvent } from '@bot/models/event'
import { Style } from '@bot/utils/logger'
import { Events } from 'discord.js'
import Package from '../../../package.json'

export default {
  type: Events.ClientReady,
  once: true,
  async init(client, ...args) {
    client.logger.log(
      ` ${client.logger.startTag} ` +
        client.logger.color(`Skynet ${Package.version}`, [Style.Bright, Style.FgRed])
    )
  },
} as IEvent
