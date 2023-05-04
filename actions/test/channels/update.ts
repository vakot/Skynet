import { GuildChannel } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'channel-update-test' },

  event: ActionEvents.ChannelUpdate,

  async execute(oldChannel: GuildChannel, newChannel: GuildChannel) {
    return await logger.log(`Channel <${oldChannel.name}> updated to <${newChannel.name}>`)
  },
})
