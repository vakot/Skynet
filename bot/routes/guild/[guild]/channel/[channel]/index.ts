// import { client } from '@bot/index'
// import express from 'express'

// const router = express.Router()

// router.get('/guild/channel/:id', async (req, res) => {
//   try {
//     if (req.method !== 'GET') {
//       return res.status(405).send('incompatible method')
//     }

//     const { id: guildId } = req.params

//     if (!guildId) {
//       return res.status(400).send('unresolved guild id')
//     }

//     const guild = await client.guilds.fetch(guildId)

//     if (!guild) {
//       return res.status(404).send('unknown guild')
//     }

//     return res.status(200).json(guild)
//   } catch (error) {
//     return res.status(500).send(error)
//   }
// })

// export default router
