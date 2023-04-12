import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'
import { ISleshCommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder()
    .setName('bulk-delete')
    .setDescription('Delete bulk of messages')
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('The count of messages to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    const count = Number(interaction.options.get('count').value)

    if (count < 1 || count > 99)
      return await interaction.reply({
        content: '**Invalid count paramether!**\n> 0 < count < 100',
        ephemeral: true,
      })

    return await interaction.channel.bulkDelete(count).then(() => {
      interaction.reply({
        content: `Deleted ${count} messages`,
        ephemeral: true,
      })
    })
  },
} as ISleshCommand
