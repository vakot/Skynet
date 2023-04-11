import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { ISleshCommand } from '../../../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a temporary voice channel!'),

  cooldown: 30000,

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.guild.channels.create({
      name: `${interaction.user.username}'s Room`,
      type: ChannelType.GuildVoice,
    })
    await interaction.reply({
      content: `${interaction.user.username} your room succesfully created!`,
      ephemeral: true,
    })
    return
  },
}
