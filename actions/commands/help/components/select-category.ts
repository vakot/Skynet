import { StringSelectMenuInteraction, InteractionUpdateOptions } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { SkynetClient } from '@modules/models/client'

import { Pages } from '../models/pages.i'

export default new Action({
  data: { name: 'help-select-menu-category' },

  event: ActionEvents.SelectMenuInteraction,

  async execute(interaction: StringSelectMenuInteraction, client: SkynetClient) {
    const select = interaction.values[0]

    if (select === 'return') {
      return await interaction.update({
        ...(Pages.main() as InteractionUpdateOptions),
      })
    } else if (client.categories.has(select)) {
      const category = client.categories.get(select)
      if (category) {
        return await interaction.update({
          ...(Pages.category(category, client) as InteractionUpdateOptions),
        })
      }
    }

    return await interaction.reply({
      content: 'Unknown category',
      ephemeral: true,
    })
  },
})
