import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import { deleteTicket } from '../utils/ticket/delete'

export default new Action({
  data: { name: 'delete-ticket-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    return await deleteTicket(interaction)
  },
})
