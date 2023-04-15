import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js'

import { ICommand } from '../../models/command'
import menuHandler from './select-menu.component'
import store from '../../utils/store'

export default {
  data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Reaction roles plugin commands')
    .addSubcommand((command) =>
      command.setName('send').setDescription('Send reaction roles message')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  cooldown: 60000,

  async callback(interaction: ChatInputCommandInteraction) {
    const menu = menuHandler.data as StringSelectMenuBuilder

    const components = store.get('components')
    store.set('components', [menuHandler, ...components])

    const subcommand = interaction.options.getSubcommand()

    if (subcommand == 'send') {
      return await interaction.channel.send({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu),
        ],
      })
    }
  },
} as ICommand
