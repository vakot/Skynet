import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISleshCommand } from '../../models/command'

import { EmbedBuilder } from '@discordjs/builders'
import { skynet } from '../../src'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gets information about a command')
    .addStringOption(
      (option) =>
        option
          .setName('command')
          .setDescription('Specific command to display indormation')
          .setRequired(false)
      // TODO: Choises
    ),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    const { commands } = skynet

    const commandOption = interaction.options.getString('command')

    let embed = new EmbedBuilder()

    if (commandOption) {
      embed.setTitle('Command information')

      if (commands.slesh.has(commandOption)) {
        const command = commands.slesh.get(commandOption)

        embed.addFields(
          {
            name: '**Usage**',
            value: `> \`/${command.data.name} ${
              command.data.options &&
              `[${command.data.options
                .map((option) => option.toJSON().name)
                .join('|')}]`
            }\``,
          },
          {
            name: '**Description**',
            value: `> ${command.data.description}`,
          }
        )
      } else {
        embed.addFields({
          name: `**\`/${commandOption}\`**`,
          value: '> is not exist',
        })
      }
    } else {
      embed
        .setTitle('Overview')
        .setDescription('List of all supported commands')

      const missing = Array.from(commands.slesh.values()).length % 3

      commands.slesh.forEach((command) => {
        embed.addFields({
          name: `**\`/${command.data.name}\`**`,
          value: `> ${command.data.description}`,
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
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
}
