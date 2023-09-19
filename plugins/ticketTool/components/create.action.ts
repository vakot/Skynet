import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { createTicket } from '../utils/ticket/create'

export default new Action({
  data: { name: 'create-ticket-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    return await createTicket(interaction)
  },
})
