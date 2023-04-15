import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Events,
  Interaction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import isActionReady from '../../utils/conditions/isActionReady'

import { IAction } from '../../models/action'

import menu from './select-menu'
import button from './button'

export default {
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

  async init(interaction: Interaction) {
    // Condition that describe THIS interaction as a unique action
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === this.data.name &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
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
} as IAction
