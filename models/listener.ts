import { ClientEvents } from 'discord.js'

export interface IListener {
  event: keyof ClientEvents
  once?: Boolean
}
