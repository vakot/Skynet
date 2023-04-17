import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Events,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { Action } from '../../models/action'
import { localState } from './show'
import store from '../../utils/helpers/store'

export default {
  id: nanoid(),

  data: new ButtonBuilder()
    .setCustomId('log-next-page-button')
    .setLabel('Next')
    .setStyle(ButtonStyle.Secondary),

  event: Events.InteractionCreate,

  async init(interaction: ButtonInteraction) {
    if (interaction.customId === this.data.data.custom_id) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: ButtonInteraction) {
    const message = localState.message

    if (localState.page * 10 <= store.get('log').length) localState.page++

    const logMessage: string = store
      .get('log')
      .map((l: string) => l.trim())
      .slice(localState.page * 10, (localState.page + 1) * 10)
      .join('')

    return await message
      .edit({ content: logMessage || 'No log provided' })
      .then(() => interaction.deferReply({ ephemeral: true }))
      .then(() => interaction.deleteReply())
  },
} as Action
