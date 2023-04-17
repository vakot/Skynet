import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "Pong!"'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: `:ping_pong: Pong!`,
      ephemeral: true,
    })
  },
} as Action
