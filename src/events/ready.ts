import { Client } from 'discord.js'
import logger from '../../src/utils/logger'
import registerCommands from '../utils/registerCommands'

export default async function (client: Client) {
  logger.info(`Logged in as ${client.user.tag}`)

  await registerCommands(client)
}
