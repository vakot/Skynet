import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../../../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban user on server!'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: `Pending...`,
      ephemeral: true,
    })
    return
  },
}
