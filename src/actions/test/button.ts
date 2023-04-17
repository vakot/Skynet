import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Events,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/helpers/validateInteraction'
import responder from '../../utils/helpers/responder'

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

  async init(interaction: ButtonInteraction) {
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

  async execute(interaction: ButtonInteraction) {
    return await interaction.reply({
      content: `Button is working!`,
      ephemeral: true,
    })
  },
} as Action
