import { Events } from 'discord.js'

export interface IOldEvent {
  name: string
  callback: Function
}

export interface IEvent {
  name: Events
  once?: boolean
  execute(...args: any): any
}
