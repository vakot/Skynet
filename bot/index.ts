require('tsconfig-paths').register()
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' })

import { SkynetClient } from '@bot/client'
import { GatewayIntentBits } from 'discord.js'

export const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
