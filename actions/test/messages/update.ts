import { Message } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'test-message-update' },

  event: ActionEvents.MessageUpdate,

  async execute(oldMessage: Message, newMessage: Message) {
    const { author } = oldMessage

    logger.log(`${author.tag} update a message`)
  },
})
