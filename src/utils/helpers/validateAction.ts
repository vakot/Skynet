import { Collection, Guild, User } from 'discord.js'

import { Action } from '../../models/action'
import { client } from '../../index'

import logger from './logger'

import { devs, testServer } from '../../../config.json'

/**
 * function used to determine user access to provided action
 * need to be used with action that has at least one of the following properties:
 * { cooldown, deleteble, testOnly, devsOnly }
 * returns a message that descripe reason why action is dissalowed
 *
 * @param {Action} action - instance of Action class
 * @param {Guild} guild - guild instance provided by API
 * @param {User} user - user instance provided by API
 * @returns {string | undefined} - message that descripe reason why action is dissalowed
 */
export function validateAction(
  action: Action,
  guild: Guild | null,
  user: User | null
): string | undefined {
  if (!user) return 'Unknown user'
  if (!guild) return 'Unknown guild'

  // if deleteble
  if (action.deleteble) {
    logger.warn(`${user.tag} - triggers <deleteble> action`)
    return 'This action is marked to delete'
  }

  // if test only
  if (action.testOnly && guild.id !== testServer) {
    logger.warn(`${user.tag} - triggers <test only> action`)
    return 'This action is only for test server'
  }

  // if devs only
  if (action.devsOnly && !devs.includes(user.id)) {
    logger.warn(`${user.tag} - triggers <devs only> action`)
    return 'This action is only for developers'
  }

  // if overheated
  if (action.cooldown) {
    const timestamp = handleCooldown(action, user.id)
    if (timestamp) {
      logger.warn(`${user.tag} - triggers <overheated> action`)
      return `This action is overheated. Cooldown <t:${Math.round(
        timestamp * 0.001
      )}:R>`
    }
  }
}

/**
 * function to automatically handle users cooldowns
 * each action have own cooldonws coolection, where
 * each user have a timestamp of cooldown
 *
 * @param {Action} action - instance of Action class
 * @param {string} userId - userId provided by API
 * @returns {number | undefined} - timestamp where cooldown is over
 */
export function handleCooldown(
  action: Action,
  userId: string
): number | undefined {
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
