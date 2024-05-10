require('tsconfig-paths').register()
require('dotenv').config({ path: '.env.local' })

import { SkynetClient } from '@bot/client'
import SkynetCategories from '@bot/libs/categories'
import { Action } from '@bot/models/action'
import { Category, ICategory } from '@bot/models/category'
import { Guild } from '@bot/models/guild'
import { IListener, Listener } from '@bot/models/listener'
import { createCommand, findCommand, isCommand, updateCommand } from '@bot/utils/command'
import { parseIds } from '@bot/utils/helpers/parseIds'
import { GatewayIntentBits, PermissionFlagsBits, PermissionsBitField } from 'discord.js'
import express from 'express'
import mongoose, { FilterQuery } from 'mongoose'

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
      return res.status(405).json('incompatible method')
    }

    return res.status(200).json(client.user)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/client/guild', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    // TODO: get mutual guilds

    return res.status(200).json(client?.guilds?.cache)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/client/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { id: guildId } = req.params

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await client.guilds.fetch(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    return res.status(200).json(guild)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/guild', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { ids: guildIds } = req.query

    const guilds = await Guild.find({
      ...(!!guildIds && { _id: { $in: guildIds } }),
    })

    return res.status(200).json(guilds)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { id: guildId } = req.params

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    return res.status(200).json(guild)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.post(baseURL + '/guild', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved guild')
    }

    const { id: guildId } = req.query

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(403).json('guild with provided id is already exists')
    }

    const updatedGuild = await Guild.create({
      _id: guildId,
      ...req.body,
    })

    return res.status(200).json(updatedGuild)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.patch(baseURL + '/guild/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved guild')
    }

    const { id: guildId } = req.params

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    const updatedGuild = await Guild.findByIdAndUpdate(guildId, req.body)

    return res.status(200).json(updatedGuild)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/action', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { ids: actionIds } = req.query

    const actions = await Action.find({
      ...(!!actionIds && { _id: { $in: actionIds } }),
    })

    return res.status(200).json(actions)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/action/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const action = await Action.findById(req.params.id)

    return res.status(200).json(action)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.post(baseURL + '/action', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json('incompatible method')
    }

    const action = await Action.create(req.body)

    return res.status(200).json(action)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.patch(baseURL + '/action/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json('incompatible method')
    }

    if (req.method !== 'PATCH') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved action')
    }

    const { id: actionId } = req.params

    if (!actionId) {
      return res.status(400).json('unresolved action id')
    }

    const action = await Action.findById(actionId)

    if (!action) {
      return res.status(404).json('unknown action')
    }

    const updatedAction = await Action.findByIdAndUpdate(actionId, req.body)

    return res.status(200).json(updatedAction)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/client/command', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { ids: commandIds, guild: guildId } = req.query

    // TODO: filter commands

    const commands = client.application?.commands.cache

    return res.status(200).json(commands)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/client/command/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { id: commandId } = req.params
    const { guild: guildId } = req.query

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    if (!commandId) {
      return res.status(400).json('unresolved command id')
    }

    const command = await findCommand(client, commandId, guild._id)

    if (!command) {
      return res.status(404).json('unknown command')
    }

    if (!command.guildId) {
      return res.status(403).json('global commands not supported')
    }

    if (command.guildId !== guildId) {
      return res.status(403).json('access restricted')
    }

    return res.status(200).json(command)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('internal server error')
  }
})

server.post(baseURL + '/client/command', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved command')
    }

    if (!isCommand(req.body)) {
      return res.status(403).json('incompatible command')
    }

    const { guild: guildId } = req.query

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    const createdCommand = await createCommand(client, req.body, guild._id)

    return res.status(200).json(createdCommand)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.patch(baseURL + '/client/command/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved command')
    }

    if (!isCommand(req.body)) {
      return res.status(403).json('incompatible command')
    }

    const { id: commandId } = req.params
    const { guild: guildId } = req.query

    if (!guildId) {
      return res.status(400).json('unresolved guild id')
    }

    const guild = await Guild.findById(guildId)

    if (!guild) {
      return res.status(404).json('unknown guild')
    }

    if (!commandId) {
      return res.status(400).json('unresolved command id')
    }

    const command = await findCommand(client, commandId)

    if (!command) {
      return res.status(404).json('unknown command')
    }

    if (!command.guildId) {
      return res.status(403).json('global commands not supported')
    }

    if (command.guildId !== guildId) {
      return res.status(403).json('access restricted')
    }

    const updatedCommand = await updateCommand(client, command.id, req.body)

    return res.status(200).json(updatedCommand)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/listener', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { ids: listenerIds, guild: guildId, event } = req.query

    const filter: FilterQuery<IListener> = {}

    if (listenerIds) {
      filter._id = { $in: listenerIds }
    }

    const actions = await Action.find({ event })

    if (actions) {
      filter.action = { $in: actions.map(({ _id }) => _id) }
    }

    if (guildId) {
      filter.guild = guildId
    }

    const listeners = await Listener.find(filter)

    return res.status(200).json(listeners)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.post(baseURL + '/listener', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved listener')
    }

    const listener = await Listener.create(req.body)

    return res.status(200).json(listener)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/client/permissions', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { bit } = req.query

    const permissions = bit ? new PermissionsBitField(BigInt(Number(bit))) : PermissionFlagsBits

    const serialized = JSON.stringify(permissions, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
    const json = JSON.parse(serialized)

    return res.status(200).json(json)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/action-category', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { ids: categoryIds } = req.query as { ids: string | string[] }

    const filter: FilterQuery<ICategory> = {}

    const { objectIds, globalIds } = parseIds(
      typeof categoryIds === 'string' ? [categoryIds] : categoryIds
    )

    if (objectIds.length) {
      filter._id = { $in: objectIds }
    }

    const categories = await Category.find(filter)
    const skynetCategories = globalIds.length
      ? SkynetCategories.filter(({ _id }) => globalIds.includes(_id))
      : SkynetCategories

    return res.status(200).json([...skynetCategories, ...categories])
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.get(baseURL + '/action-category/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json('incompatible method')
    }

    const { id: categoryId } = req.params

    if (mongoose.isValidObjectId(categoryId)) {
      const category = await Category.findById(categoryId)
      return res.status(200).json(category)
    } else {
      const category = SkynetCategories.find((category) => category._id === categoryId)
      return res.status(200).json(category)
    }
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.post(baseURL + '/action-category', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved category')
    }

    const category = await Category.create(req.body)

    return res.status(200).json(category)
  } catch (error) {
    client.logger.error(error)
    return res.status(500).json('unexpected server error')
  }
})

server.listen(process.env.CLIENT_PORT ?? 3001)
