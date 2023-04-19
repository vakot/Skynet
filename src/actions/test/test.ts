import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ClientEvents,
} from 'discord.js'
import { Action } from '../../models/Action'
import { validateAction } from '../../utils/helpers/validateAction'

export default class TestCommand extends Action {
  data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Testing features')

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
    const button = new ButtonBuilder()
      .setCustomId('test-button')
      .setLabel('Click!')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    return await interaction.reply({
      content: 'test',
      ephemeral: true,
      components: [row],
    })
  }
}
