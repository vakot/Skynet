import { Action } from '@bot/models/action'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/action', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: actionIds, event } = req.query

    const filter: FilterQuery<typeof Action> = {}

    if (actionIds) {
      filter._id = typeof actionIds === 'string' ? actionIds : { $in: actionIds }
    }
    if (event) {
      filter.event = event
    }

    const actions = await Action.find(filter)

    return res.status(200).json(actions)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/action', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved action')
    }

    const action = await Action.create(req.body)

    if (!action) {
      return res.status(422).send('unable to create action')
    }

    return res.status(200).json(action)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
