import { Events, ErrorEvent } from 'discord.js'

module.exports = {
  name: Events.Error,
  async execute(error: ErrorEvent) {
    console.error(error.message)
  },
}
