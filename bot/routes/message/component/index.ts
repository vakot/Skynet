import { MessageComponent } from '@bot/models/message'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/message/component', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: messageComponentIds } = req.query

    const filter: FilterQuery<typeof MessageComponent> = {}

    if (messageComponentIds) {
      filter._id =
        typeof messageComponentIds === 'string' ? messageComponentIds : { $in: messageComponentIds }
    }

    const messageComponents = await MessageComponent.find(filter)

    return res.status(200).json(messageComponents)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/message/component', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved message component')
    }

    const messageComponent = await MessageComponent.create(req.body)

    if (!messageComponent) {
      return res.status(422).send('unable to create message component')
    }

    return res.status(200).json(messageComponent)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
