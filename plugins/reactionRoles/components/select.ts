import {
  StringSelectMenuInteraction,
  GuildMemberRoleManager,
  EmbedBuilder,
  GuildMember,
  Snowflake,
} from 'discord.js'
import { IComponent } from '../../../models/component'
import { logger } from '../../../utils/logger'

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
    name: 'select-role-component',
  },

  cooldown: 300,

  async execute(interaction: StringSelectMenuInteraction) {
    if (interaction.member.user.bot) return

    const memberRoles = interaction.member.roles as GuildMemberRoleManager
    const selectedRoles = interaction.values

    // BULK ADD AND REMOVE ISN'T WORKING AND IDK WHY
    // const rolesToAdd = []
    // const rolesToRemove = []

    // possibleRoles.map((role) => {
    //   if (selectedRoles.includes(role) && !memberRoles.cache.has(role))
    //     rolesToAdd.push(role )
    //   else if (!selectedRoles.includes(role) && memberRoles.cache.has(role))
    //     rolesToRemove.push(role )
    // })

    // memberRoles
    //   .remove(rolesToRemove)
    //   .then(() => logger.log('roles removed'))
    //   .catch(logger.error)

    // memberRoles
    //   .add(rolesToAdd)
    //   .then(() => logger.log('roles added'))
    //   .catch(logger.error)

    const addedRoles = []
    const removedRoles = []

    possibleRoles.map((role) => {
      if (selectedRoles.includes(role) && !memberRoles.cache.has(role))
        addedRoles.push(role)
      else if (!selectedRoles.includes(role) && memberRoles.cache.has(role))
        removedRoles.push(role)
    })

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
} as IComponent
