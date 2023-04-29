import { Collection, Client, Snowflake } from 'discord.js'

import { Action, DataBaseAction } from './action'

export class SkynetClient<Ready extends boolean = boolean> extends Client<Ready> {
  // name > body
  localActions = new Collection<string, Action>()
  // name > body
  dataBaseActions = new Collection<string, DataBaseAction>()
  // name > body
  localCommands = new Collection<string, Action>()
  // action-name > (user-id > timestamp in ms)
  cooldowns = new Collection<string, Collection<Snowflake, number>>()
}
