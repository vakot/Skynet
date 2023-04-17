import { Collection, Snowflake, User } from 'discord.js'

import store from './store'

import { Action } from '../../models/action'

export function getCooldown(action: Action, user: User): number {
  if (!action.cooldown) return 0

  if (!store.has('cooldowns')) {
    store.set(
      'cooldowns',
      new Collection<string, Collection<Snowflake, number>>()
    )
  }

  // action id > (user id > timestamp)
  const cooldowns: Collection<
    string,
    Collection<Snowflake, number>
  > = store.get('cooldowns')

  if (!cooldowns.has(action.id)) {
    cooldowns.set(action.id, new Collection())
  }

  const timestamps: Collection<Snowflake, number> = cooldowns.get(action.id)

  if (timestamps.has(user.id)) return timestamps.get(user.id)

  timestamps.set(user.id, Date.now() + action.cooldown)

  setTimeout(() => timestamps.delete(user.id), action.cooldown)

  return 0
}
