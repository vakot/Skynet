import { MessageComponent } from '@bot/models/message'
import express from 'express'

const router = express.Router()

router.get('/message/component/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const messageComponent = await MessageComponent.findById(req.params.id)

    if (!messageComponent) {
      return res.status(404).send('unknown message component')
    }

    return res.status(200).json(messageComponent)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/message/component/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved message component')
    }

    const messageComponent = await MessageComponent.findByIdAndUpdate(req.params.id, req.body)

    if (!messageComponent) {
      return res.status(404).send('unknown message component')
    }

    return res.status(200).json(messageComponent)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
