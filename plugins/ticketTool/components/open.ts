import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { openTicket } from '../utils/ticket/open.i'

export default new Action({
  data: { name: 'open-ticket-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    return await openTicket(interaction)
  },
})
