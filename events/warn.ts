import { Events } from 'discord.js'

module.exports = {
  name: Events.Warn,
  async execute(info) {
    console.warn(info)
  },
}
