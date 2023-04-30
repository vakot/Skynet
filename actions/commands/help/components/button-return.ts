import { ButtonInteraction, InteractionUpdateOptions } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { SkynetClient } from '@modules/models/client'

import { Pages } from '../models/pages.i'

export default new Action({
  data: { name: 'help-button-command-return' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction, client: SkynetClient) {
    return await interaction.update({
      // ...(Pages.category(category, client) as InteractionUpdateOptions),
      ...(Pages.commands(client) as InteractionUpdateOptions),
    })
  },
})
