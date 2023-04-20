import { ButtonInteraction, Events } from 'discord.js'

import { Action } from '../../models/Action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: '🔒・Testing',
  data: { name: 'test-button-send-dm' },

  event: Events.InteractionCreate,

  devsOnly: true,
  testOnly: true,
  cooldown: 10_000,

  async init(interaction: ButtonInteraction) {
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

    return await this.execute(interaction)
  },
  async execute(interaction: ButtonInteraction) {
    await interaction.user.send('Test DM message')

    return await interaction.reply({
      content: 'DM message is sent',
      ephemeral: true,
    })
  },
})
