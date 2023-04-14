import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  APISelectMenuOption,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'
import { isInCooldown } from '../../../utils/cooldownHandler'

const roles: APISelectMenuOption[] = [
  {
    label: 'Lvl 0',
    value: '1074021128022007889',
    description: 'Member',
    emoji: { name: '🎉' },
  },
  {
    label: 'Lvl 5',
    value: '1074301567332790303',
    description: 'Member+',
    emoji: { name: '🍺' },
  },
  {
    label: 'Lvl 25',
    value: '1077919290193354752',
    description: 'Veteran',
    emoji: { name: '💪' },
  },
  {
    label: 'Lvl 50',
    value: '1077919306005884998',
    description: 'Master',
    emoji: { name: '😇' },
  },
  {
    label: 'Lvl 100',
    value: '1077919321998761994',
    description: 'Legend',
    emoji: { name: '👑' },
  },
]

export default {
  data: {
    name: 'send-reaction-roles-message',
    command: new SlashCommandBuilder()
      .setName('send-reaction-roles-message')
      .setDescription('Sends reactio roles message!')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    cooldown: 60000,
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName == this.data.name &&
      !isInCooldown(interaction)
    )
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    // SUCKS CAUSE THERE IS NO WAY TO SET UP AN POSSIBLE OPTIONS >_<
    // const roleSelectMenuTEST = new RoleSelectMenuBuilder()
    //   .setCustomId('reaction-roles-menu-handle')
    //   .setPlaceholder('Select a role to get it!')
    //   .setMaxValues(4)
    //   .setMinValues(2)

    const roleSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('reaction-roles-menu-handle')
      .setPlaceholder('Select a role to get it!')
      .setOptions(...roles)
      .setMinValues(0)
      .setMaxValues(roles.length)

    return await interaction.channel.send({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          roleSelectMenu
        ),
      ],
    })
  },
} as IAction
