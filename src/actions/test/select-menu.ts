import {
  Events,
  Interaction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js'

import { isActionReady } from '../../utils/conditions/isActionReady'

import { Action } from '../../models/action'

export default {
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

  async init(interaction: Interaction) {
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === this.data.data.custom_id &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: StringSelectMenuInteraction) {
    return await interaction.reply({
      content: `Menu is working!`,
      ephemeral: true,
    })
  },
} as Action
