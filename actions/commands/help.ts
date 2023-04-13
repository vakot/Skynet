import {
  ChatInputCommandInteraction,
  Events,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  Collection,
} from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'
import { skynet } from '../../src'
import { isInCooldown } from '../../utils/cooldownHandler'

export default {
  data: {
    name: 'help',
    command: new SlashCommandBuilder()
      .setName('help')
      .setDescription("Get's information about a command")
      .addStringOption(
        (option) =>
          option
            .setName('command')
            .setDescription('Specific command to display indormation')
            .setRequired(false)
        // TODO: Choises
      ),
    cooldown: 3000,
  },

  async init(client: Client) {
    client.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) return
      if (interaction.commandName != this.data.name) return

      if (isInCooldown(interaction)) return

      return this.execute(interaction).catch(logger.error)
    })
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const { commands } = skynet

    const commandOption = interaction.options.getString('command')

    const embed = new EmbedBuilder()

    if (commandOption) {
      embed.setTitle('Command information')

      if (commands.has(commandOption)) {
        const command = commands.get(commandOption)

        CommandExistEmbed(command, embed)
      } else {
        CommandNotExistEmbed(commandOption, embed)
      }
    } else {
      CommandsEmbed(commands, embed)
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
} as IAction

function CommandNotExistEmbed(command: string, embed: EmbedBuilder) {
  embed.addFields({
    name: `**\`/${command}\`**`,
    value: '> is not exist',
  })
}

function CommandExistEmbed(command: any, embed: EmbedBuilder) {
  const { name, description, options } = command

  const optionSting = options.length
    ? ` [${options.map(({ name }) => name).join('|')}]`
    : ''

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
