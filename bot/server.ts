require('tsconfig-paths').register()
require('dotenv').config({ path: '.env.local' })

import { SkynetClient } from '@bot/client'
import { Action } from '@bot/models/action'
import { Guild } from '@bot/models/guild'
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

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.get(baseURL + '/client', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(500).json({ error: 'wrong method' })
    }

    return res.status(200).json(client.user)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/client/guild', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(500).json({ error: 'wrong method' })
    }

    // TODO: get mutual guilds

    return res.status(200).json(client?.guilds?.cache)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/client/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(500).json({ error: 'wrong method' })
    }

    // TODO: get mutual guilds

    return res.status(200).json(client?.guilds?.cache.find((guild) => guild.id === req.params.id))
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/guild', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    const { ids: guildIds } = req.query

    const guilds = await Guild.find({
      ...(!!guildIds && { _id: { $in: guildIds } }),
    })

    return res.status(200).json(guilds)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    const guild = await Guild.findById(req.params.id)

    if (!guild) {
      // TODO: check client guilds
      return res.status(200).json(await Guild.create({ _id: req.params.id }))
    }

    return res.status(200).json(guild)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.post(baseURL + '/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    if (!req.body) {
      return res.status(403).json({ error: 'incompatible body' })
    }

    if (!req.params.id) {
      return res.status(403).json({ error: 'incompatible guild id' })
    }

    const guild = await Guild.findById(req.params.id)

    if (!guild) {
      return res.status(200).json(await Guild.create({ _id: req.params.id, ...req.body }))
    } else {
      return res.status(200).json(await Guild.findByIdAndUpdate(req.params.id, req.body))
    }
  } catch (error) {
    console.log(error)

    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/action', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    const { ids: actionIds } = req.query

    const actions = await Action.find({
      ...(!!actionIds && { _id: { $in: actionIds } }),
    })

    return res.status(200).json(actions)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.get(baseURL + '/action/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    const action = await Action.findById(req.params.id)

    return res.status(200).json(action)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.post(baseURL + '/action/:id', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(403).json({ error: 'incompatible method' })
    }

    const action = await Action.findById(req.params.id)

    return res.status(200).json(action)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json({ error: 'unexpected server error' })
  }
})

server.listen(process.env.CLIENT_PORT ?? 3001)
