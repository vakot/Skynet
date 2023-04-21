import { Collection, Client as DiscordClient, Snowflake } from 'discord.js'

import { Action } from './action'
import { Category } from './category'

export class Client extends DiscordClient {
  // name > body
  localActions = new Collection<string, Action>()
  // name > body
  localCommands = new Collection<string, Action>()
  // action-name > (user-id > timestamp in ms)
  cooldowns = new Collection<string, Collection<Snowflake, number>>()
  // name > body
  categories = new Collection<string, Category>()
}
