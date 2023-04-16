import { User } from 'discord.js'
import { Action } from '../../models/action'
import logger from './logger'
import { getCooldown } from '../fetch/getCooldown'
import { devs, testServer } from '../../../config.json'

export async function validateInteraction(
  action: Action,
  user: User,
  guildId: string
): Promise<string[]> {
  const reply: string[] = []

  if (action.deleteble) {
    logger.warn(`${user.tag} - triggers <deleteble> action`)

    reply.push('This action is marked to delete')
  }

  if (action.testOnly) {
    logger.warn(`${user.tag} - triggers <test only> action`)

    if (guildId !== testServer) {
      reply.push('This action is only for test server')
    }
  }

  if (action.devsOnly) {
    logger.warn(`${user.tag} - triggers <developers only> action`)

    if (!devs.includes(user.id)) {
      reply.push('This action is only for developers')
    }
  }

  if (action.cooldown) {
    const cooldown = getCooldown(action, user)
    const now = Date.now()

    if (cooldown > now) {
      logger.warn(`${user.tag} - triggers <overheated> action`)

      reply.push(
        `This action is overheated. Cooldown <t:${Math.round(
          cooldown / 1000
        )}:R>`
      )
    }
  }

  return reply
}
