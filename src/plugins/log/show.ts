import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  Message,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/interactions/validate'
import responder from '../../utils/helpers/responder'

import { Action } from '../../models/action'
import store from '../../utils/helpers/store'

import prevPage from './prev-page'
import nextPage from './next-page'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('show-log')
    .setDescription('Shows log')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  event: Events.InteractionCreate,

  devsOnly: true,
  testOnly: true,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      const { user, guildId } = interaction

      const invalidations = await validateInteraction(this, user, guildId)

      if (invalidations.size) {
        return await responder.deny.reply(
          interaction,
          invalidations,
          this.data.name
        )
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const logMessage: string = store
      .get('log')
      .map((l: string) => l.trim())
      .slice(localState.page * 10, (localState.page + 1) * 10)
      .join('')

    return await interaction.reply({
      content: logMessage || 'No log provided',
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          prevPage.data,
          nextPage.data
        ),
      ],
    })
  },
} as Action

export const localState: {
  page: number
} = {
  page: 0,
}
