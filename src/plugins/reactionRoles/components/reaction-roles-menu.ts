import {
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  GuildMemberRoleManager,
  GuildMember,
  Snowflake,
  EmbedBuilder,
  Events,
  Interaction,
} from 'discord.js'

import logger from '../../../utils/helpers/logger'
import isActionReady from '../../../utils/conditions/isActionReady'

import { Action } from '../../../models/action'

import { roles } from '../config.json'

function addRoles(member: GuildMember, roles: Snowflake[]) {
  if (!roles.length) return

  return roles.forEach(async (role) => {
    await member.roles.add(role).catch(logger.error)
  })
}
function removeRoles(member: GuildMember, roles: Snowflake[]) {
  if (!roles.length) return

  return roles.forEach(async (role) => {
    await member.roles.remove(role).catch(logger.error)
  })
}

export default {
  data: new StringSelectMenuBuilder()
    .setCustomId('reaction-roles-menu')
    .setPlaceholder('Select a role to get it!')
    .setOptions(...roles)
    .setMinValues(0)
    .setMaxValues(roles.length),

  // SUCKS CAUSE THERE IS NO WAY TO SET UP AN POSSIBLE OPTIONS >_<
  // data: new RoleSelectMenuBuilder()
  //   .setCustomId('reaction-roles-menu-handle')
  //   .setPlaceholder('Select a role to get it!')
  //   .setOptions(...roles)
  //   .setMinValues(0)
  //   .setMaxValues(roles.length)

  event: Events.InteractionCreate,

  async init(interaction: Interaction) {
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === this.data.data.custom_id &&
      (await isActionReady(this, interaction))
    ) {
      return await this.execute(interaction)
    }
  },

  async execute(interaction: StringSelectMenuInteraction) {
    const memberRoles = interaction.member.roles as GuildMemberRoleManager
    const selectedRoles = interaction.values
    const possibleRoles = roles.map((role) => role.value)

    const addedRoles = possibleRoles.filter(
      (role) => selectedRoles.includes(role) && !memberRoles.cache.has(role)
    )
    const removedRoles = possibleRoles.filter(
      (role) => !selectedRoles.includes(role) && memberRoles.cache.has(role)
    )

    // BULK ADD AND REMOVE ISN'T WORKING AND IDK WHY
    // if (addedRoles.length)
    //   await (interaction.member.roles as GuildMemberRoleManager)
    //     .add(addedRoles)
    //     .then((member) => console.debug(member.roles.cache.keys()))
    //     .then(() => logger.log(`Added ${addedRoles.length} roles`))
    //     .catch(logger.error)

    // if (removedRoles.length)
    //   await (interaction.member.roles as GuildMemberRoleManager)
    //     .remove(removedRoles)
    //     .then((member) => console.debug(member.roles.cache.keys()))
    //     .then(() => logger.log(`Removed ${removedRoles.length} roles`))
    //     .catch(logger.error)

    addRoles(interaction.member as GuildMember, addedRoles)
    removeRoles(interaction.member as GuildMember, removedRoles)

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: 'Added roles:',
          value: `> ${
            addedRoles?.map((role) => `<@&${role}>`).join(' | ') || '-'
          }`,
        },
        {
          name: 'Removed roles:',
          value: `> ${
            removedRoles?.map((role) => `<@&${role}>`).join(' | ') || '-'
          }`,
        }
      )

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  },
} as Action
