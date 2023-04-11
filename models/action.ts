import { ClientEvents } from 'discord.js'

export interface IAction {
  data: {
    name: string
  }
  trigger: keyof ClientEvents
  execute(...args: any): any
}
