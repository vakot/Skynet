import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../../utils/interactions/validate'
import responder from '../../../utils/helpers/responder'

import { Action } from '../../../models/action'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('bulk-delete')
    .setDescription('Delete bulk od messages')
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('Number of meesages to delete (from 1 to 99)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  event: Events.InteractionCreate,
  cooldown: 10000,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      const { user, guildId } = interaction

      const invalidations = await validateInteraction(this, user, guildId)

      if (invalidations.size) {
        return await responder.deny.reply(
          interaction,
          invalidations,
          this.data.name
        )
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const count = interaction.options.getNumber('count')

    if (count < 1 || count > 99)
      return await interaction.reply({
        content: '**Invalid count paramether!**\n> Enter value from 1 to 99',
        ephemeral: true,
      })

    return await interaction.channel.bulkDelete(count).then((messages) => {
      interaction.reply({
        content: `Deleted ${messages.size} messages`,
        ephemeral: true,
      })
    })
  },
} as Action
