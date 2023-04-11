import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../../../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick user from server!'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: `Pending...`,
      ephemeral: true,
    })
    return
  },
}
