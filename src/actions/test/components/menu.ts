import { StringSelectMenuInteraction } from 'discord.js'

import { Action } from '../../../models/action'
import { ActionEvents } from '../../../models/event'

import logger from '../../../utils/helpers/logger'

export default new Action({
  data: { name: 'test-select-menu' },

  event: ActionEvents.SelectMenuInteraction,

  async execute(interaction: StringSelectMenuInteraction) {
    const { customId, user, values } = interaction

    logger.log(`${user.tag} interact with <${customId}>`)

    return await interaction.reply({
      content: customId + '\n' + values.sort().join(' | '),
      ephemeral: true,
    })
  },
})
