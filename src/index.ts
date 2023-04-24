require('dotenv').config()

import { GatewayIntentBits } from 'discord.js'

import mongoose from 'mongoose'

import { Client } from './models/client'

import logger from './utils/helpers/logger'

import { loadActions } from './utils/setup/loadActions'
import { loadDBActions } from './utils/setup/loadDBActions'
import { loadPlugins } from './utils/setup/loadPlugins'
import { loadEvents } from './utils/setup/loadEvents'
import { loadCategories } from './utils/setup/loadCategories'
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
  await client.login(process.env.TOKEN || '')
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

  logger.debug('Categories loading')
  await loadCategories(client).catch((error) => {
    logger.error('Error appears while categories loading')
    logger.error(error)
  })

  logger.debug('DB Actions loading')
  await loadDBActions(client).catch((error) => {
    logger.error('Error appears while actions loading')
    logger.error(error)
  })

  logger.debug('Event listreners creating')
  await loadEvents(client).catch((error) => {
    logger.error('Error appears while event listreners creating')
    logger.error(error)
  })

  logger.debug('Updating commands on remote')
  await pushCommands(client).catch((error) => {
    logger.error('Error appears while updating commands')
    logger.error(error)
  })

  await mongoose.connect(process.env.MONGODB_TOKEN || '').catch((error) => {
    logger.error('Error appears while connectiong to database')
    logger.error(error)
  })

  logger.info(
    `System startup in ${((Date.now() - startTime) * 0.001).toFixed(3)}s`
  )
})()
