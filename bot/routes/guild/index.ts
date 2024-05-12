import { client } from '@bot/index'
import express from 'express'

const router = express.Router()

router.get('/guild', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    // TODO: get mutual guilds

    return res.status(200).json(client.guilds.cache)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
