import { ClientEvents } from 'discord.js'

export interface IEvent {
  name: keyof ClientEvents
  once?: Boolean
  execute(...args: any): any
}
