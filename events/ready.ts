import { Events, ActivityType } from 'discord.js'

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    console.log('Status updating')

    await client.user.setActivity({
      name: 'Skyline',
      type: ActivityType.Watching,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    })
    console.log('Status updated\n')

    console.log(`Logged in as ${client.user!.tag}!\n`)
  },
}
