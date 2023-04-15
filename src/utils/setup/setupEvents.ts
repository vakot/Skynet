import { Client } from 'discord.js'

import store from '../helpers/store'

export default function (client: Client) {
  const events = store.get('events')

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
}
