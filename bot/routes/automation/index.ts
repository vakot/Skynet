import { Automation } from '@bot/models/automation'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/automation', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: automationIds, guild: guildId, action: actionId, event } = req.query

    const filter: FilterQuery<typeof Automation> = {}

    if (automationIds) {
      filter._id = typeof automationIds === 'string' ? automationIds : { $in: automationIds }
    }

    if (guildId) {
      filter.$or = [
        { guild: typeof guildId === 'string' ? guildId : { $in: guildId } },
        { guild: { $exists: false } },
        { guild: null },
      ]
    }

    if (event) {
      filter.event = event
    }

    const automations = await Automation.find(filter)

    return res.status(200).json(automations)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/automation', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved automation')
    }

    if (!req.body.guild) {
      return res.status(400).json('unresolved guild id')
    }

    const automation = await Automation.create(req.body)

    if (!automation) {
      return res.status(422).send('unable to create automation')
    }

    return res.status(200).json(automation)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
