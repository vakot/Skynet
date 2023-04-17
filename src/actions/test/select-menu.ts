import {
  Events,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/helpers/validateInteraction'
import responder from '../../utils/helpers/responder'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  data: new StringSelectMenuBuilder()
    .setCustomId('test-select-menu')
    .setPlaceholder('You can choose a value')
    .setOptions(
      { label: '123', value: '123' },
      { label: '231', value: '231' },
      { label: '312', value: '312' }
    ),

  event: Events.InteractionCreate,

  testOnly: true,
  devsOnly: true,

  async init(interaction: StringSelectMenuInteraction) {
    if (interaction.customId === this.data.data.custom_id) {
      const { user, guildId } = interaction

      const invalidations = await validateInteraction(this, user, guildId)

      if (invalidations.size) {
        return await responder.deny.reply(
          interaction,
          invalidations,
          this.data.data.custom_id
        )
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: StringSelectMenuInteraction) {
    return await interaction.reply({
      content: `Menu is working!`,
      ephemeral: true,
    })
  },
} as Action
