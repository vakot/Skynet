import { ClientEvents } from 'discord.js'

export interface IEvent {
  name: keyof ClientEvents
  once?: boolean
  execute(...args: any): any
}
