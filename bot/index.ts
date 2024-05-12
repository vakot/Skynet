require('tsconfig-paths').register()
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' })

import { GatewayIntentBits } from 'discord.js'
import { SkynetClient } from './client'

export const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
