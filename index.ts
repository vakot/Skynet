require('tsconfig-paths/register')
require('dotenv').config({ path: '.env.local' })

import { SkynetClient } from '@modules/SkynetClient'
import { Style } from '@utils/logger'
import { GatewayIntentBits } from 'discord.js'
import express from 'express'
import next from 'next'
import Package from './package.json'

const app = next({ dev: process.env.NODE_ENV !== 'production' })

export const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.logger.info(
  client.logger.color('  ▲ Skynet ' + Package.version, [Style.Bright, Style.FgRed])
)
client.logger.info('  - Local:        ' + process.env.HOSTNAME + ':' + process.env.PORT ?? 3000)
client.logger.info('  - Environments: ' + '.env.local')
client.logger.info('\n ' + client.logger.color('✓ ', [Style.Bright, Style.FgGreen]) + 'Starting...')

app.prepare().then(() => {
  const server = express()

  server.get('/api/client/user', (req, res) => {
    if (req.method === 'GET') {
      try {
        return res.status(200).json(client.user)
      } catch (error) {
        return res.status(500).json({ error: 'unexpected server error' })
      }
    }
  })
  server.get('/api/client/mutual', (req, res) => {
    if (req.method === 'GET') {
      try {
        // client?.guilds?.cache.filter((guild) => {
        //   console.log(guild.members)

        //   return guild.members.cache.find((member) => {
        //     console.log(member)
        //     console.log(member.user)

        //     return member.user.username === req.query.username
        //   })
        // })

        // // const mutual: Collection<string, Guild> | undefined = guilds?.filter((guild) => {
        // //   return !!guild.members.cache.find((member) => member.user.username === req.query.username)
        // // })

        // // if (!mutual) {
        // //   return res.status(400).json({ error: 'no mutual guilds found' })
        // // }

        // // return res.status(200).json(mutual.values())

        // TODO: get mutual guilds
        return res.status(200).json(client?.guilds?.cache)
      } catch (error) {
        return res.status(500).json({ error: 'unexpected server error' })
      }
    }
  })

  server.all('*', (req, res) => app.getRequestHandler()(req, res))

  server.listen(process.env.PORT ?? 3000)
})

export default app
