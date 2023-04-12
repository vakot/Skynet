import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  APISelectMenuOption,
  // RoleSelectMenuBuilder,
} from 'discord.js'
import { ISleshCommand } from '../../../../models/command'
import { logger } from '../../../../utils/logger'

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
  data: new SlashCommandBuilder()
    .setName('send-reactio-roles-message')
    .setDescription('Sends reactio roles message!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    // SUCKS CAUSE THERE IS NO WAY TO SET AN POSSIBLE OPTIONS >_<
    // const roleSelectMenuTEST = new RoleSelectMenuBuilder()
    //   .setCustomId('select-role-component-test')
    //   .setPlaceholder('Select a role to get it!')
    //   .setMaxValues(4)
    //   .setMinValues(2)

    const roleSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('select-role-component')
      .setPlaceholder('Select a role to get it!')
      .setOptions(...roles)
      .setMinValues(0)
      .setMaxValues(roles.length)

    return await interaction.channel
      .send({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            roleSelectMenu
          ),
          // new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
          //   roleSelectMenuTEST
          // ),
        ],
      })
      .catch(logger.error)
  },
} as ISleshCommand
