import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { closeTicket } from '../utils/ticket/close.i'

export default new Action({
  data: { name: 'close-ticket-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    return await closeTicket(interaction)
  },
})
