import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js'

import { ICommand } from '../../../models/command'
import menuHandler from '../components/reaction-roles-menu'

export default {
  data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Reaction roles plugin commands')
    .addSubcommand((command) =>
      command.setName('send').setDescription('Send reaction roles message')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  cooldown: 60000,

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand == 'send') {
      const menu = menuHandler.data as StringSelectMenuBuilder

      return await interaction.channel.send({
        components: [new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)],
      })
    }
  },
} as ICommand
