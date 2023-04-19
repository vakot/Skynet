import { Collection, Client as DiscordClient, Snowflake } from 'discord.js'

import { Action } from './Action'

export class Client extends DiscordClient {
  localActions = new Collection<string, Action>()
  localCommands = new Collection<string, Action>()

  cooldowns = new Collection<string, Collection<Snowflake, number>>()
}
