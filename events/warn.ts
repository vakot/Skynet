import { Events } from 'discord.js'
import { IEvent } from '../models/event'

export default <IEvent>{
  name: Events.Warn,
  async execute(info) {
    console.warn(info)
  },
}
