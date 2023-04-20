require('dotenv').config()

import { GatewayIntentBits } from 'discord.js'

import { Client } from './models/client'

import logger from './utils/helpers/logger'

import { loadActions } from './utils/setup/loadActions'
import { loadEvents } from './utils/setup/loadEvents'
import { loadPlugins } from './utils/setup/loadPlugins'
import { pushCommands } from './utils/setup/pushCommands'

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
;(async () => {
  console.clear()

  const startTime = Date.now()

  logger.info('[SYSTEM INITIALIZATION]')
  await client.login(process.env.TOKEN)
  logger.info('RUNNING SKYSOFT KERNEL 4.92.384.42')

  logger.debug('Actions loading')
  await loadActions(client).catch((error) => {
    logger.error('Error appears while actions loading')
    logger.error(error)
  })

  await loadPlugins(client).catch((error) => {
    logger.error('Error appears while plugins loading')
    logger.error(error)
  })

  logger.debug('Events loading')
  await loadEvents(client).catch((error) => {
    logger.error('Error appears while events loading')
    logger.error(error)
  })

  logger.debug('Updating commands on remote')
  await pushCommands(client).catch((error) => {
    logger.error('Error appears while updating commands')
    logger.error(error)
  })

  logger.info(`System startup in ${(Date.now() - startTime) * 0.001}s`)
})()
