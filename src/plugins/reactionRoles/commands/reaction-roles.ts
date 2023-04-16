import {
  ChatInputCommandInteraction,
  Events,
  Interaction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import isActionReady from '../../../utils/conditions/isActionReady'

import { Action } from '../../../models/action'

import menu from '../components/reaction-roles-menu'

export default {
  data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Reaction roles plugin commands')
    .addSubcommand((command) =>
      command.setName('send').setDescription('Send reaction roles message')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  event: Events.InteractionCreate,
  cooldown: 60000,

  async init(interaction: Interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === this.data.name &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand == 'send') {
      return await interaction.channel.send({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            menu.data
          ),
        ],
      })
    }
  },
} as Action
