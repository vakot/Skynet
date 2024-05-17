import { Message } from '@bot/models/message'
import express from 'express'

const router = express.Router()

router.get('/message/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).send('unknown message')
    }

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/message/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved message')
    }

    const message = await Message.findByIdAndUpdate(req.params.id, req.body)

    if (!message) {
      return res.status(404).send('unknown message')
    }

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
