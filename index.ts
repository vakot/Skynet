import 'dotenv/config'
import 'module-alias/register'

import { GatewayIntentBits } from 'discord.js'

import { SkynetClient } from '@modules/models/client'

import { loadActions } from '@utils/setup/loadActions'
import { loadPlugins } from '@utils/setup/loadPlugins'
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

async function Main() {
  client.loadingStartAt = new Date()

  await client.login(process.env.TOKEN || '')
  await client.setMaxListeners(0)

  await loadActions(client).catch((error) => {
    logger.error('Error appears while actions loading')
    logger.error(error)
  })

  await loadPlugins(client).catch((error) => {
    logger.error('Error appears while plugins loading')
    logger.error(error)
  })

  await loadEvents(client).catch((error) => {
    logger.error('Error appears while events listeners creating')
    logger.error(error)
  })

  client.loadingEndedAt = new Date()
}

Main()
