import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

export default new Action({
  data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle current queue'),

  event: ActionEvents.CommandInteraction,

  cooldown: 10_000,
  deleteble: true,

  async execute(interaction: ChatInputCommandInteraction) {
    const { member } = interaction

    await interaction.deferReply({ ephemeral: true })

    if (!member) {
      return await interaction.followUp('Command can be executed only in server')
    }
  },
})
