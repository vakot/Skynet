import { Message } from 'discord.js'

import { Action } from '../../../models/action'
import { ActionEvents } from '../../../models/event'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'test-message-create' },

  event: ActionEvents.MessageCreate,

  async execute(message: Message) {
    const { author } = message

    logger.log(`${author.tag} create a message`)
  },
})
