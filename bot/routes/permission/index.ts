import { PermissionFlagsBits } from 'discord.js'
import express from 'express'

const router = express.Router()

router.get('/permission', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const serialized = JSON.stringify(PermissionFlagsBits, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )

    if (!serialized) {
      throw new Error('failed to serialize pemissions fields')
    }

    const json = JSON.parse(serialized)

    if (!json) {
      throw new Error('failed to parse pemissions fields into response')
    }

    return res.status(200).json(json)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
