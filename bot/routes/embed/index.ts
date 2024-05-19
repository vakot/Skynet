import { Embed } from '@bot/models/message'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/embed', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: embedIds } = req.query

    const filter: FilterQuery<typeof Embed> = {}

    if (embedIds) {
      filter._id = typeof embedIds === 'string' ? embedIds : { $in: embedIds }
    }

    const embeds = await Embed.find(filter)

    return res.status(200).json(embeds)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/embed', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved embed')
    }

    const embed = await Embed.create(req.body)

    if (!embed) {
      return res.status(422).send('unable to create embed')
    }

    return res.status(200).json(embed)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
