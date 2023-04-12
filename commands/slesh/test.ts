import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder().setName('test').setDescription('TEST!'),

  cooldown: 10000,

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: 'TEST',
    })
  },
} as ISleshCommand
