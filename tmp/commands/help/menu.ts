import { EmbedBuilder, Events, SlashCommandBuilder, StringSelectMenuInteraction } from 'discord.js'

import { Action } from '../../../modules/models/action'
import { Client } from '../../../modules/models/client'
import { generateCommandUsage } from '../../../utils/helpers/getCommandUsage'

export default new Action({
  data: { name: 'help-category-select-menu' },

  event: Events.InteractionCreate,

  async init(interaction: StringSelectMenuInteraction, client: Client) {
    if (this.data.name !== interaction.customId) return

    return await this.execute(interaction, client)
  },

  async execute(interaction: StringSelectMenuInteraction, client: Client) {
    const category = client.categories.find((category) => category.name === interaction.values[0])

    if (!category) {
      return await interaction.reply({
        content: 'Unknown category',
        ephemeral: true,
      })
    }

    const commands = Array.from(
      client.localCommands.filter((command) => command.category === category.name).values()
    ).sort((a, b) => (a.data.name < b.data.name ? -1 : 1))

    const embed = new EmbedBuilder()
      .setTitle(`About the **\`\`\` ${category.getName()} \`\`\`** category`)

      .setFooter({
        text: '<option> - required ・ (option) - optional',
        iconURL: client.user?.displayAvatarURL(),
      })

    if (category.description) {
      embed.setDescription(`>>> ${category.description}`)
    }

    commands.forEach((command, index) => {
      if (index % 2 === 0) {
        embed.addFields({
          name: ' ',
          value: ' ',
          inline: false,
        })
      }

      const usage = generateCommandUsage(command.data as SlashCommandBuilder)
        .map((option) => `\`${option}\``)
        .join(' ')

      embed.addFields({
        name: usage || 'Unknown command',
        value: command.data.description || 'Command have no description',
        inline: true,
      })
    })

    return await interaction.update({
      embeds: [embed],
    })
  },
})
