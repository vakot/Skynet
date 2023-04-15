require('dotenv').config()
import { Client, GatewayIntentBits } from 'discord.js'
import loadFiles from './utils/setup/loadFiles'
import setupEvents from './utils/setup/setupEvents'

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
  await loadFiles()

  await setupEvents(client)

  await client.login(process.env.TOKEN)
})()
