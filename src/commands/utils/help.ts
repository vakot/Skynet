import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Collection,
} from 'discord.js'
import { ICommand } from '../../models/command'
import store from '../../utils/helpers/store'

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Get's information about a command")
    .addStringOption(
      (option) =>
        option
          .setName('command')
          .setDescription('Specific command to display indormation')
          .setRequired(false)
      // .addChoices(
      //   store
      //     .get('localCommands')
      //     .map((command) => ({ name: command.data.name, value: command.data.name }))
      // )
      // TODO: Choises
    ),

  cooldown: 3000,

  async execute(interaction: ChatInputCommandInteraction) {
    const commands = store.get('localCommands').map((command) => command.data)

    const commandOption = interaction.options.getString('command')

    const embed = new EmbedBuilder()

    if (commandOption) {
      embed.setTitle('Command information')

      const command = commands.find((cmd) => cmd.name === commandOption)

      if (command) {
        CommandExistEmbed(command, embed)
      } else {
        CommandNotExistEmbed(commandOption, embed)
      }
    } else {
      CommandsEmbed(commands, embed)
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
} as ICommand

function CommandNotExistEmbed(command: string, embed: EmbedBuilder) {
  embed.addFields({
    name: `**\`/${command}\`**`,
    value: '> Command is not exist',
  })
}

function CommandExistEmbed(command: any, embed: EmbedBuilder) {
  const { name, description, options } = command

  const optionSting = options.length ? ` [${options.map(({ name }) => name).join('|')}]` : ''

  embed.addFields(
    {
      name: '**Usage**',
      value: `> \`/${name}${optionSting}\``,
    },
    {
      name: '**Description**',
      value: `> ${description}`,
    }
  )
}

function CommandsEmbed(commands: Collection<string, any>, embed: EmbedBuilder) {
  embed.setTitle('Overview').setDescription('List of all supported commands')

  const missing = commands.size % 3

  commands.forEach((command) => {
    embed.addFields({
      name: `**\`/${command.name}\`**`,
      value: `> ${command.description}`,
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
