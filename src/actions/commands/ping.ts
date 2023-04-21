import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../models/action'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "Pong!"'),

  event: Events.InteractionCreate,

  async execute(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    return await interaction.reply({
      content: `:ping_pong: Pong!`,
      ephemeral: true,
    })
  },
})
