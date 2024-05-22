import { client } from '@bot/index'
import { isCommand } from '@bot/utils/command'
import express from 'express'

const router = express.Router()

router.get('/command', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: commandIds, guild: guildId } = req.query

    if (guildId && typeof guildId === 'string') {
      const commands = await client.findCommands(commandIds as string[], guildId)
      return res.status(200).json(commands)
    } else {
      const commands = await client.findCommands(commandIds as string[])
      return res.status(200).json(commands)
    }
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/command', async (req, res) => {
  try {
    if (req.method !== 'POST') {
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

    const command = await client.createCommand(req.body, guildId as string)

    return res.status(200).json(command)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
