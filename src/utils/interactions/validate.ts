import { Collection, User } from 'discord.js'

import { getCooldown } from '../helpers/getCooldown'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

import { devs, testServer } from '../../../config.json'

export async function validateInteraction(
  action: Action,
  user: User,
  guildId: string
): Promise<Collection<string, string[]>> {
  const reply: Collection<string, string[]> = new Collection()
  const report: string[] = []

  // if deleteble
  if (action.deleteble) {
    logger.warn(`${user.tag} - triggers <deleteble> action`)

    report.push('deleteble')

    reply.set('deleteble', ['This action is marked to delete'])
  }

  // if test only
  if (action.testOnly) {
    logger.warn(`${user.tag} - triggers <test only> action`)

    if (guildId !== testServer) {
      report.push('testOnly')

      reply.set('permissions', ['This action is only for test server'])
    }
  }

  // if devs only
  if (action.devsOnly) {
    logger.warn(`${user.tag} - triggers <developers only> action`)

    if (!devs.includes(user.id)) {
      report.push('devsOnly')

      if (reply.has('permissions')) {
        reply.set('permissions', [
          ...reply.get('permissions'),
          'This action is only for developers',
        ])
      } else {
        reply.set('permissions', ['This action is only for developers'])
      }
    }
  }

  // if overheated
  if (action.cooldown) {
    const cooldown = getCooldown(action, user)
    const now = Date.now()

    if (cooldown > now) {
      logger.warn(`${user.tag} - triggers <overheated> action`)

      report.push('cooldown')

      reply.set('cooldown', [
        `This action is overheated. Cooldown <t:${Math.round(
          cooldown / 1000
        )}:R>`,
      ])
    }
  }

  if (reply.size) {
    logger.error(`${user.tag} - interaction denied [${report.join(', ')}]`)
  }

  return reply
}
