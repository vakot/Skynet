import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/interactions/validate'
import responder from '../../utils/helpers/responder'

import store from '../../utils/helpers/store'

import { Action } from '../../models/action'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show information about application commands')
    .addStringOption(
      (option) =>
        option
          .setName('command')
          .setDescription('Show more information about specific command')
          .setRequired(false)
      // TODO: Choises
    ),

  event: Events.InteractionCreate,
  cooldown: 6000,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      const { user, guildId } = interaction

      const invalidations = await validateInteraction(this, user, guildId)

      if (invalidations.size) {
        return await responder.deny.reply(
          interaction,
          invalidations,
          this.data.name
        )
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const commands = await store
      .get('actions')
      .filter((action) => action.data?.name)
      .map((commandAction) => commandAction.data)

    const commandOption = interaction.options.getString('command')

    const embed = new EmbedBuilder()

    if (commandOption) {
      embed.setTitle('Command information')

      const command = commands.find((cmd) => cmd.name === commandOption)

      if (command) {
        await CommandExistEmbed(command, embed)
      } else {
        await CommandNotExistEmbed(commandOption, embed)
      }
    } else {
      embed
        .setTitle('Overview')
        .setDescription('List of all supported commands')

      await CommandsEmbed(commands, embed)
    }

    return await interaction.reply({ embeds: [embed.setTimestamp()] })
  },
} as Action

function CommandNotExistEmbed(command: string, embed: EmbedBuilder) {
  embed.addFields({
    name: `**\`/${command}\`**`,
    value: ">>> I don't know this command",
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
      value: `>>> \`/${name}${optionSting}\``,
    },
    {
      name: '**Description**',
      value: `>>> ${description}`,
    }
  )
}

function CommandsEmbed(commands: any[], embed: EmbedBuilder) {
  const missing = commands.length % 3

  commands.forEach((command) => {
    const { name, description } = command

    embed.addFields({
      name: `**\`/${name}\`**`,
      value: `>>> ${description}`,
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
