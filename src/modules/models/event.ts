import { ClientEvents } from 'discord.js'

export interface IEvent {
  name: keyof ClientEvents
  init: (...args: any) => any
}
