import { client } from '@bot/index'
import express from 'express'

const router = express.Router()

router.get('/guild/:guild/channel', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { guild: guildId } = req.params

    if (!guildId) {
      return res.status(400).send('unresolved guild id')
    }

    const guild = await client.guilds.fetch(guildId)

    if (!guild) {
      return res.status(404).send('unknown guild')
    }

    const channels = await guild.channels.fetch()

    return res.status(200).json(Array.from(channels.values()))
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
