import {
  ChatInputCommandInteraction,
  Events,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'
import { isInCooldown } from '../../utils/cooldownHandler'

export default {
  data: {
    name: 'bulk-delete',
    command: new SlashCommandBuilder()
      .setName('bulk-delete')
      .setDescription('Delete bulk of messages')
      .addNumberOption((option) =>
        option
          .setName('count')
          .setDescription('The count of messages to delete')
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    cooldown: 10000,
  },

  async init(client: Client) {
    client.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) return
      if (interaction.commandName != this.data.name) return

      if (isInCooldown(interaction)) return

      return this.execute(interaction).catch(logger.error)
    })
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const count = Number(interaction.options.get('count').value)

    if (count < 1 || count > 99)
      return await interaction.reply({
        content: '**Invalid count paramether!**\n> 0 < count < 100',
        ephemeral: true,
      })

    return await interaction.channel
      .bulkDelete(count)
      .then((messages) => {
        interaction.reply({
          content: `Deleted ${messages.size} messages`,
          ephemeral: true,
        })
      })
      .catch(() =>
        interaction.reply({
          content: `Something went wrong while deleting messages`,
          ephemeral: true,
        })
      )
  },
} as IAction
