import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Events,
  ClientEvents,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js'

import { Action } from '../../models/Action'
import { validateAction } from '../../utils/helpers/validateAction'

export default class SlashCommand extends Action {
  data = new SlashCommandBuilder()
    .setName('bulk-delete')
    .setDescription('Delete a bulk of messages')
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('Count messages to delete (from 1 to 99)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

  event: keyof ClientEvents = Events.InteractionCreate

  cooldown = 10_000

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
  }
}
