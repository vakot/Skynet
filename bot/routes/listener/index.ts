import { Listener } from '@bot/models/listener'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/listener', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: listenerIds, guild: guildId, action: actionId } = req.query

    const filter: FilterQuery<typeof Listener> = {}

    if (listenerIds) {
      filter._id = typeof listenerIds === 'string' ? listenerIds : { $in: listenerIds }
    }

    if (guildId) {
      filter.$or = [
        { guild: typeof guildId === 'string' ? guildId : { $in: guildId } },
        { guild: { $exists: false } },
        { guild: null },
      ]
    }

    if (actionId) {
      filter.action = typeof actionId === 'string' ? actionId : { $in: actionId }
    }

    const listeners = await Listener.find(filter).populate('action')

    return res.status(200).json(listeners)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/listener', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved listener')
    }

    if (!req.body.guild) {
      return res.status(400).json('unresolved guild id')
    }

    const listener = await Listener.create(req.body)

    if (!listener) {
      return res.status(422).send('unable to create listener')
    }

    return res.status(200).json(listener)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
