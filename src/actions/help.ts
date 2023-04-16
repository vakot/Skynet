import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  EmbedBuilder,
  Collection,
} from 'discord.js'

import { nanoid } from 'nanoid'

import logger from '../utils/helpers/logger'

import { Action } from '../models/action'
import { isActionReady } from '../utils/conditions/isActionReady'
import store from '../utils/helpers/store'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
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

  event: Events.InteractionCreate,
  cooldown: 3000,

  async init(interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName == this.data.name &&
      (await isActionReady(this, interaction))
    )
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const commands = store
      .get('actions')
      .filter((action) => action.data?.name)
      .map((commandAction) => commandAction.data)

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
      embed
        .setTitle('Overview')
        .setDescription('List of all supported commands')

      CommandsEmbed(commands, embed)
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
} as Action

function CommandNotExistEmbed(command: string, embed: EmbedBuilder) {
  embed.addFields({
    name: `**\`/${command}\`**`,
    value: '> I dont kwon this command',
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
  const missing = commands.size % 3

  commands.forEach((command) => {
    const { name, description } = command

    embed.addFields({
      name: `**\`/${name}\`**`,
      value: `> ${description}`,
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
