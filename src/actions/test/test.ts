import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: '🔒・Testing',
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Testing some features')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('button')
        .setDescription('Send test button')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('menu')
        .setDescription('Send test select menu')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('dms')
        .setDescription('Send button to create DMs')
    ),

  event: Events.InteractionCreate,

  devsOnly: true,
  testOnly: true,
  cooldown: 20_000,

  async execute(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    if (interaction.options.getSubcommand() === 'button') {
      const button = new ButtonBuilder()
        .setCustomId('test-button')
        .setLabel('Click!')
        .setStyle(ButtonStyle.Danger)

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

      return await interaction.reply({
        ephemeral: true,
        components: [row],
      })
    }

    if (interaction.options.getSubcommand() === 'menu') {
      const options = [
        { label: 'Number 1', value: '1' },
        { label: 'Number 2', value: '2' },
        { label: 'Number 3', value: '3' },
        { label: 'Number 4', value: '4' },
        { label: 'Number 5', value: '5' },
      ]
      const menu = new StringSelectMenuBuilder()
        .setCustomId('test-menu')
        .addOptions(...options)
        .setMinValues(0)
        .setMaxValues(options.length)

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        menu
      )

      return await interaction.reply({
        ephemeral: true,
        components: [row],
      })
    }

    if (interaction.options.getSubcommand() === 'dms') {
      const button = new ButtonBuilder()
        .setCustomId('test-button-send-dm')
        .setLabel('Send DM!')
        .setStyle(ButtonStyle.Secondary)

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

      return await interaction.reply({
        ephemeral: true,
        components: [row],
      })
    }

    return await interaction.reply({
      content: 'Unknown subcommand',
      ephemeral: true,
    })
  },
})
