import { Automation } from '@bot/models/automation'
import express from 'express'

const router = express.Router()

router.get('/automation/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const automation = await Automation.findById(req.params.id)

    if (!automation) {
      return res.status(404).send('unknown automation')
    }

    return res.status(200).json(automation)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/automation/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved automation')
    }

    if (!req.body.guild) {
      return res.status(400).json('unresolved guild id')
    }

    const automation = await Automation.findByIdAndUpdate(req.params.id, req.body)

    if (!automation) {
      return res.status(404).send('unknown automation')
    }

    return res.status(200).json(automation)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
