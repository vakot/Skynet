import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '../../../models/Action'
import { Client } from '../../../models/Client'

export default new Action({
  category: '❓・About',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Information about commands')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Get information about specific command')
        .setRequired(false)
    ),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction, client: Client) {
    if (this.data.name !== interaction.commandName) return

    return await this.execute(interaction, client)
  },
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const commands = client.localCommands

    const commandOption = interaction.options.getString('command')

    if (commandOption) {
      // TODO: single command embed (i'm tired today)
    }

    const categories: string[] = [
      ...new Set<string>(commands.map((command) => command.category ?? '')),
    ]

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-category-select-menu')
      .setPlaceholder('Choose a category')
      .setOptions(
        ...categories.map((category) => ({
          label: category,
          value: category,
        }))
      )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      menu
    )

    const embed = new EmbedBuilder()
      .setTitle(`About **${client.user?.username}** commands`)
      .setDescription(
        '>>> Commands separated to categories. Please, choose a category below to see all commands in it'
      )
      .setFooter({
        text: 'Commands list may be updated in future',
        iconURL: client.user?.displayAvatarURL(),
      })

    categories.forEach((category) => {
      const categoryCommands = commands.filter(
        (command) => command.category === category
      )

      embed.addFields({
        name: category + ' commands',
        value:
          '' +
          categoryCommands
            .map((command) => `\`/${command.data.name}\``)
            .sort()
            .join('・'),
      })
    })

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
      components: [row],
    })
  },
})
