import 'module-alias/register'
import 'dotenv/config'

import { GatewayIntentBits } from 'discord.js'
import mongoose from 'mongoose'

import { SkynetClient } from '@modules/models/client'

import { loadActions } from '@utils/setup/loadActions'
import { loadPlugins } from '@utils/setup/loadPlugins'
import { pushCommands } from '@utils/setup/pushCommands'
import { loadEvents } from '@utils/setup/loadEvents'

import logger from '@utils/helpers/logger'

export const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

async function main() {
  console.clear()

  const startTime = Date.now()

  logger.info('[SYSTEM INITIALIZATION]')
  await client.login(process.env.TOKEN || '')
  await client.setMaxListeners(0)
  logger.info('RUNNING SKYSOFT KERNEL 4.92.384.42')

  await loadActions(client).catch((error) => {
    logger.error('Error appears while actions loading')
    logger.error(error)
  })

  await loadPlugins(client).catch((error) => {
    logger.error('Error appears while plugins loading')
    logger.error(error)
  })

  await loadEvents(client).catch((error) => {
    logger.error('Error appears while events loading')
    logger.error(error)
  })

  await pushCommands(client).catch((error) => {
    logger.error('Error appears while updating commands')
    logger.error(error)
  })

  await mongoose.connect(process.env.MONGODB_TOKEN || '').catch((error) => {
    logger.error('Error appears while connectiong to database')
    logger.error(error)
  })

  logger.info(`System startup in ${((Date.now() - startTime) * 0.001).toFixed(3)}s`)
}

main()
