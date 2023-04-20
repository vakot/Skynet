import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Events,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

import { roles } from './config.json'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('create-reaction-roles')
    .setDescription("Send's reaction roles menu")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  event: Events.InteractionCreate,

  cooldown: 120_000,

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
    const menu = new StringSelectMenuBuilder()
      .setCustomId('reaction-roles-select-menu')
      .setPlaceholder('Select a role to get it!')
      .setOptions(...roles)
      .setMinValues(0)
      .setMaxValues(roles.length)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      menu
    )

    return await interaction.channel?.send({
      components: [row],
    })
  },
})
