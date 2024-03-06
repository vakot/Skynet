import { SkynetClient } from '@modules/models/client'
import { ClientEvents } from 'discord.js'

export interface IEvent {
  type: keyof ClientEvents
  once?: boolean
  init: (client: SkynetClient, ...args: any) => any
}
