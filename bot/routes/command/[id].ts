import { client } from '@bot/index'
import { isCommand } from '@bot/utils/command'
import express from 'express'

const router = express.Router()

router.get('/command/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { guild: guildId } = req.query

    if (!guildId || typeof guildId !== 'string') {
      return res.status(400).send('unresolved guild id')
    }

    const command = await client.findCommand(req.params.id, guildId)

    if (!command) {
      return res.status(404).send('unknown command')
    }

    return res.status(200).json(command)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/command/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved command')
    }

    if (!isCommand(req.body)) {
      return res.status(403).send('incompatible command')
    }

    const { guild: guildId } = req.query

    if (!guildId || typeof guildId !== 'string') {
      return res.status(400).send('unresolved guild id')
    }

    const command = await client.findCommand(req.params.id, guildId)

    if (!command) {
      return res.status(404).send('unknown command')
    }

    if (!command.guildId) {
      return res.status(403).send('global commands not supported')
    }

    if (command.guildId !== guildId) {
      return res.status(403).send('access to other guilds restricted')
    }

    const updatedCommand = await client.updateCommand(req.params.id, req.body, guildId)

    return res.status(200).json(updatedCommand)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
