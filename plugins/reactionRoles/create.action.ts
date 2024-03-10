import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { ICategory } from '@modules/models/category'

import { roles } from './config.json'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('create-reaction-roles')
    .setDescription("Send's reaction roles menu")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  event: ActionEvents.CommandInteraction,

  category: {
    name: 'Reaction Roles',
    description: 'Reaction-roles commands group',
    emoji: '🎭',
    private: true,
  } as ICategory,

  cooldown: 120_000,

  async execute(interaction: ChatInputCommandInteraction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('reaction-roles-select-menu')
      .setPlaceholder('Select a role to get it!')
      .setOptions(...roles)
      .setMinValues(0)
      .setMaxValues(roles.length)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)

    return await interaction.channel?.send({
      components: [row],
    })
  },
})
