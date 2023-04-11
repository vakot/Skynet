import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'
import { ISleshCommand } from '../models/command'

export default <ISleshCommand>{
  data: new SlashCommandBuilder()
    .setName('send-embed')
    .setDescription('Sending an embed!'),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    const actionRowComponent1 = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select')
        .setOptions(
          { label: '123', value: '123' },
          { label: '321', value: '321' }
        )
    )
    const actionRowComponent3 = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select2')
        .setOptions(
          { label: '2.123', value: '2.123' },
          { label: '2.321', value: '2.321' }
        )
    )

    const actionRowComponent2 = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId('button')
        .setLabel('Button')
        .setStyle(ButtonStyle.Success)
    )

    // Thats sucks but IDK -_-
    // @ts-ignore
    await interaction.reply({
      content: 'Button testing message',
      components: [
        actionRowComponent1.toJSON(),
        actionRowComponent3.toJSON(),
        actionRowComponent2.toJSON(),
      ],
    })
  },
}
