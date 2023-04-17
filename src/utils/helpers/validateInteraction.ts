import { Collection, User } from 'discord.js'
import { Action } from '../../models/action'
import logger from './logger'
import { getCooldown } from '../fetch/getCooldown'
import { devs, testServer } from '../../../config.json'

export async function validateInteraction(
  action: Action,
  user: User,
  guildId: string
): Promise<Collection<string, string[]>> {
  const reply: Collection<string, string[]> = new Collection()

  if (action.deleteble) {
    logger.warn(`${user.tag} - triggers <deleteble> action`)

    reply.set('deleteble', ['This action is marked to delete'])
  }

  if (action.testOnly) {
    logger.warn(`${user.tag} - triggers <test only> action`)

    if (guildId !== testServer) {
      reply.set('permissions', ['This action is only for test server'])
    }
  }

  if (action.devsOnly) {
    logger.warn(`${user.tag} - triggers <developers only> action`)

    if (!devs.includes(user.id)) {
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

  if (action.cooldown) {
    const cooldown = getCooldown(action, user)
    const now = Date.now()

    if (cooldown > now) {
      logger.warn(`${user.tag} - triggers <overheated> action`)

      reply.set('cooldown', [
        `This action is overheated. Cooldown <t:${Math.round(
          cooldown / 1000
        )}:R>`,
      ])
    }
  }

  return reply
}
