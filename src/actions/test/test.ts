import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ClientEvents,
  StringSelectMenuBuilder,
} from 'discord.js'
import { Action } from '../../models/Action'
import { validateAction } from '../../utils/helpers/validateAction'

export default class SlashCommand extends Action {
  data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Testing features')
    .addSubcommand((command) =>
      command.setName('button').setDescription('Send test button')
    )
    .addSubcommand((command) =>
      command.setName('menu').setDescription('Send test menu')
    )
    .addSubcommand((command) =>
      command.setName('dms').setDescription('Send button to create DMs')
    )

  event: keyof ClientEvents = Events.InteractionCreate

  devsOnly = true
  testOnly = true

  async init(interaction: ChatInputCommandInteraction): Promise<any> {
    if (interaction.commandName !== this.data.name) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({ content: invalidation, ephemeral: true })
    }

    return await this.execute(interaction)
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
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
  }
}
