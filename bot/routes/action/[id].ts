import { Action } from '@bot/models/action'
import express from 'express'

const router = express.Router()

router.get('/action/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const action = await Action.findById(req.params.id)

    if (!action) {
      return res.status(404).send('unknown action')
    }

    return res.status(200).json(action)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/action/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved action')
    }

    const action = await Action.findByIdAndUpdate(req.params.id, req.body)

    if (!action) {
      return res.status(404).send('unknown action')
    }

    return res.status(200).json(action)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
