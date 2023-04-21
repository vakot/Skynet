import { Events, StringSelectMenuInteraction } from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: '🔒・Testing',
  data: { name: 'test-menu' },

  event: Events.InteractionCreate,

  devsOnly: true,
  testOnly: true,

  async execute(interaction: StringSelectMenuInteraction) {
    if (this.data.name !== interaction.customId) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await interaction.reply({
      content: 'Selected values: ' + interaction.values.sort().join(' | '),
      ephemeral: true,
    })
  },
})
