require('tsconfig-paths').register()
require('dotenv').config({ path: '.env.local' })

import { SkynetClient } from '@bot/client'
import { GatewayIntentBits } from 'discord.js'
import express from 'express'

const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const baseURL = '/api'
const server = express()
client.load()

server.get(baseURL + '/client', (req, res) => {
  if (req.method === 'GET') {
    try {
      return res.status(200).json(client.user)
    } catch (error) {
      return res.status(500).json({ error: 'unexpected server error' })
    }
  }
})
server.get(baseURL + '/client/mutual', (req, res) => {
  if (req.method === 'GET') {
    try {
      // TODO: get mutual guilds
      return res.status(200).json(client?.guilds?.cache)
    } catch (error) {
      return res.status(500).json({ error: 'unexpected server error' })
    }
  }
})

server.listen(process.env.CLIENT_PORT ?? 3001)
