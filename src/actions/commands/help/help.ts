import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '../../../models/action'
import { Client } from '../../../models/client'

import { validateAction } from '../../../utils/helpers/validateAction'
import { generateCommandUsage } from '../../../utils/helpers/generateCommandUsage'

export default new Action({
  category: 'About',

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
      const command = commands.find((cmd) => cmd.data.name === commandOption)

      if (!command) {
        return await interaction.reply({
          content: 'Unknown command',
          ephemeral: true,
        })
      }

      const { description } = command.data as SlashCommandBuilder

      const invalidation = validateAction(
        command,
        interaction.guild,
        interaction.user
      )

      const category = client.categories.get(command.category ?? 'General')

      const usage = generateCommandUsage(
        command.data as SlashCommandBuilder
      ).join(' ')

      // Usage                Category
      // [command usage]      [category]
      // Description          Accessibility
      // [command desciption] [Allowed | Disallowed]
      const embed = new EmbedBuilder().addFields(
        {
          name: 'Usage',
          value: `\`\`\`${usage || 'Unknown command'}\`\`\``,
          inline: true,
        },
        {
          name: 'Category',
          value: `\`\`\`${category?.getName() || 'Unknown category'}\`\`\``,
          inline: true,
        },
        { name: ' ', value: ' ' },
        {
          name: 'Description',
          value: `\`\`\`${description || '-'}\`\`\``,
          inline: true,
        },
        {
          name: 'Accessibility',
          value: `\`\`\`${invalidation ? 'Disallowed' : 'Allowed'}\`\`\``,
          inline: true,
        }
      )

      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      })
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-category-select-menu')
      .setPlaceholder('Choose a category')

    const embed = new EmbedBuilder()
      .setTitle(`About **\`\`\` ${client.user?.username} \`\`\`** commands`)
      .setDescription(
        ">>> Commands separated to categories. Please, choose a category below to see more information about it's commands"
      )
      .setFooter({
        text: 'Commands list may be updated in future',
        iconURL: client.user?.displayAvatarURL(),
      })

    // Category
    // [all] [category] [commands]
    client.categories.forEach((category) => {
      const categoryCommands = commands.filter(
        (command) => command.category === category.name
      )

      if (!categoryCommands.size) return

      const name = category.getName() + ' commands'

      const value = categoryCommands
        .sort()
        .map((command) => `\`/${command.data.name}\``)
        .join('・')

      embed.addFields({ name: name, value: value })

      menu.addOptions({
        label: category.name,
        value: category.name,
        description: category.description,
        emoji: category.emoji,
      })
    })

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      menu
    )

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
      components: [row],
    })
  },
})
