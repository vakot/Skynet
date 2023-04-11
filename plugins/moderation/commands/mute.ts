import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user!'),

  cooldown: 3000,

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: `${interaction.user.username} user muted`,
      ephemeral: true,
    })
  },
}
