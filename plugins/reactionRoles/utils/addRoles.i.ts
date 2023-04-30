import { GuildMember, Snowflake } from 'discord.js'

export function addRoles(member: GuildMember, roles: Snowflake[]) {
  if (!roles.length) return

  return roles.forEach(async (role) => {
    await member.roles.add(role)
  })
}
