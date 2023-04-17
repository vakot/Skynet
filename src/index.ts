require('dotenv').config()

import { Client, GatewayIntentBits } from 'discord.js'

import { setupEvents } from './utils/setup/setupEvents'
import { setupActions } from './utils/setup/setupActions'

import logger from './utils/helpers/logger'

const client = new Client({
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
  logger.info('RUNNING SKYSOFT KERNEL 4.92.384.42')

  await setupActions().catch(logger.error)

  await setupEvents(client).catch(logger.error)

  logger.info(`Loaded in ${Date.now() - startTime}ms`)

  client
    .login(process.env.TOKEN)
    .then(() => logger.info(`Logged in ${Date.now() - startTime}ms`))
})()
