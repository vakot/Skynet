import { GuildMember, PermissionFlagsBits } from 'discord.js'

import { supportRoles } from '../config.json'

export function isSupport(member: GuildMember): boolean {
  return (
    member.roles.cache.hasAny(...supportRoles) ||
    member.permissions.has(PermissionFlagsBits.Administrator)
  )
}
