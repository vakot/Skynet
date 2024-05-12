import { PermissionsBitField } from 'discord.js'
import express from 'express'

const router = express.Router()

router.get('/permission/:bit', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { bit } = req.params

    if (bit === null || !Number.isSafeInteger(bit)) {
      return res.status(400).json('incompatible bit')
    }

    const intBit = BigInt(Number(bit))

    if (!intBit) {
      return res.status(400).json('unresolved bit')
    }

    const permissionsBitField = new PermissionsBitField(intBit)

    if (!permissionsBitField) {
      return res.status(404).json('unknown permission fields')
    }

    const serialized = JSON.stringify(permissionsBitField, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )

    if (!serialized) {
      throw new Error('failed to serialize pemission fields')
    }

    const json = JSON.parse(serialized)

    if (!json) {
      throw new Error('failed to parse pemission fields into response')
    }

    return res.status(200).json(json)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
