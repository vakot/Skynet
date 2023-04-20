import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../models/Action'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('update-avatar')
    .setDescription('Delete bulk of messages'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    return await this.execute(interaction)
  },
  async execute(interaction: ChatInputCommandInteraction) {},
})
