import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder().setName('test').setDescription('TEST!'),

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: 'TEST',
    })
  },
}
