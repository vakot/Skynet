import {
  ChatInputCommandInteraction,
  Events,
  Interaction,
  SlashCommandBuilder,
} from 'discord.js'

import isActionReady from '../utils/conditions/isActionReady'

import { IAction } from '../models/action'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "Pong!"'),

  event: Events.InteractionCreate,
  cooldown: 3000,

  async init(interaction: Interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === this.data.name &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: `:ping_pong: Pong!`,
      ephemeral: true,
    })
  },
} as IAction
