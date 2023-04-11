import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../models/command'

import { EmbedBuilder } from '@discordjs/builders'
import { skynet } from '../../src'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display list of commands')
    .addStringOption(
      (option) =>
        option
          .setName('command')
          .setDescription('Get help about specific command')
          .setRequired(false)
      // TODO: Choises
    ),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    const { commands } = skynet

    const command = interaction.options.getString('command')

    let embed = new EmbedBuilder().setTitle('Help')

    if (command) {
      embed.setDescription(`Help to command \`/${command}\``)

      if (commands.slesh.has(command)) {
        const validCommand = commands.slesh.get(command)

        embed.addFields({
          name: `**\`/${validCommand.data.name}\`**`,
          value: `> ${validCommand.data.description}`,
        })
      } else {
        embed.addFields({
          name: `**\`/${command}\`**`,
          value: '> is not exist',
        })
      }
    } else {
      const missing = Array.from(commands.slesh.values()).length % 3

      commands.slesh.forEach((cmd) => {
        embed.addFields({
          name: `**\`/${cmd.data.name}\`**`,
          value: `> ${cmd.data.description}`,
          inline: true,
        })
      })

      for (let index = 0; index < missing; index++) {
        embed.addFields({
          name: ' ',
          value: ' ',
          inline: true,
        })
      }

      embed.setDescription('All supported commands')
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
}
