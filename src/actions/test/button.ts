import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Events,
  Interaction,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { isActionReady } from '../../utils/conditions/isActionReady'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  data: new ButtonBuilder()
    .setCustomId('test-button')
    .setLabel('Click!')
    .setStyle(ButtonStyle.Success),

  event: Events.InteractionCreate,

  testOnly: true,
  devsOnly: true,

  cooldown: 10000,

  async init(interaction: Interaction) {
    if (
      interaction.isButton() &&
      interaction.customId === this.data.data.custom_id &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: ButtonInteraction) {
    return await interaction.reply({
      content: `Button is working!`,
      ephemeral: true,
    })
  },
} as Action
