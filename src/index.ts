require('dotenv').config()
import { Client, GatewayIntentBits } from 'discord.js'
import eventHandler from './handlers/event'
import registerCommands from './utils/registerCommands'
import logger from './utils/logger'

// Discord client object
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

;(async () => {
  await eventHandler(client)

  await client.login(process.env.TOKEN)
})()
