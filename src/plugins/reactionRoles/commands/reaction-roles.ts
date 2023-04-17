import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../../utils/interactions/validate'
import responder from '../../../utils/helpers/responder'

import { Action } from '../../../models/action'

import menu from '../components/reaction-roles-menu'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Reaction roles plugin commands')
    .addSubcommand((command) =>
      command.setName('send').setDescription('Send reaction roles message')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  event: Events.InteractionCreate,
  cooldown: 60000,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      const invalidations = await validateInteraction(
        this,
        interaction.user,
        interaction.channelId
      )

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
