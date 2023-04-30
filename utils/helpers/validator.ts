import {
  Collection,
  Guild,
  GuildChannel,
  GuildMember,
  PermissionResolvable,
  Snowflake,
  User,
  APIUser,
} from 'discord.js'

import { Action } from '@modules/models/action'

import logger from '@utils/helpers/logger'

import { client } from '../..'
import { devs, testServer } from '../../config.json'

/**
 * function to automatically handle users cooldowns
 * each action have own cooldonws coolection, where
 * each user have a timestamp of cooldown
 *
 * @param {Action} action - instance of Action class
 * @param {string} userId - userId provided by API
 * @returns {number | undefined} - timestamp where cooldown is over
 */
export function handleCooldown(action: Action, userId: string): number | undefined {
  if (!action.cooldown) return

  if (!client.cooldowns.has(action.data.name)) {
    client.cooldowns.set(action.data.name, new Collection())
  }

  const timestamps = client.cooldowns.get(action.data.name)

  if (timestamps?.has(userId)) {
    // if user have cooldown - return it
    return timestamps?.get(userId)
  } else {
    // if user DONT have cooldown - create it
    timestamps?.set(userId, action.cooldown + Date.now())
    setTimeout(() => timestamps?.delete(userId), action.cooldown)
  }
}

export function isDeveloper(user: User | APIUser): boolean {
  if (!devs || !devs.length) return false
  return devs.includes(user.id)
}

export function isTest(guild: Guild): boolean {
  if (!testServer) return false
  return testServer === guild.id
}

export function hasAllChannelPermissions(
  user: User,
  channel: GuildChannel,
  permissions: PermissionResolvable[]
): boolean {
  const userPermissions = channel.permissionsFor(user, true)
  if (permissions.every((permission) => userPermissions?.has(permission, true))) return true
  return false
}

export function hasAnyChannelPermissions(
  user: User,
  channel: GuildChannel,
  permissions: PermissionResolvable[]
): boolean {
  const userPermissions = channel.permissionsFor(user, true)
  if (permissions.some((permission) => userPermissions?.has(permission, true))) return true
  return false
}

export function hasAllGuildPermissions(
  permissions: PermissionResolvable[],
  member: GuildMember
): boolean {
  const userPermissions = member.permissions
  if (permissions.every((permission) => userPermissions.has(permission, true))) return true
  return false
}

export function hasAnyGuildPermissions(
  member: GuildMember,
  permissions: PermissionResolvable[]
): boolean {
  const userPermissions = member.permissions
  if (permissions.some((permission) => userPermissions.has(permission, true))) return true
  return false
}

export function hasAllRoles(member: GuildMember, roles: Snowflake[]): boolean {
  const userRoles = member.roles.cache
  if (userRoles.hasAll(...roles)) return true
  return false
}

export function hasAnyRoles(member: GuildMember, roles: Snowflake[]): boolean {
  const userRoles = member.roles.cache
  if (userRoles.hasAny(...roles)) return true
  return false
}

export function action(action: Action, user: User, guild?: Guild | null): string[] {
  const invalidations: string[] = []

  // cooldown
  if (action.cooldown) {
    const timestamp = handleCooldown(action, user.id)

    if (timestamp) {
      const hammertime = `<t:${Math.round(timestamp * 0.001)}:R>`
      invalidations.push(`Action is \`overheated\`. Cooldown ${hammertime}`)
      logger.warn(`${user.tag} called <overheated> action <${action.data.name}>`)
    }
  }

  // devsOnly
  if (action.devsOnly && !isDeveloper(user)) {
    invalidations.push(`Actions is \`devs-only\``)
    logger.warn(`${user.tag} called <devs-only> action <${action.data.name}>`)
  }

  // testOnly
  if (action.testOnly && guild && !isTest(guild)) {
    invalidations.push(`Actions is \`test-server-only\``)
    logger.warn(`${user.tag} called <test-server-only> action <${action.data.name}>`)
  }

  // deleteble
  if (action.deleteble) {
    invalidations.push(`Actions is \`deleted\``)
    logger.warn(`${user.tag} called <deleted> action <${action.data.name}>`)
  }

  return invalidations
}

const Validator = {
  handleCooldown,
  isDeveloper,
  isTest,
  hasAllChannelPermissions,
  hasAnyChannelPermissions,
  hasAllGuildPermissions,
  hasAnyGuildPermissions,
  hasAllRoles,
  hasAnyRoles,
  action,
}

export default Validator
