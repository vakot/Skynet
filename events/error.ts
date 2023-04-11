import { Events, ErrorEvent } from 'discord.js'
import { IEvent } from '../models/event'

export default <IEvent>{
  name: Events.Error,
  async execute(error: ErrorEvent) {
    console.error(error.message)
  },
}
