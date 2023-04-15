import { Client } from 'discord.js'
import path from 'path'

import getEvents from '../utils/getEvents'

export default async function (client: Client) {
  const events = await getEvents(path.join(__dirname, '..', 'events'))

  for (const event of events) {
    client.on(event.name, async (...args) => {
      await event.callback(...args)
    })
  }
}
