import { Message } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'test-message-delete' },

  event: ActionEvents.MessageDelete,

  async execute(message: Message) {
    const { author } = message

    logger.log(`${author.tag} delete a message`)
  },
})
