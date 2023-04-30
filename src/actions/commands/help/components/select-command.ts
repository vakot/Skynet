import { StringSelectMenuInteraction, InteractionUpdateOptions } from 'discord.js'

import { Action } from '../../../../modules/models/action'
import { ActionEvents } from '../../../../modules/libs/events'
import { SkynetClient } from '../../../../modules/models/client'

import { Pages } from '../models/pages.i'
import Validator from '../../../../utils/helpers/validator'

export default new Action({
  data: { name: 'help-select-menu-command' },

  event: ActionEvents.SelectMenuInteraction,

  async execute(interaction: StringSelectMenuInteraction, client: SkynetClient) {
    const select = interaction.values[0]

    if (select === 'return') {
      return await interaction.update({
        ...(Pages.commands(client) as InteractionUpdateOptions),
      })
    } else if (client.localCommands.has(select)) {
      const command = client.localCommands.get(select)
      if (command) {
        return await interaction.update({
          ...(Pages.command(
            command,
            Validator.action(command, interaction.user, interaction.guild).length > 0
          ) as InteractionUpdateOptions),
        })
      }
    }

    return await interaction.reply({
      content: 'Unknown command',
      ephemeral: true,
    })
  },
})
