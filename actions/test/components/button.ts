import { ButtonInteraction } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'test-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    const { customId, user } = interaction

    logger.log(`${user.tag} interact with <${customId}>`)

    return await interaction.reply({
      content: customId,
      ephemeral: true,
    })
  },
})
