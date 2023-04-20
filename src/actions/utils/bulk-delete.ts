import {
  ChatInputCommandInteraction,
  Events,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js'

import { Action } from '../../models/Action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: '⚙️・Utilities',
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

  event: Events.InteractionCreate,

  cooldown: 10_000,

  async init(interaction: ChatInputCommandInteraction) {
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

    return await this.execute(interaction)
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const { channel } = interaction

    if (!(channel instanceof TextChannel)) return

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
