import { Message } from '@bot/models/message'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/message', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: messageIds } = req.query

    const filter: FilterQuery<typeof Message> = {}

    if (messageIds) {
      filter._id = typeof messageIds === 'string' ? messageIds : { $in: messageIds }
    }

    const messages = await Message.find(filter)

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/message', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved message')
    }

    const message = await Message.create(req.body)

    if (!message) {
      return res.status(422).send('unable to create message')
    }

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
