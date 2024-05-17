import { Embed } from '@bot/models/embed'
import express from 'express'

const router = express.Router()

router.get('/embed/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const embed = await Embed.findById(req.params.id)

    if (!embed) {
      return res.status(404).send('unknown embed')
    }

    return res.status(200).json(embed)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/embed/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved embed')
    }

    const embed = await Embed.findByIdAndUpdate(req.params.id, req.body)

    if (!embed) {
      return res.status(404).send('unknown embed')
    }

    return res.status(200).json(embed)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
