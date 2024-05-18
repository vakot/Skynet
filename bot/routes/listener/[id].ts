import { Listener } from '@bot/models/listener'
import express from 'express'

const router = express.Router()

router.get('/listener/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const listener = await Listener.findById(req.params.id).populate('action')

    if (!listener) {
      return res.status(404).send('unknown listener')
    }

    return res.status(200).json(listener)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/listener/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved listener')
    }

    if (!req.body.guild) {
      return res.status(400).json('unresolved guild id')
    }

    const listener = await Listener.findByIdAndUpdate(req.params.id, req.body).populate('action')

    if (!listener) {
      return res.status(404).send('unknown listener')
    }

    return res.status(200).json(listener)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
