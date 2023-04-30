import { TextChannel, NewsChannel } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'channel-pins-update-test' },

  event: ActionEvents.ChannelPinsUpdate,

  async execute(channel: TextChannel | NewsChannel, time: Date) {
    return await logger.log(`Channel <${channel.name}> pins updated at ${time}`)
  },
})
