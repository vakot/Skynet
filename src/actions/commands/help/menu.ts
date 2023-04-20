import {
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  StringSelectMenuInteraction,
} from 'discord.js'

import { Action } from '../../../models/action'
import { Client } from '../../../models/client'

export default new Action({
  data: { name: 'help-category-select-menu' },

  event: Events.InteractionCreate,

  async init(interaction: StringSelectMenuInteraction, client: Client) {
    if (this.data.name !== interaction.customId) return

    return await this.execute(interaction, client)
  },
  async execute(interaction: StringSelectMenuInteraction, client: Client) {
    const category = interaction.values[0]

    if (!category) {
      return await interaction.reply({
        content: 'Unknown category',
        ephemeral: true,
      })
    }

    const commands = Array.from(
      client.localCommands
        .filter((command) => command.category === category)
        .values()
    ).sort((a, b) => (a.data.name < b.data.name ? -1 : 1))

    const embed = new EmbedBuilder()
      .setTitle(`About the **${category}** category`)
      .setDescription(
        '>>> Note that not all information is shown here. Some commands have restricted access but still can be called by anyone'
      )
      .setFooter({
        text: '<option> - required ・ (option) - optional',
        iconURL: client.user?.displayAvatarURL(),
      })

    commands.forEach((command, index) => {
      const { name, description, options } = command.data as SlashCommandBuilder

      let title = `\`/${name}\` ${options
        .map((option) => {
          const { name, required } = option.toJSON()

          return required || option instanceof SlashCommandSubcommandBuilder
            ? `\`<${name}>\``
            : `\`(${name})\``
        })
        ?.join('・')}`

      if (index % 2 === 0) {
        embed.addFields({
          name: ' ',
          value: ' ',
          inline: false,
        })
      }

      embed.addFields({
        name: title,
        value: description,
        inline: true,
      })
    })

    return await interaction.update({
      embeds: [embed],
    })
  },
})
