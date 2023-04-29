import { GuildChannel } from 'discord.js'

import { Action } from '../../../models/action'
import { ActionEvents } from '../../../models/event'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'channel-update-test' },

  event: ActionEvents.ChannelUpdate,

  async execute(oldState: GuildChannel, newState: GuildChannel) {
    return await logger.log(`Channel <${oldState.name}> updated to <${newState.name}>`)
  },
})
