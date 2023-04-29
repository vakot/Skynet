import { GuildChannel } from 'discord.js'

import { Action } from '../../../models/action'
import { ActionEvents } from '../../../models/event'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'channel-delete-test' },

  event: ActionEvents.ChannelDelete,

  async execute(channel: GuildChannel) {
    return await logger.log(`Channel <${channel.name}> deleted`)
  },
})
