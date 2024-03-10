import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionCategories } from '@modules/libs/categories'
import { ActionEvents } from '@modules/libs/events'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('bulk-delete')
    .setDescription('Delete bulk of messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('Count of messages to delete (from 1 to 99)')
        .setRequired(true)
    ),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.Utils,

  async execute(interaction: ChatInputCommandInteraction) {
    const { channel } = interaction

    if (!channel || !channel.isTextBased() || channel.isDMBased()) return

    const count = interaction.options.getNumber('count')

    if (!count || count > 99 || count < 0)
      return await interaction.reply({
        content: '**Invalid <count> paramether!**\n> Enter value from 1 to 99',
        ephemeral: true,
      })

    return await channel.bulkDelete(count).then((messages) => {
      interaction.reply({
        content: `${messages.size} messages was deleted`,
        ephemeral: true,
      })
    })
  },
})
