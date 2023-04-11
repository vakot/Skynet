import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  cooldown: 300,

  async execute(interaction: ChatInputCommandInteraction) {
    const latency = Date.now() - interaction.createdTimestamp
    return await interaction.reply({
      content: `Pong! In latency of ${latency}ms.`,
    })
  },
}
