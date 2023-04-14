import {
  StringSelectMenuInteraction,
  Events,
  GuildMemberRoleManager,
  GuildMember,
  Snowflake,
  EmbedBuilder,
} from 'discord.js'
import { IAction } from '../../../models/action'
import { logger } from '../../../utils/logger'
import { isInCooldown } from '../../../utils/cooldownHandler'

const possibleRoles = [
  '1074021128022007889',
  '1074301567332790303',
  '1077919290193354752',
  '1077919306005884998',
  '1077919321998761994',
]

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
  data: {
    name: 'reaction-roles-menu-handle',
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (
      interaction.isStringSelectMenu() &&
      interaction.commandName == this.data.name &&
      !isInCooldown(interaction)
    )
      return this.execute(interaction).catch(logger.error)
  },

  async execute(interaction: StringSelectMenuInteraction) {
    const memberRoles = interaction.member.roles as GuildMemberRoleManager

    const selectedRoles = interaction.values

    const addedRoles = []
    const removedRoles = []

    possibleRoles.map((role) => {
      if (selectedRoles.includes(role) && !memberRoles.cache.has(role))
        addedRoles.push(role)
      else if (!selectedRoles.includes(role) && memberRoles.cache.has(role))
        removedRoles.push(role)
    })

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
    // UwU
    // .setImage(
    //   'https://cdn.discordapp.com/attachments/1076287941275549696/1076294598546169936/skyline_EMPTY.png'
    // )

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  },
} as IAction
