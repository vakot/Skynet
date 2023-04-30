import { InteractionUpdateOptions, StringSelectMenuInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { SkynetClient } from '@modules/models/client'

import { Pages } from '../models/pages.i'

export default new Action({
  data: { name: 'help-select-menu-base' },

  event: ActionEvents.SelectMenuInteraction,

  async execute(interaction: StringSelectMenuInteraction, client: SkynetClient) {
    const select = interaction.values[0]

    if (select === 'commands') {
      return await interaction.update({
        ...(Pages.commands(client) as InteractionUpdateOptions),
      })
    } else if (select === 'faq') {
      return await interaction.update({
        ...(Pages.faq() as InteractionUpdateOptions),
      })
    }

    return await interaction.reply({
      content: 'Unknown page',
      ephemeral: true,
    })
  },
})
