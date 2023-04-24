import { GuildMemberRoleManager } from 'discord.js'

import { supportRoles } from '../config.json'

export function isSupport(memberRoleManager: GuildMemberRoleManager): boolean {
  return memberRoleManager.cache.hasAny(...supportRoles)
}
