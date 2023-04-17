import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/interactions/validate'
import responder from '../../utils/helpers/responder'

import { Action } from '../../models/action'

import menu from './select-menu'
import button from './button'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('send-button')
        .setDescription('Send test button')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('send-menu')
        .setDescription('Send select menu')
    ),

  event: Events.InteractionCreate,

  testOnly: true,
  devsOnly: true,

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
    if (interaction.options.getSubcommand() === 'send-button') {
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        button.data
      )

      return await interaction.reply({
        components: [row],
      })
    }

    if (interaction.options.getSubcommand() === 'send-menu') {
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        menu.data
      )

      return await interaction.reply({
        components: [row],
      })
    }
  },
} as Action
